package com.hospital.service;

import com.hospital.entity.AppUser;
import com.hospital.entity.Doctor;
import com.hospital.entity.PatientProfile;
import com.hospital.entity.UserRole;
import com.hospital.repository.AppUserRepository;
import com.hospital.repository.DoctorRepository;
import com.hospital.repository.PatientProfileRepository;
import com.hospital.security.JwtService;
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
  private final DoctorRepository doctorRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;

  public AuthService(
      AppUserRepository appUserRepository,
      PatientProfileRepository patientProfileRepository,
      DoctorRepository doctorRepository,
      PasswordEncoder passwordEncoder,
      JwtService jwtService) {
    this.appUserRepository = appUserRepository;
    this.patientProfileRepository = patientProfileRepository;
    this.doctorRepository = doctorRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
  }

  /** Open login: any email/password accepted; creates account if missing (except admin — single account). */
  public AuthResult login(String email, String password, UserRole expectedRole) {
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
      ensureDoctorLinked(user);
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
    if (patientProfileRepository.findByUserId(user.getId()).isEmpty()) {
      PatientProfile profile = new PatientProfile();
      profile.setUser(user);
      patientProfileRepository.save(profile);
    }
  }

  private void ensureDoctorLinked(AppUser user) {
    if (doctorRepository.findByUserId(user.getId()).isPresent()) {
      return;
    }
    Doctor doctor =
        doctorRepository
            .findByEmail(user.getEmail())
            .or(() -> doctorRepository.findAll().stream().filter(d -> d.getUserId() == null).findFirst())
            .or(() -> doctorRepository.findAll().stream().findFirst())
            .orElseThrow(
                () ->
                    new ResponseStatusException(
                        HttpStatus.SERVICE_UNAVAILABLE, "Nuk ka profil mjeku në sistem."));
    doctor.setUserId(user.getId());
    if (doctor.getEmail() == null || doctor.getEmail().isBlank()) {
      doctor.setEmail(user.getEmail());
    }
    doctorRepository.save(doctor);
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
