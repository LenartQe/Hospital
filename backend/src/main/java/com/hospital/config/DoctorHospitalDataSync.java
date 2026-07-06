package com.hospital.config;

import com.hospital.entity.AppUser;
import com.hospital.entity.Doctor;
import com.hospital.entity.UserRole;
import com.hospital.repository.AppUserRepository;
import com.hospital.repository.DoctorRepository;
import com.hospital.util.DoctorCatalog;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Enriches existing Mjekët doctors without overwriting their specialties or creating duplicates.
 */
@Component
@Order(3)
public class DoctorHospitalDataSync implements CommandLineRunner {

  private static final Logger log = LoggerFactory.getLogger(DoctorHospitalDataSync.class);

  private static final String IMG_SARA =
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face";
  private static final String IMG_KADRI =
      "https://images.unsplash.com/photo-1537368911262-87184d0ecad2?w=400&h=400&fit=crop&crop=face";
  private static final String IMG_EMIR =
      "https://images.unsplash.com/photo-1582750433449-648ed127fbfe?w=400&h=400&fit=crop&crop=face";
  private static final String IMG_LENART =
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face";
  private static final String IMG_MIMOZA =
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face";
  private static final String IMG_BLERDON =
      "https://images.unsplash.com/photo-1624224837377-28f9f55818f4?w=400&h=400&fit=crop&crop=face";

  private final DoctorRepository doctorRepository;
  private final AppUserRepository appUserRepository;
  private final PasswordEncoder passwordEncoder;

  public DoctorHospitalDataSync(
      DoctorRepository doctorRepository,
      AppUserRepository appUserRepository,
      PasswordEncoder passwordEncoder) {
    this.doctorRepository = doctorRepository;
    this.appUserRepository = appUserRepository;
    this.passwordEncoder = passwordEncoder;
  }

  @Override
  public void run(String... args) {
    try {
      reconcileFeaturedDoctors();
      applyProfileImages();
      ensureDoctorLoginAccounts();
    } catch (Exception ex) {
      log.warn("Doctor portal sync partial failure: {}", ex.getMessage());
    }
  }

  /** Keep one featured record per email (original / lowest id); hide sync duplicates. */
  private void reconcileFeaturedDoctors() {
    java.util.Map<String, java.util.List<Doctor>> grouped = new java.util.LinkedHashMap<>();
    doctorRepository.findAll().stream()
        .filter(d -> d.getEmail() != null && !d.getEmail().isBlank())
        .forEach(
            d -> grouped.computeIfAbsent(d.getEmail().trim().toLowerCase(), k -> new java.util.ArrayList<>()).add(d));

    grouped.values().forEach(this::markCanonicalDoctor);
  }

  private void markCanonicalDoctor(java.util.List<Doctor> sameEmail) {
    sameEmail.sort(java.util.Comparator.comparing(Doctor::getId));
    Doctor canonical = sameEmail.get(0);
    canonical.setFeatured(true);
    doctorRepository.save(canonical);
    for (int i = 1; i < sameEmail.size(); i++) {
      Doctor duplicate = sameEmail.get(i);
      duplicate.setFeatured(false);
      duplicate.setUserId(null);
      doctorRepository.save(duplicate);
    }
  }

  private void applyProfileImages() {
    doctorRepository.findAll().stream()
        .filter(Doctor::isFeatured)
        .forEach(
            doctor -> {
              String image = imageForDoctor(doctor.getFullName());
              if (image != null) {
                doctor.setImageUrl(image);
                doctorRepository.save(doctor);
              }
            });
  }

  private String imageForDoctor(String fullName) {
    if (fullName == null) {
      return null;
    }
    String name = fullName.toLowerCase();
    if (name.contains("sara") && name.contains("kryeziu")) {
      return IMG_SARA;
    }
    if (name.contains("kadri") && name.contains("mustafa")) {
      return IMG_KADRI;
    }
    if (name.contains("emir") && name.contains("zoga")) {
      return IMG_EMIR;
    }
    if (name.contains("lenart") && name.contains("qollaku")) {
      return IMG_LENART;
    }
    if (name.contains("mimoza") && name.contains("kusari")) {
      return IMG_MIMOZA;
    }
    if (name.contains("blerdon") && name.contains("sopaj")) {
      return IMG_BLERDON;
    }
    return null;
  }

  private void ensureDoctorLoginAccounts() {
    DoctorCatalog.publicDoctors(doctorRepository.findByFeaturedTrueOrderByNameAsc())
        .forEach(this::ensureAccountForDoctor);
  }

  private void ensureAccountForDoctor(Doctor doctor) {
    if (doctor.getEmail() == null || doctor.getEmail().isBlank()) {
      return;
    }
    String email = doctor.getEmail().trim().toLowerCase();
    AppUser user =
        appUserRepository
            .findByEmailAndRole(email, UserRole.DOCTOR)
            .orElseGet(
                () -> {
                  AppUser created = new AppUser();
                  created.setEmail(email);
                  created.setRole(UserRole.DOCTOR);
                  return created;
                });
    user.setFullName(doctor.getFullName());
    user.setPhone(doctor.getPhone());
    user.setPasswordHash(passwordEncoder.encode(AuthDataInitializer.DEMO_PASSWORD));
    user = appUserRepository.save(user);

    doctorRepository.findAll().stream()
        .filter(d -> email.equalsIgnoreCase(d.getEmail()) && !doctor.getId().equals(d.getId()))
        .forEach(
            other -> {
              other.setUserId(null);
              other.setFeatured(false);
              doctorRepository.save(other);
            });

    doctor.setUserId(user.getId());
    doctorRepository.save(doctor);
  }
}
