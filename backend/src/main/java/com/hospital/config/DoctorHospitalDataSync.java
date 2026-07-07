package com.hospital.config;

import com.hospital.entity.Doctor;
import com.hospital.repository.DoctorRepository;
import com.hospital.service.DoctorCredentialService;
import com.hospital.util.DoctorCatalog;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
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
  private static final String IMG_LENART =
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face";
  private static final String IMG_MIMOZA =
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face";
  private static final String IMG_KADRI = "/images/hospital/kadri-mustafa.png";
  private static final String IMG_EMIR =
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face";
  private static final String IMG_BLERDON =
      "https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=400&h=400&fit=crop&crop=face";

  private final DoctorRepository doctorRepository;
  private final DoctorCredentialService doctorCredentialService;

  public DoctorHospitalDataSync(
      DoctorRepository doctorRepository, DoctorCredentialService doctorCredentialService) {
    this.doctorRepository = doctorRepository;
    this.doctorCredentialService = doctorCredentialService;
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
              if (image == null) {
                image = defaultMaleImage(doctor.getId());
              }
              doctor.setImageUrl(image);
              doctorRepository.save(doctor);
            });
  }

  private String imageForDoctor(String fullName) {
    if (fullName == null) {
      return null;
    }
    String name = fullName.toLowerCase();
    if (name.contains("sara")) {
      return IMG_SARA;
    }
    if (name.contains("kadri")) {
      return IMG_KADRI;
    }
    if (name.contains("emir")) {
      return IMG_EMIR;
    }
    if (name.contains("lenart")) {
      return IMG_LENART;
    }
    if (name.contains("mimoza")) {
      return IMG_MIMOZA;
    }
    if (name.contains("blerdon")) {
      return IMG_BLERDON;
    }
    return null;
  }

  private String defaultMaleImage(Long doctorId) {
    String[] pool = {
      IMG_KADRI, IMG_EMIR, IMG_LENART, IMG_BLERDON,
      "https://images.unsplash.com/photo-1622253692010-21aabed25171?w=400&h=400&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face"
    };
    long key = doctorId != null ? doctorId : 0L;
    return pool[(int) (Math.abs(key) % pool.length)];
  }

  private void ensureDoctorLoginAccounts() {
    DoctorCatalog.publicDoctors(doctorRepository.findByFeaturedTrueOrderByNameAsc())
        .forEach(doctorCredentialService::ensureLoginAccount);
  }
}
