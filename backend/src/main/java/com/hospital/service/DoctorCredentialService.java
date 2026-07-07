package com.hospital.service;

import com.hospital.config.AuthDataInitializer;
import com.hospital.entity.AppUser;
import com.hospital.entity.Doctor;
import com.hospital.entity.UserRole;
import com.hospital.repository.AppUserRepository;
import com.hospital.repository.DoctorRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Assigns and syncs unique doctor login passwords between doctors and app_users. */
@Service
public class DoctorCredentialService {

  private final DoctorRepository doctorRepository;
  private final AppUserRepository appUserRepository;
  private final PasswordEncoder passwordEncoder;

  public DoctorCredentialService(
      DoctorRepository doctorRepository,
      AppUserRepository appUserRepository,
      PasswordEncoder passwordEncoder) {
    this.doctorRepository = doctorRepository;
    this.appUserRepository = appUserRepository;
    this.passwordEncoder = passwordEncoder;
  }

  /** Returns existing password or generates a new unique one and persists it on the doctor. */
  @Transactional
  public String ensureLoginPassword(Doctor doctor) {
    String current = doctor.getLoginPassword();
    if (isUsablePassword(current)) {
      return current;
    }
    String generated = generatePassword(doctor);
    doctor.setLoginPassword(generated);
    doctorRepository.save(doctor);
    return generated;
  }

  @Transactional
  public void ensureLoginAccount(Doctor doctor) {
    if (doctor.getEmail() == null || doctor.getEmail().isBlank()) {
      return;
    }
    String email = doctor.getEmail().trim().toLowerCase();
    String plainPassword = ensureLoginPassword(doctor);

    AppUser user =
        appUserRepository
            .findByEmail(email)
            .orElseGet(
                () -> {
                  AppUser created = new AppUser();
                  created.setEmail(email);
                  return created;
                });
    user.setRole(UserRole.DOCTOR);
    user.setFullName(doctor.getFullName());
    user.setPhone(doctor.getPhone());
    user.setPasswordHash(passwordEncoder.encode(plainPassword));
    user = appUserRepository.save(user);

    doctor.setUserId(user.getId());
    doctorRepository.save(doctor);
  }

  private boolean isUsablePassword(String password) {
    return password != null
        && !password.isBlank()
        && !AuthDataInitializer.DEMO_PASSWORD.equals(password);
  }

  private String generatePassword(Doctor doctor) {
    String lastName = extractLastName(doctor.getFullName());
    String email = doctor.getEmail() != null ? doctor.getEmail().trim().toLowerCase() : "";
    long id = doctor.getId() != null ? doctor.getId() : 0L;
    int code = Math.abs((int) ((id * 37L + email.hashCode()) % 9000)) + 1000;
    return "Dr" + lastName + "#" + code;
  }

  private String extractLastName(String fullName) {
    if (fullName == null || fullName.isBlank()) {
      return "Spital";
    }
    String cleaned = fullName.replace("Dr.", "").replace("Dr", "").trim();
    String[] parts = cleaned.split("\\s+");
    if (parts.length == 0) {
      return "Doc";
    }
    String last = parts[parts.length - 1].replaceAll("[^a-zA-ZÀ-ÿ]", "");
    if (last.length() < 2) {
      return "Doc";
    }
    return last.substring(0, 1).toUpperCase() + last.substring(1).toLowerCase();
  }
}
