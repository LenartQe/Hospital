package com.hospital.config;

import com.hospital.entity.AppUser;
import com.hospital.entity.Department;
import com.hospital.entity.Doctor;
import com.hospital.entity.UserRole;
import com.hospital.repository.AppUserRepository;
import com.hospital.repository.DepartmentRepository;
import com.hospital.repository.DoctorRepository;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Keeps hospital doctor records, emails, profile images, and login accounts in sync on every startup.
 */
@Component
@Order(3)
public class DoctorHospitalDataSync implements CommandLineRunner {

  private static final Logger log = LoggerFactory.getLogger(DoctorHospitalDataSync.class);

  private static final String MALE_DOCTOR_IMG =
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face";
  private static final String FEMALE_DOCTOR_IMG =
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face";
  private static final String FEMALE_DOCTOR_IMG_ALT =
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face";

  private final DepartmentRepository departmentRepository;
  private final DoctorRepository doctorRepository;
  private final AppUserRepository appUserRepository;
  private final PasswordEncoder passwordEncoder;

  public DoctorHospitalDataSync(
      DepartmentRepository departmentRepository,
      DoctorRepository doctorRepository,
      AppUserRepository appUserRepository,
      PasswordEncoder passwordEncoder) {
    this.departmentRepository = departmentRepository;
    this.doctorRepository = doctorRepository;
    this.appUserRepository = appUserRepository;
    this.passwordEncoder = passwordEncoder;
  }

  @Override
  public void run(String... args) {
    Department general = ensureDepartment("Mjekësi e Përgjithshme", "Kujdes primar dhe diagnostikë.");
    Department cardiology = ensureDepartment("Kardiologji", "Kujdes për zemrën dhe enët e gjakut.");
    Department pediatrics = ensureDepartment("Pediatri", "Kujdes për fëmijët dhe adoleshentët.");

    syncDoctorSafe(
        "Lenart Qollaku",
        "lenartqollaku@gmail.com",
        "+383 44 200 001",
        "Mjek i përgjithshëm",
        general,
        MALE_DOCTOR_IMG);
    syncDoctorSafe(
        "Mimoza Kusari",
        "mimoza.kusari@spitaliprizrenit.com",
        "+383 44 200 002",
        "Kardiologe",
        cardiology,
        FEMALE_DOCTOR_IMG);
    syncDoctorSafe(
        "Sara Kryeziu",
        "sara.kryeziu@spitaliprizrenit.com",
        "+383 44 200 003",
        "Pediatre",
        pediatrics,
        FEMALE_DOCTOR_IMG_ALT);

    // Also update by partial name for records created manually in admin with variant spellings.
    syncByNameContains("mimoza", "kusari", "mimoza.kusari@spitaliprizrenit.com", FEMALE_DOCTOR_IMG);
    syncByNameContains("sara", "kryeziu", "sara.kryeziu@spitaliprizrenit.com", FEMALE_DOCTOR_IMG_ALT);
    syncByNameContains("lenart", "qollaku", "lenartqollaku@gmail.com", MALE_DOCTOR_IMG);
  }

  private Department ensureDepartment(String name, String description) {
    return departmentRepository.findAll().stream()
        .filter(d -> name.equalsIgnoreCase(d.getName()))
        .findFirst()
        .orElseGet(
            () -> {
              Department d = new Department();
              d.setName(name);
              d.setDescription(description);
              d.setLocation("Spitali i Prizrenit");
              return departmentRepository.save(d);
            });
  }

  private void syncDoctor(
      String fullName,
      String email,
      String phone,
      String specialty,
      Department department,
      String imageUrl) {
    String normalizedEmail = email.trim().toLowerCase();
    Doctor doctor =
        doctorRepository.findAll().stream()
            .filter(d -> normalizedEmail.equalsIgnoreCase(d.getEmail()))
            .reduce(this::preferDoctorRecord)
            .orElseGet(() -> findByName(fullName).orElse(null));

    if (doctor == null) {
      doctor = new Doctor();
      doctor.setFullName(fullName);
    }

    doctor.setFullName(fullName);
    doctor.setEmail(normalizedEmail);
    doctor.setPhone(phone);
    doctor.setSpecialty(specialty);
    doctor.setDepartment(department);
    doctor.setImageUrl(imageUrl);
    if (doctor.getBio() == null || doctor.getBio().isBlank()) {
      doctor.setBio("Mjek në Spitalin e Prizrenit.");
    }
    doctor = doctorRepository.save(doctor);

    AppUser user =
        appUserRepository
            .findByEmailAndRole(normalizedEmail, UserRole.DOCTOR)
            .orElseGet(
                () -> {
                  AppUser created = new AppUser();
                  created.setEmail(normalizedEmail);
                  created.setPasswordHash(passwordEncoder.encode(AuthDataInitializer.DEMO_PASSWORD));
                  created.setRole(UserRole.DOCTOR);
                  created.setFullName(fullName);
                  created.setPhone(phone);
                  return appUserRepository.save(created);
                });

    if (!fullName.equals(user.getFullName())) {
      user.setFullName(fullName);
      user.setPhone(phone);
      appUserRepository.save(user);
    }

    linkDoctorAccount(doctor, user);

    log.debug("Synced doctor profile: {} <{}>", fullName, normalizedEmail);
  }

  private void linkDoctorAccount(Doctor doctor, AppUser user) {
    if (doctor.getUserId() != null) {
      if (!doctor.getUserId().equals(user.getId())) {
        log.warn(
            "Doctor {} already linked to user id {}; keeping existing link.",
            doctor.getFullName(),
            doctor.getUserId());
      }
      return;
    }
    Optional<Doctor> existingOwner = doctorRepository.findByUserId(user.getId());
    if (existingOwner.isPresent() && !existingOwner.get().getId().equals(doctor.getId())) {
      log.warn(
          "App user {} already linked to doctor {}; skipping link for {}.",
          user.getEmail(),
          existingOwner.get().getFullName(),
          doctor.getFullName());
      return;
    }
    doctor.setUserId(user.getId());
    doctorRepository.save(doctor);
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

  private void syncDoctorSafe(
      String fullName,
      String email,
      String phone,
      String specialty,
      Department department,
      String imageUrl) {
    try {
      syncDoctor(fullName, email, phone, specialty, department, imageUrl);
    } catch (Exception ex) {
      log.warn("Doctor sync skipped for {}: {}", fullName, ex.getMessage());
    }
  }

  private void syncByNameContains(String part1, String part2, String email, String imageUrl) {
    try {
      doctorRepository.findAll().stream()
          .filter(
              d -> {
                String name = d.getFullName() != null ? d.getFullName().toLowerCase() : "";
                return name.contains(part1.toLowerCase()) && name.contains(part2.toLowerCase());
              })
          .forEach(
              d -> {
                d.setEmail(email.trim().toLowerCase());
                d.setImageUrl(imageUrl);
                doctorRepository.save(d);
              });
    } catch (Exception ex) {
      log.warn("Name-based doctor sync failed for {} {}: {}", part1, part2, ex.getMessage());
    }
  }

  private java.util.Optional<Doctor> findByName(String fullName) {
    return doctorRepository.findAll().stream()
        .filter(d -> fullName.equalsIgnoreCase(d.getFullName()))
        .findFirst();
  }
}
