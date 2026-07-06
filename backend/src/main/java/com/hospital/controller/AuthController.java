package com.hospital.controller;

import com.hospital.config.AuthDataInitializer;
import com.hospital.entity.Doctor;
import com.hospital.entity.UserRole;
import com.hospital.repository.DoctorRepository;
import com.hospital.service.AuthService;
import com.hospital.service.AuthService.AuthResult;
import com.hospital.util.DoctorCatalog;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.util.Comparator;
import java.util.List;
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
  public List<DoctorLoginOption> doctorEmails() {
    return DoctorCatalog.featuredDoctors(doctorRepository.findByFeaturedTrueOrderByNameAsc()).stream()
        .map(
            d ->
                new DoctorLoginOption(
                    d.getId(),
                    d.getFullName(),
                    d.getEmail().trim().toLowerCase(),
                    d.getSpecialty(),
                    d.getImageUrl(),
                    AuthDataInitializer.DEMO_PASSWORD))
        .toList();
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

  public record DoctorLoginOption(
      Long id,
      String fullName,
      String email,
      String specialty,
      String imageUrl,
      String password) {}
}
