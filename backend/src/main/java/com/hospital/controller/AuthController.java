package com.hospital.controller;

import com.hospital.entity.UserRole;
import com.hospital.service.AuthService;
import com.hospital.service.AuthService.AuthResult;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  private final AuthService authService;

  public AuthController(AuthService authService) {
    this.authService = authService;
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
}
