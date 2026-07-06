package com.hospital.service;

import com.hospital.dto.PatientAdminDTO;
import com.hospital.dto.PatientUpdateRequest;
import com.hospital.entity.AppUser;
import com.hospital.entity.Patient;
import com.hospital.entity.PatientProfile;
import com.hospital.entity.UserRole;
import com.hospital.repository.AppUserRepository;
import com.hospital.repository.PatientProfileRepository;
import com.hospital.repository.PatientRepository;
import com.hospital.util.Require;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PatientService {

  private final PatientRepository patientRepository;
  private final PatientProfileRepository patientProfileRepository;
  private final AppUserRepository appUserRepository;

  public PatientService(
      PatientRepository patientRepository,
      PatientProfileRepository patientProfileRepository,
      AppUserRepository appUserRepository) {
    this.patientRepository = patientRepository;
    this.patientProfileRepository = patientProfileRepository;
    this.appUserRepository = appUserRepository;
  }

  public List<PatientAdminDTO> listAllForAdmin() {
    return patientRepository.findAllByOrderByIdDesc().stream().map(this::toAdminDto).toList();
  }

  public Patient getById(Long id) {
    return Require.found(patientRepository.findById(id), "Patient not found");
  }

  @Transactional
  public Patient update(Long id, PatientUpdateRequest request) {
    Patient patient = getById(id);

    if (request.getUsername() != null && !request.getUsername().isBlank()) {
      patient.setUsername(request.getUsername().trim());
    }
    if (request.getEmail() != null && !request.getEmail().isBlank()) {
      patient.setEmail(request.getEmail().trim());
    }
    if (request.getPhoneNumber() != null) {
      patient.setPhoneNumber(request.getPhoneNumber().trim());
    }
    if (request.getBloodType() != null) {
      patient.setBloodType(request.getBloodType().trim());
    }
    if (request.getAllergies() != null) {
      patient.setAllergies(request.getAllergies().trim());
    }
    if (request.getStatus() != null && !request.getStatus().isBlank()) {
      patient.setStatus(request.getStatus().trim().toUpperCase());
    }

    Patient saved = patientRepository.save(patient);
    syncProfileFromPatient(saved);
    return saved;
  }

  @Transactional
  public Patient ensureForUser(AppUser user) {
    return patientRepository
        .findByUserId(user.getId())
        .orElseGet(() -> createForUser(user));
  }

  /** Links or creates a patient record for a public appointment booking. */
  @Transactional
  public Patient ensureForAppointment(String patientName, String email, String phone) {
    String normalizedEmail = normalizeAppointmentEmail(email, patientName);
    return patientRepository
        .findByEmail(normalizedEmail)
        .map(p -> updateGuestContact(p, patientName, phone))
        .orElseGet(
            () ->
                appUserRepository
                    .findByEmailAndRole(normalizedEmail, UserRole.PATIENT)
                    .map(this::ensureForUser)
                    .orElseGet(() -> createGuestPatient(patientName, normalizedEmail, phone)));
  }

  @Transactional
  public Patient createForUser(AppUser user) {
    String username = deriveUsername(user);
    Patient patient = new Patient();
    patient.setUsername(username);
    patient.setEmail(user.getEmail());
    patient.setPhoneNumber(user.getPhone());
    patient.setStatus("ACTIVE");
    patient.setUserId(user.getId());
    Patient saved = patientRepository.save(patient);

    patientProfileRepository
        .findByUserId(user.getId())
        .ifPresent(
            profile -> {
              profile.setPatient(saved);
              patientProfileRepository.save(profile);
            });

    return saved;
  }

  private void syncProfileFromPatient(Patient patient) {
    if (patient.getUserId() == null) {
      return;
    }
    patientProfileRepository
        .findByUserId(patient.getUserId())
        .ifPresent(
            profile -> {
              profile.setPatient(patient);
              profile.setBloodType(patient.getBloodType());
              profile.setAllergies(patient.getAllergies());
              patientProfileRepository.save(profile);
            });
  }

  private PatientAdminDTO toAdminDto(Patient patient) {
    boolean active = "ACTIVE".equalsIgnoreCase(patient.getStatus());
    return new PatientAdminDTO(
        patient.getId(),
        patient.getUsername(),
        patient.getEmail(),
        patient.getPhoneNumber(),
        patient.getBloodType(),
        patient.getAllergies(),
        patient.getStatus(),
        active);
  }

  private String deriveUsername(AppUser user) {
    String email = user.getEmail();
    if (email != null && email.contains("@")) {
      return email.substring(0, email.indexOf('@')).toLowerCase();
    }
    return "patient" + user.getId();
  }

  private Patient updateGuestContact(Patient patient, String patientName, String phone) {
    if (patientName != null && !patientName.isBlank()) {
      String username = deriveGuestUsername(patientName, patient.getEmail());
      if (!username.equals(patient.getUsername())) {
        patientRepository
            .findByUsername(username)
            .filter(existing -> !existing.getId().equals(patient.getId()))
            .ifPresentOrElse(
                ignored -> {},
                () -> patient.setUsername(username));
      }
    }
    if (phone != null && !phone.isBlank()) {
      patient.setPhoneNumber(phone.trim());
    }
    return patientRepository.save(patient);
  }

  private Patient createGuestPatient(String patientName, String email, String phone) {
    Patient patient = new Patient();
    patient.setEmail(email);
    patient.setUsername(deriveGuestUsername(patientName, email));
    patient.setPhoneNumber(phone != null ? phone.trim() : null);
    patient.setStatus("ACTIVE");
    return patientRepository.save(patient);
  }

  private String normalizeAppointmentEmail(String email, String patientName) {
    if (email != null && !email.isBlank()) {
      return email.trim().toLowerCase();
    }
    String base =
        patientName != null && !patientName.isBlank()
            ? patientName.toLowerCase().replaceAll("[^a-z0-9]+", ".")
            : "unknown";
    String candidate = "guest." + base + "@appointment.hospital.local";
    int suffix = 0;
    while (patientRepository.findByEmail(candidate).isPresent()) {
      suffix++;
      candidate = "guest." + base + "." + suffix + "@appointment.hospital.local";
    }
    return candidate;
  }

  private String deriveGuestUsername(String patientName, String email) {
    if (email != null && email.contains("@")) {
      String local = email.substring(0, email.indexOf('@')).toLowerCase();
      if (patientRepository.findByUsername(local).isEmpty()) {
        return local;
      }
    }
    String base =
        patientName != null && !patientName.isBlank()
            ? patientName.toLowerCase().replaceAll("[^a-z0-9]+", "")
            : "guest";
    String candidate = base;
    int suffix = 0;
    while (patientRepository.findByUsername(candidate).isPresent()) {
      suffix++;
      candidate = base + suffix;
    }
    return candidate;
  }
}
