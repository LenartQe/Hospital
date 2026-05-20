package com.hospital.controller;

import com.hospital.entity.Appointment;
import com.hospital.entity.Diagnosis;
import com.hospital.entity.Doctor;
import com.hospital.entity.PatientProfile;
import com.hospital.entity.Prescription;
import com.hospital.service.PortalService;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.Map;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/doctor")
public class DoctorPortalController {

  private final PortalService portalService;

  public DoctorPortalController(PortalService portalService) {
    this.portalService = portalService;
  }

  @GetMapping("/dashboard")
  public Map<String, Object> dashboard(Authentication authentication) {
    Long userId = (Long) authentication.getPrincipal();
    return portalService.doctorDashboard(userId);
  }

  @GetMapping("/appointments")
  public List<Appointment> appointments(Authentication authentication) {
    Long userId = (Long) authentication.getPrincipal();
    return portalService.doctorAppointments(userId);
  }

  @PatchMapping("/appointments/{id}/status")
  public Appointment updateStatus(
      Authentication authentication, @PathVariable Long id, @RequestBody StatusBody body) {
    Long userId = (Long) authentication.getPrincipal();
    return portalService.updateAppointmentStatus(userId, id, body.status());
  }

  @GetMapping("/diagnoses")
  public List<DiagnosisView> diagnoses(Authentication authentication) {
    Long userId = (Long) authentication.getPrincipal();
    return portalService.doctorDiagnoses(userId).stream()
        .map(
            d ->
                new DiagnosisView(
                    d.getId(),
                    d.getTitle(),
                    d.getDescription(),
                    d.getPatient().getUser().getFullName(),
                    d.getSeverity(),
                    d.getDiagnosedAt()))
        .toList();
  }

  @GetMapping("/prescriptions")
  public List<PrescriptionView> prescriptions(Authentication authentication) {
    Long userId = (Long) authentication.getPrincipal();
    return portalService.doctorPrescriptions(userId).stream()
        .map(
            p ->
                new PrescriptionView(
                    p.getId(),
                    p.getMedicine().getName(),
                    p.getDosage(),
                    p.getFrequency(),
                    p.getPatient().getUser().getFullName(),
                    p.getStatus(),
                    p.getPrescribedAt()))
        .toList();
  }

  @GetMapping("/profile")
  public Doctor profile(Authentication authentication) {
    Long userId = (Long) authentication.getPrincipal();
    return portalService.doctorProfile(userId);
  }

  @GetMapping("/patients")
  public List<PatientSummary> patients() {
    return portalService.listPatientsForDoctor().stream()
        .map(
            p -> {
              var u = p.getUser();
              return new PatientSummary(p.getId(), u.getFullName(), u.getEmail(), u.getPhone());
            })
        .toList();
  }

  @PostMapping("/patients/{patientId}/diagnoses")
  public Diagnosis addDiagnosis(
      Authentication authentication,
      @PathVariable Long patientId,
      @RequestBody DiagnosisRequest body) {
    Long userId = (Long) authentication.getPrincipal();
    return portalService.createDiagnosis(
        userId, patientId, body.title(), body.description(), body.severity());
  }

  @PostMapping("/patients/{patientId}/prescriptions")
  public Prescription addPrescription(
      Authentication authentication,
      @PathVariable Long patientId,
      @RequestBody PrescriptionRequest body) {
    Long userId = (Long) authentication.getPrincipal();
    return portalService.createPrescription(
        userId,
        patientId,
        body.medicineId(),
        body.dosage(),
        body.frequency(),
        body.instructions());
  }

  public record StatusBody(@NotBlank String status) {}

  public record DiagnosisView(
      Long id,
      String title,
      String description,
      String patientName,
      String severity,
      java.time.Instant diagnosedAt) {}

  public record PrescriptionView(
      Long id,
      String medicineName,
      String dosage,
      String frequency,
      String patientName,
      String status,
      java.time.Instant prescribedAt) {}

  public record PatientSummary(Long id, String fullName, String email, String phone) {}

  public record DiagnosisRequest(@NotBlank String title, String description, String severity) {}

  public record PrescriptionRequest(
      @NotNull Long medicineId,
      @NotBlank String dosage,
      String frequency,
      String instructions) {}
}
