package com.hospital.service;

import com.hospital.entity.AppUser;
import com.hospital.entity.Doctor;
import com.hospital.entity.PatientProfile;
import com.hospital.entity.UserRole;
import com.hospital.repository.AppUserRepository;
import com.hospital.repository.DoctorRepository;
import com.hospital.repository.PatientProfileRepository;
import com.hospital.security.JwtService;
import com.hospital.util.DoctorCatalog;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.hospital.entity.Patient;

@Service
public class AuthService {

  private static final String GUEST_PASSWORD = "guest";

  private final AppUserRepository appUserRepository;
  private final PatientProfileRepository patientProfileRepository;
  private final PatientService patientService;
  private final DoctorRepository doctorRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;

  public AuthService(
      AppUserRepository appUserRepository,
      PatientProfileRepository patientProfileRepository,
      PatientService patientService,
      DoctorRepository doctorRepository,
      PasswordEncoder passwordEncoder,
      JwtService jwtService) {
    this.appUserRepository = appUserRepository;
    this.patientProfileRepository = patientProfileRepository;
    this.patientService = patientService;
    this.doctorRepository = doctorRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
  }

  /** Open login: any email/password accepted; creates account if missing (except admin — single account). */
  public AuthResult login(String email, String password, UserRole expectedRole, Long doctorId) {
    if (expectedRole == UserRole.ADMIN) {
      AppUser admin =
          appUserRepository
              .findFirstByRole(UserRole.ADMIN)
              .orElseThrow(
                  () ->
                      new ResponseStatusException(
                          HttpStatus.SERVICE_UNAVAILABLE, "Llogaria e administratorit nuk është konfiguruar."));
      return toAuthResult(admin);
    }

    String normalized = normalizeEmail(email, expectedRole);
    AppUser user =
        appUserRepository
            .findByEmailAndRole(normalized, expectedRole)
            .orElseGet(() -> createGuestUser(normalized, expectedRole));

    if (expectedRole == UserRole.DOCTOR) {
      ensureDoctorLinked(user, doctorId);
    } else if (expectedRole == UserRole.PATIENT) {
      ensurePatientProfile(user);
    }

    return toAuthResult(user);
  }

  public AuthResult registerPatient(String email, String password, String fullName, String phone) {
    String normalized = normalizeEmail(email, UserRole.PATIENT);
    Optional<AppUser> existing = appUserRepository.findByEmailAndRole(normalized, UserRole.PATIENT);
    if (existing.isPresent()) {
      return toAuthResult(existing.get());
    }
    AppUser user = new AppUser();
    user.setEmail(normalized);
    user.setPasswordHash(passwordEncoder.encode(GUEST_PASSWORD));
    user.setRole(UserRole.PATIENT);
    user.setFullName(fullName != null && !fullName.isBlank() ? fullName.trim() : nameFromEmail(normalized));
    user.setPhone(phone);
    user = appUserRepository.save(user);
    ensurePatientProfile(user);
    return toAuthResult(user);
  }

  private String normalizeEmail(String email, UserRole role) {
    if (email == null || email.trim().isEmpty()) {
      return "guest-" + role.name().toLowerCase() + "@hospital.local";
    }
    String trimmed = email.trim().toLowerCase();
    if (!trimmed.contains("@")) {
      return trimmed + "@hospital.local";
    }
    return trimmed;
  }

  private String nameFromEmail(String email) {
    String local = email.contains("@") ? email.substring(0, email.indexOf('@')) : email;
    return local.replace('.', ' ').replace('-', ' ');
  }

  private AppUser createGuestUser(String email, UserRole role) {
    AppUser user = new AppUser();
    user.setEmail(email);
    user.setPasswordHash(passwordEncoder.encode(GUEST_PASSWORD));
    user.setRole(role);
    user.setFullName(nameFromEmail(email));
    return appUserRepository.save(user);
  }

  private void ensurePatientProfile(AppUser user) {
    PatientProfile profile =
        patientProfileRepository
            .findByUserId(user.getId())
            .orElseGet(
                () -> {
                  PatientProfile created = new PatientProfile();
                  created.setUser(user);
                  return patientProfileRepository.save(created);
                });
    Patient patient = patientService.ensureForUser(user);
    if (profile.getPatient() == null || !patient.getId().equals(profile.getPatient().getId())) {
      profile.setPatient(patient);
      if (patient.getBloodType() == null && profile.getBloodType() != null) {
        patient.setBloodType(profile.getBloodType());
      }
      if (patient.getAllergies() == null && profile.getAllergies() != null) {
        patient.setAllergies(profile.getAllergies());
      }
      patientProfileRepository.save(profile);
    }
  }

  private void ensureDoctorLinked(AppUser user, Long doctorId) {
    Doctor doctor = resolveDoctorForLogin(user, doctorId);
    Long uid = user.getId();

    doctorRepository.findAll().stream()
        .filter(d -> d.getUserId() != null && d.getUserId().equals(uid) && !d.getId().equals(doctor.getId()))
        .forEach(
            previous -> {
              previous.setUserId(null);
              doctorRepository.save(previous);
            });

    doctorRepository.findAll().stream()
        .filter(d -> user.getEmail().equalsIgnoreCase(d.getEmail()) && !d.getId().equals(doctor.getId()))
        .forEach(
            other -> {
              other.setUserId(null);
              doctorRepository.save(other);
            });

    doctor.setUserId(uid);
    if (doctor.getEmail() == null || doctor.getEmail().isBlank()) {
      doctor.setEmail(user.getEmail());
    }
    doctorRepository.save(doctor);
  }

  private Doctor resolveDoctorForLogin(AppUser user, Long doctorId) {
    if (doctorId != null) {
      Doctor byId =
          doctorRepository
              .findById(doctorId)
              .orElseThrow(
                  () ->
                      new ResponseStatusException(
                          HttpStatus.BAD_REQUEST, "Mjeku i zgjedhur nuk u gjet."));
      if (byId.getEmail() == null || !user.getEmail().equalsIgnoreCase(byId.getEmail())) {
        throw new ResponseStatusException(
            HttpStatus.BAD_REQUEST, "Email-i nuk përputhet me mjekun e zgjedhur.");
      }
      return byId;
    }
    return doctorRepository.findAll().stream()
        .filter(d -> user.getEmail().equalsIgnoreCase(d.getEmail()) && d.isFeatured())
        .reduce(DoctorCatalog::preferDoctorRecord)
        .orElseThrow(
            () ->
                new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Ky email nuk është i regjistruar si mjek. Zgjidhni një mjek nga lista."));
  }

  private AuthResult toAuthResult(AppUser user) {
    String token = jwtService.generateToken(user);
    return new AuthResult(
        token,
        user.getId(),
        user.getEmail(),
        user.getFullName(),
        user.getRole().name(),
        user.getPhone());
  }

  public record AuthResult(
      String token, Long userId, String email, String fullName, String role, String phone) {}
}
