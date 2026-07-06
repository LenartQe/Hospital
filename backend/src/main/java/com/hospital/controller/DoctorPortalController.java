package com.hospital.controller;

import com.hospital.dto.DoctorAppointmentDTO;
import com.hospital.dto.DoctorProfileDTO;
import com.hospital.entity.Diagnosis;
import com.hospital.entity.Medicine;
import com.hospital.entity.Prescription;
import com.hospital.service.PortalService;
import com.hospital.util.Require;
import jakarta.validation.Valid;
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
    return portalService.doctorDashboard(Require.authUserId(authentication));
  }

  @GetMapping("/appointments")
  public List<DoctorAppointmentDTO> appointments(Authentication authentication) {
    return portalService.doctorAppointmentDtos(Require.authUserId(authentication));
  }

  @PatchMapping("/appointments/{id}/status")
  public Map<String, Object> updateStatus(
      Authentication authentication, @PathVariable Long id, @Valid @RequestBody StatusBody body) {
    var appointment =
        portalService.updateAppointmentStatus(Require.authUserId(authentication), id, body.status());
    return Map.of("id", appointment.getId(), "status", appointment.getStatus());
  }

  @GetMapping("/diagnoses")
  public List<DiagnosisView> diagnoses(Authentication authentication) {
    long userId = Require.authUserId(authentication);
    return portalService.doctorDiagnoses(userId).stream()
        .map(
            d ->
                new DiagnosisView(
                    d.getId(),
                    d.getTitle(),
                    d.getDescription(),
                    portalService.patientDisplayName(d.getPatient()),
                    d.getSeverity(),
                    d.getDiagnosedAt()))
        .toList();
  }

  @GetMapping("/prescriptions")
  public List<PrescriptionView> prescriptions(Authentication authentication) {
    long userId = Require.authUserId(authentication);
    return portalService.doctorPrescriptions(userId).stream()
        .map(
            p -> {
              String medicineName =
                  p.getMedicine() != null && p.getMedicine().getName() != null
                      ? p.getMedicine().getName()
                      : "—";
              return new PrescriptionView(
                  p.getId(),
                  medicineName,
                  p.getDosage(),
                  p.getFrequency(),
                  portalService.patientDisplayName(p.getPatient()),
                  p.getStatus(),
                  p.getPrescribedAt());
            })
        .toList();
  }

  @GetMapping("/profile")
  public DoctorProfileDTO profile(Authentication authentication) {
    return portalService.doctorProfile(Require.authUserId(authentication));
  }

  @GetMapping("/medicines")
  public List<Medicine> medicines(Authentication authentication) {
    return portalService.medicinesForDoctor(Require.authUserId(authentication));
  }

  @GetMapping("/patients")
  public List<PatientSummary> patients(Authentication authentication) {
    return portalService.listPatientsForDoctor(Require.authUserId(authentication)).stream()
        .map(
            p ->
                new PatientSummary(
                    p.getId(),
                    portalService.patientDisplayName(p),
                    p.getEmail(),
                    p.getPhoneNumber()))
        .toList();
  }

  @PostMapping("/patients/{patientId}/diagnoses")
  public Diagnosis addDiagnosis(
      Authentication authentication,
      @PathVariable Long patientId,
      @Valid @RequestBody DiagnosisRequest body) {
    return portalService.createDiagnosis(
        Require.authUserId(authentication),
        patientId,
        body.title(),
        body.description(),
        body.severity());
  }

  @PostMapping("/patients/{patientId}/prescriptions")
  public Prescription addPrescription(
      Authentication authentication,
      @PathVariable Long patientId,
      @Valid @RequestBody PrescriptionRequest body) {
    return portalService.createPrescription(
        Require.authUserId(authentication),
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
