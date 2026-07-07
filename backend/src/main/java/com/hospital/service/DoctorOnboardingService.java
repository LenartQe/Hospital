package com.hospital.service;

import com.hospital.entity.Doctor;
import com.hospital.repository.DoctorRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DoctorOnboardingService {

  private static final List<String> DEFAULT_MALE_IMAGES =
      List.of(
          "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
          "https://images.unsplash.com/photo-1537368911262-87184d0ecad2?w=400&h=400&fit=crop&crop=face",
          "https://images.unsplash.com/photo-1582750433449-648ed127fbfe?w=400&h=400&fit=crop&crop=face",
          "https://images.unsplash.com/photo-1624224837377-28f9f55818f4?w=400&h=400&fit=crop&crop=face",
          "https://images.unsplash.com/photo-1622253692010-21aabed25171?w=400&h=400&fit=crop&crop=face",
          "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face");

  private final DoctorRepository doctorRepository;
  private final DoctorCredentialService doctorCredentialService;

  public DoctorOnboardingService(
      DoctorRepository doctorRepository, DoctorCredentialService doctorCredentialService) {
    this.doctorRepository = doctorRepository;
    this.doctorCredentialService = doctorCredentialService;
  }

  @Transactional
  public Doctor onboard(Doctor doctor) {
    doctor.setFeatured(true);
    if (doctor.getImageUrl() == null || doctor.getImageUrl().isBlank()) {
      doctor.setImageUrl(defaultMaleImage(doctor.getId()));
    }
    doctor = doctorRepository.save(doctor);
    if (doctor.getEmail() != null && !doctor.getEmail().isBlank()) {
      doctorCredentialService.ensureLoginAccount(doctor);
    }
    return doctor;
  }

  public String defaultMaleImage(Long doctorId) {
    long key = doctorId != null ? doctorId : 0L;
    return DEFAULT_MALE_IMAGES.get((int) (Math.abs(key) % DEFAULT_MALE_IMAGES.size()));
  }
}
