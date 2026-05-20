package com.hospital.service;

import com.hospital.entity.AppUser;
import com.hospital.entity.PatientProfile;
import com.hospital.entity.UserRole;
import com.hospital.repository.AppUserRepository;
import com.hospital.repository.PatientProfileRepository;
import com.hospital.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

  private final AppUserRepository appUserRepository;
  private final PatientProfileRepository patientProfileRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;

  public AuthService(
      AppUserRepository appUserRepository,
      PatientProfileRepository patientProfileRepository,
      PasswordEncoder passwordEncoder,
      JwtService jwtService) {
    this.appUserRepository = appUserRepository;
    this.patientProfileRepository = patientProfileRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
  }

  public AuthResult login(String email, String password, UserRole expectedRole) {
    AppUser user =
        appUserRepository
            .findByEmailAndRole(email.trim().toLowerCase(), expectedRole)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Kredencialet janë të pasakta."));
    if (!passwordEncoder.matches(password, user.getPasswordHash())) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Kredencialet janë të pasakta.");
    }
    return toAuthResult(user);
  }

  public AuthResult registerPatient(String email, String password, String fullName, String phone) {
    String normalized = email.trim().toLowerCase();
    if (appUserRepository.existsByEmail(normalized)) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Email ekziston tashmë.");
    }
    AppUser user = new AppUser();
    user.setEmail(normalized);
    user.setPasswordHash(passwordEncoder.encode(password));
    user.setRole(UserRole.PATIENT);
    user.setFullName(fullName.trim());
    user.setPhone(phone);
    user = appUserRepository.save(user);

    PatientProfile profile = new PatientProfile();
    profile.setUser(user);
    patientProfileRepository.save(profile);

    return toAuthResult(user);
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
