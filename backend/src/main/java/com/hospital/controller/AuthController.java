package com.hospital.controller;

import com.hospital.entity.Doctor;
import com.hospital.entity.UserRole;
import com.hospital.repository.DoctorRepository;
import com.hospital.service.AuthService;
import com.hospital.service.AuthService.AuthResult;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  private final AuthService authService;
  private final DoctorRepository doctorRepository;

  public AuthController(AuthService authService, DoctorRepository doctorRepository) {
    this.authService = authService;
    this.doctorRepository = doctorRepository;
  }

  @GetMapping("/doctor-emails")
  public List<DoctorEmailOption> doctorEmails() {
    Map<String, Doctor> byEmail = new java.util.LinkedHashMap<>();
    doctorRepository.findAll().stream()
        .filter(d -> d.getEmail() != null && !d.getEmail().isBlank())
        .sorted(Comparator.comparing(Doctor::getId))
        .forEach(
            d -> {
              String key = d.getEmail().trim().toLowerCase();
              byEmail.merge(key, d, this::preferDoctorRecord);
            });
    return byEmail.values().stream()
        .sorted(Comparator.comparing(Doctor::getFullName, Comparator.nullsLast(String::compareToIgnoreCase)))
        .map(
            d ->
                new DoctorEmailOption(
                    d.getId(), d.getFullName(), d.getEmail().trim().toLowerCase(), d.getSpecialty()))
        .toList();
  }

  private Doctor preferDoctorRecord(Doctor current, Doctor candidate) {
    if (isPreferredDoctorName(candidate.getFullName()) && !isPreferredDoctorName(current.getFullName())) {
      return candidate;
    }
    if (!isPreferredDoctorName(candidate.getFullName()) && isPreferredDoctorName(current.getFullName())) {
      return current;
    }
    return candidate.getId() != null && current.getId() != null && candidate.getId() > current.getId()
        ? candidate
        : current;
  }

  private boolean isPreferredDoctorName(String name) {
    if (name == null) {
      return false;
    }
    String normalized = name.trim();
    return !normalized.regionMatches(true, 0, "Dr.", 0, 3)
        && !normalized.regionMatches(true, 0, "Dr", 0, 2);
  }

  @PostMapping("/login")
  public AuthResult login(@RequestBody LoginRequest body) {
    UserRole role = UserRole.valueOf(body.role().toUpperCase());
    return authService.login(body.email(), body.password(), role);
  }

  @PostMapping("/register/patient")
  public AuthResult registerPatient(@RequestBody RegisterPatientRequest body) {
    return authService.registerPatient(body.email(), body.password(), body.fullName(), body.phone());
  }

  public record LoginRequest(
      @NotBlank @Email String email,
      @NotBlank String password,
      @NotBlank String role) {}

  public record RegisterPatientRequest(
      @NotBlank @Email String email,
      @NotBlank String password,
      @NotBlank String fullName,
      String phone) {}

  public record DoctorEmailOption(Long id, String fullName, String email, String specialty) {}
}
