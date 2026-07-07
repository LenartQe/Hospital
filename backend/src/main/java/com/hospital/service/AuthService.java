package com.hospital.service;

import com.hospital.config.AuthDataInitializer;
import com.hospital.entity.AppUser;
import com.hospital.entity.Doctor;
import com.hospital.entity.Patient;
import com.hospital.entity.PatientProfile;
import com.hospital.entity.UserRole;
import com.hospital.repository.AppUserRepository;
import com.hospital.repository.DoctorRepository;
import com.hospital.repository.PatientProfileRepository;
import com.hospital.repository.PatientRepository;
import com.hospital.security.JwtService;
import com.hospital.util.DoctorCatalog;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

  private static final String GUEST_PASSWORD = "guest";

  private final AppUserRepository appUserRepository;
  private final PatientProfileRepository patientProfileRepository;
  private final PatientService patientService;
  private final PatientRepository patientRepository;
  private final DoctorRepository doctorRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;

  public AuthService(
      AppUserRepository appUserRepository,
      PatientProfileRepository patientProfileRepository,
      PatientService patientService,
      PatientRepository patientRepository,
      DoctorRepository doctorRepository,
      PasswordEncoder passwordEncoder,
      JwtService jwtService) {
    this.appUserRepository = appUserRepository;
    this.patientProfileRepository = patientProfileRepository;
    this.patientService = patientService;
    this.patientRepository = patientRepository;
    this.doctorRepository = doctorRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
  }

  public AuthResult login(String email, String password, UserRole expectedRole, Long doctorId) {
    if (expectedRole == UserRole.ADMIN) {
      AppUser admin =
          appUserRepository
              .findFirstByRole(UserRole.ADMIN)
              .orElseThrow(
                  () ->
                      new ResponseStatusException(
                          HttpStatus.SERVICE_UNAVAILABLE,
                          "Llogaria e administratorit nuk është konfiguruar."));
      return toAuthResult(admin);
    }

    if (expectedRole == UserRole.DOCTOR) {
      return loginDoctor(email, password, doctorId);
    }

    if (expectedRole == UserRole.PATIENT) {
      return loginPatient(email, password);
    }

    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Roli nuk mbështetet.");
  }

  private AuthResult loginPatient(String email, String password) {
    String normalized = normalizeEmail(email, UserRole.PATIENT);
    Optional<AppUser> existing = appUserRepository.findByEmail(normalized);

    if (existing.isPresent()) {
      AppUser user = existing.get();
      if (user.getRole() != UserRole.PATIENT) {
        throw new ResponseStatusException(
            HttpStatus.BAD_REQUEST,
            "Ky email përdoret për llogari mjeku ose administratori. Hyni nga skeda e duhur.");
      }
      verifyPatientPassword(user, password);
      ensurePatientProfile(user);
      return toAuthResult(user);
    }

    AppUser user = new AppUser();
    user.setEmail(normalized);
    user.setPasswordHash(passwordEncoder.encode(effectivePatientPassword(password)));
    user.setRole(UserRole.PATIENT);
    user.setFullName(nameFromEmail(normalized));
    user = appUserRepository.save(user);
    ensurePatientProfile(user);
    return toAuthResult(user);
  }

  private AuthResult loginDoctor(String email, String password, Long doctorId) {
    if (email == null || email.isBlank()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Zgjidhni mjekun nga lista.");
    }
    if (password == null || password.isBlank()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Fjalëkalimi është i detyrueshëm.");
    }
    String normalized = email.trim().toLowerCase();
    AppUser user =
        appUserRepository
            .findByEmail(normalized)
            .filter(u -> u.getRole() == UserRole.DOCTOR)
            .orElseThrow(
                () ->
                    new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Email-i ose fjalëkalimi është i gabuar."));
    if (!passwordEncoder.matches(password, user.getPasswordHash())) {
      throw new ResponseStatusException(
          HttpStatus.UNAUTHORIZED, "Email-i ose fjalëkalimi është i gabuar.");
    }
    ensureDoctorLinked(user, doctorId);
    return toAuthResult(user);
  }

  public AuthResult registerPatient(String email, String password, String fullName, String phone) {
    if (email == null || email.isBlank()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email-i është i detyrueshëm.");
    }
    if (password == null || password.isBlank()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Fjalëkalimi është i detyrueshëm.");
    }

    String normalized = normalizeEmail(email, UserRole.PATIENT);
    Optional<AppUser> existing = appUserRepository.findByEmail(normalized);
    if (existing.isPresent()) {
      AppUser user = existing.get();
      if (user.getRole() != UserRole.PATIENT) {
        throw new ResponseStatusException(
            HttpStatus.CONFLICT,
            "Ky email është i regjistruar si mjek ose administrator. Përdorni një email tjetër.");
      }
      throw new ResponseStatusException(
          HttpStatus.CONFLICT, "Ky email ekziston tashmë. Hyni me fjalëkalimin tuaj.");
    }

    AppUser user = new AppUser();
    user.setEmail(normalized);
    user.setPasswordHash(passwordEncoder.encode(password));
    user.setRole(UserRole.PATIENT);
    user.setFullName(
        fullName != null && !fullName.isBlank() ? fullName.trim() : nameFromEmail(normalized));
    user.setPhone(phone);
    user = appUserRepository.save(user);
    ensurePatientProfile(user);
    return toAuthResult(user);
  }

  private void verifyPatientPassword(AppUser user, String password) {
    String attempt = effectivePatientPassword(password);
    if (passwordEncoder.matches(attempt, user.getPasswordHash())) {
      return;
    }
    if (passwordEncoder.matches(GUEST_PASSWORD, user.getPasswordHash())) {
      return;
    }
    if (passwordEncoder.matches(AuthDataInitializer.DEMO_PASSWORD, user.getPasswordHash())
        && (password == null
            || password.isBlank()
            || AuthDataInitializer.DEMO_PASSWORD.equals(password)
            || GUEST_PASSWORD.equals(attempt))) {
      return;
    }
    throw new ResponseStatusException(
        HttpStatus.UNAUTHORIZED, "Email-i ose fjalëkalimi është i gabuar.");
  }

  private String effectivePatientPassword(String password) {
    if (password == null || password.isBlank()) {
      return GUEST_PASSWORD;
    }
    return password;
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
    if (user.getEmail() != null && !user.getEmail().isBlank()) {
      patient =
          patientRepository
              .findByEmail(user.getEmail().trim().toLowerCase())
              .filter(existing -> existing.getUserId() == null)
              .map(
                  existing -> {
                    existing.setUserId(user.getId());
                    return patientRepository.save(existing);
                  })
              .orElse(patient);
    }
    final Patient linkedPatient = patient;
    if (profile.getPatient() == null || !linkedPatient.getId().equals(profile.getPatient().getId())) {
      profile.setPatient(linkedPatient);
      if (linkedPatient.getBloodType() == null && profile.getBloodType() != null) {
        linkedPatient.setBloodType(profile.getBloodType());
      }
      if (linkedPatient.getAllergies() == null && profile.getAllergies() != null) {
        linkedPatient.setAllergies(profile.getAllergies());
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
