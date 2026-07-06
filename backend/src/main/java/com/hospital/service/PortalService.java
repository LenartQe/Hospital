package com.hospital.service;

import com.hospital.dto.DoctorAppointmentDTO;
import com.hospital.dto.DoctorProfileDTO;
import com.hospital.dto.PatientDashboardDto;
import com.hospital.entity.Appointment;
import com.hospital.entity.AppUser;
import com.hospital.entity.Diagnosis;
import com.hospital.entity.Doctor;
import com.hospital.entity.Medicine;
import com.hospital.entity.Patient;
import com.hospital.entity.PatientProfile;
import com.hospital.entity.Prescription;
import com.hospital.repository.AppointmentRepository;
import com.hospital.repository.DiagnosisRepository;
import com.hospital.repository.DoctorRepository;
import com.hospital.repository.MedicineRepository;
import com.hospital.repository.PatientProfileRepository;
import com.hospital.repository.PatientRepository;
import com.hospital.repository.PrescriptionRepository;
import com.hospital.util.Require;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
public class PortalService {

  private final PatientProfileRepository patientProfileRepository;
  private final PatientRepository patientRepository;
  private final PatientService patientService;
  private final DoctorRepository doctorRepository;
  private final DiagnosisRepository diagnosisRepository;
  private final PrescriptionRepository prescriptionRepository;
  private final AppointmentRepository appointmentRepository;
  private final MedicineRepository medicineRepository;

  public PortalService(
      PatientProfileRepository patientProfileRepository,
      PatientRepository patientRepository,
      PatientService patientService,
      DoctorRepository doctorRepository,
      DiagnosisRepository diagnosisRepository,
      PrescriptionRepository prescriptionRepository,
      AppointmentRepository appointmentRepository,
      MedicineRepository medicineRepository) {
    this.patientProfileRepository = patientProfileRepository;
    this.patientRepository = patientRepository;
    this.patientService = patientService;
    this.doctorRepository = doctorRepository;
    this.diagnosisRepository = diagnosisRepository;
    this.prescriptionRepository = prescriptionRepository;
    this.appointmentRepository = appointmentRepository;
    this.medicineRepository = medicineRepository;
  }

  @Transactional(readOnly = true)
  public PatientProfile requirePatientProfile(Long userId) {
    long uid = Require.id(userId, "ID e përdoruesit");
    return patientProfileRepository
        .findByUserId(uid)
        .orElseThrow(
            () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Profili i pacientit nuk u gjet."));
  }

  @Transactional(readOnly = true)
  public Doctor requireDoctorByUserId(Long userId) {
    long uid = Require.id(userId, "ID e përdoruesit");
    return doctorRepository
        .findByUserId(uid)
        .orElseThrow(
            () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Profili i mjekut nuk u gjet."));
  }

  @Transactional(readOnly = true)
  public PatientDashboardDto patientDashboard(Long userId) {
    PatientProfile profile = requirePatientProfile(userId);
    AppUser user = Require.notNull(profile.getUser(), "Përdoruesi i pacientit");
    Patient patient = resolvePatient(profile, user);
    Long patientId = Require.notNull(patient.getId(), "ID e pacientit");

    List<Diagnosis> diagnoses = diagnosisRepository.findByPatientIdOrderByCreatedAtDesc(patientId);
    List<Prescription> prescriptions =
        prescriptionRepository.findByPatientIdOrderByPrescribedAtDesc(patientId);
    List<Appointment> appointments =
        appointmentRepository.findByPatientIdOrderByCreatedAtDesc(patientId);
    if (appointments.isEmpty() && profile.getId() != null) {
      appointments =
          appointmentRepository.findByPatientProfileIdOrderByCreatedAtDesc(profile.getId());
    }

    return new PatientDashboardDto(
        user.getFullName(),
        user.getEmail(),
        user.getPhone(),
        profile.getDateOfBirth(),
        patient.getBloodType() != null ? patient.getBloodType() : profile.getBloodType(),
        patient.getAllergies() != null ? patient.getAllergies() : profile.getAllergies(),
        profile.getNotes(),
        diagnoses,
        prescriptions,
        appointments);
  }

  public Map<String, Object> doctorDashboard(Long userId) {
    Doctor doctor = requireDoctorByUserId(userId);
    Long doctorId = Require.notNull(doctor.getId(), "ID e mjekut");
    List<DoctorAppointmentDTO> appointments = doctorAppointmentDtos(userId);
    long pending =
        appointments.stream()
            .filter(a -> a.getStatus() != null && "PENDING".equalsIgnoreCase(a.getStatus()))
            .count();
    long confirmed =
        appointments.stream()
            .filter(a -> a.getStatus() != null && "CONFIRMED".equalsIgnoreCase(a.getStatus()))
            .count();
    List<Diagnosis> diagnoses = diagnosisRepository.findByDoctorIdOrderByCreatedAtDesc(doctorId);
    List<Prescription> prescriptions = prescriptionRepository.findByDoctorIdOrderByPrescribedAtDesc(doctorId);
    long patientCount = listPatientsForDoctor(userId).size();

    Map<String, Object> result = new HashMap<>();
    result.put("doctor", toDoctorProfileDto(doctor));
    result.put("appointments", appointments.stream().limit(10).toList());
    result.put("appointmentCount", appointments.size());
    result.put("pendingAppointments", pending);
    result.put("confirmedAppointments", confirmed);
    result.put("diagnosisCount", diagnoses.size());
    result.put("prescriptionCount", prescriptions.size());
    result.put("patientCount", patientCount);
    result.put(
        "recentDiagnoses",
        diagnoses.stream()
            .limit(5)
            .map(
                d ->
                    Map.of(
                        "id",
                        d.getId(),
                        "title",
                        safeText(d.getTitle(), "Diagnozë"),
                        "patientName",
                        patientDisplayName(d.getPatient()),
                        "severity",
                        safeText(d.getSeverity(), ""),
                        "diagnosedAt",
                        d.getDiagnosedAt() != null ? d.getDiagnosedAt() : Instant.now()))
            .toList());
    result.put(
        "recentPrescriptions",
        prescriptions.stream()
            .limit(5)
            .map(
                p ->
                    Map.of(
                        "id",
                        p.getId(),
                        "medicineName",
                        p.getMedicine() != null && p.getMedicine().getName() != null
                            ? p.getMedicine().getName()
                            : "—",
                        "patientName",
                        patientDisplayName(p.getPatient()),
                        "status",
                        safeText(p.getStatus(), "ACTIVE"),
                        "prescribedAt",
                        p.getPrescribedAt() != null ? p.getPrescribedAt() : Instant.now()))
            .toList());
    return result;
  }

  @Transactional(readOnly = true)
  public List<DoctorAppointmentDTO> doctorAppointmentDtos(Long userId) {
    Doctor doctor = requireDoctorByUserId(userId);
    Long doctorId = Require.notNull(doctor.getId(), "ID e mjekut");
    return appointmentRepository.findByDoctorIdOrderByCreatedAtDesc(doctorId).stream()
        .map(this::toAppointmentDto)
        .toList();
  }

  public Appointment updateAppointmentStatus(Long userId, Long appointmentId, String status) {
    Doctor doctor = requireDoctorByUserId(userId);
    long apptId = Require.id(appointmentId, "ID e terminit");
    String newStatus = Require.notBlank(status, "Statusi");
    Appointment appointment =
        appointmentRepository
            .findById(apptId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Termini nuk u gjet."));
    Doctor apptDoctor = appointment.getDoctor();
    if (apptDoctor == null || apptDoctor.getId() == null || !apptDoctor.getId().equals(doctor.getId())) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Ky termin nuk i përket këtij mjeku.");
    }
    appointment.setStatus(newStatus);
    return appointmentRepository.save(appointment);
  }

  @Transactional(readOnly = true)
  public List<Diagnosis> doctorDiagnoses(Long userId) {
    Doctor doctor = requireDoctorByUserId(userId);
    Long doctorId = Require.notNull(doctor.getId(), "ID e mjekut");
    return diagnosisRepository.findByDoctorIdOrderByCreatedAtDesc(doctorId);
  }

  @Transactional(readOnly = true)
  public List<Prescription> doctorPrescriptions(Long userId) {
    Doctor doctor = requireDoctorByUserId(userId);
    Long doctorId = Require.notNull(doctor.getId(), "ID e mjekut");
    return prescriptionRepository.findByDoctorIdOrderByPrescribedAtDesc(doctorId);
  }

  @Transactional(readOnly = true)
  public DoctorProfileDTO doctorProfile(Long userId) {
    return toDoctorProfileDto(requireDoctorByUserId(userId));
  }

  @Transactional(readOnly = true)
  public List<Medicine> medicinesForDoctor(Long userId) {
    Doctor doctor = requireDoctorByUserId(userId);
    return medicineRepository.findBySpecialtyKeyOrderByNameAsc(resolveMedicineSpecialtyKey(doctor));
  }

  public List<Patient> listPatientsForDoctor(Long userId) {
    Doctor doctor = requireDoctorByUserId(userId);
    Long doctorId = Require.notNull(doctor.getId(), "ID e mjekut");
    List<Appointment> appointments = appointmentRepository.findByDoctorIdOrderByCreatedAtDesc(doctorId);
    Map<Long, Patient> byId = new LinkedHashMap<>();
    for (Appointment appointment : appointments) {
      Patient patient = resolveAppointmentPatient(appointment);
      if (patient != null && patient.getId() != null) {
        byId.putIfAbsent(patient.getId(), patient);
      }
    }
    return new ArrayList<>(byId.values());
  }

  public String patientDisplayName(PatientProfile profile) {
    if (profile == null) {
      return "Pacient";
    }
    if (profile.getUser() != null) {
      String name = profile.getUser().getFullName();
      if (name != null && !name.isBlank()) {
        return name;
      }
    }
    if (profile.getPatient() != null) {
      return patientDisplayName(profile.getPatient());
    }
    return "Pacient";
  }

  public String patientDisplayName(Patient patient) {
    if (patient == null) {
      return "Pacient";
    }
    if (patient.getUserId() != null) {
      return patientProfileRepository
          .findByUserId(patient.getUserId())
          .map(this::patientDisplayName)
          .orElseGet(() -> fallbackPatientName(patient));
    }
    return fallbackPatientName(patient);
  }

  public Diagnosis createDiagnosis(
      Long doctorUserId, Long patientId, String title, String description, String severity) {
    Doctor doctor = requireDoctorByUserId(doctorUserId);
    long pid = Require.id(patientId, "ID e pacientit");
    String diagnosisTitle = Require.notBlank(title, "Titulli i diagnozës");
    Patient patient = resolvePatientById(pid);
    assertDoctorPatientAccess(doctor, patient);

    Diagnosis d = new Diagnosis();
    d.setDoctor(doctor);
    d.setPatient(patient);
    d.setDiagnosisName(diagnosisTitle);
    d.setDescription(description);
    d.setSeverity(severity);
    d.setCreatedAt(LocalDateTime.now());
    return diagnosisRepository.save(d);
  }

  public Prescription createPrescription(
      Long doctorUserId,
      Long patientId,
      Long medicineId,
      String dosage,
      String frequency,
      String instructions) {
    Doctor doctor = requireDoctorByUserId(doctorUserId);
    long pid = Require.id(patientId, "ID e pacientit");
    long medId = Require.id(medicineId, "ID e barnës");
    String dose = Require.notBlank(dosage, "Doza");
    Patient patient = resolvePatientById(pid);
    assertDoctorPatientAccess(doctor, patient);
    Medicine medicine =
        medicineRepository
            .findById(medId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Barna nuk u gjet."));
    String doctorKey = resolveMedicineSpecialtyKey(doctor);
    if (medicine.getSpecialtyKey() != null
        && !doctorKey.equalsIgnoreCase(medicine.getSpecialtyKey())) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "Kjo barë nuk i përket specialitetit tuaj.");
    }
    Prescription p = new Prescription();
    p.setDoctor(doctor);
    p.setPatient(patient);
    p.setMedicine(medicine);
    p.setDosage(dose);
    p.setFrequency(frequency);
    p.setInstructions(instructions);
    p.setStatus("ACTIVE");
    return prescriptionRepository.save(p);
  }

  public void linkAppointmentToPatient(Appointment appointment) {
    if (appointment == null) {
      return;
    }
    Patient patient =
        patientService.ensureForAppointment(
            appointment.getPatientName(), appointment.getEmail(), appointment.getPhone());
    appointment.setPatient(patient);
    if (patient.getUserId() != null) {
      patientProfileRepository
          .findByUserId(patient.getUserId())
          .ifPresent(profile -> appointment.setPatientProfileId(profile.getId()));
    }
    appointmentRepository.save(appointment);
  }

  private void assertDoctorPatientAccess(Doctor doctor, Patient patient) {
    Long doctorId = Require.notNull(doctor.getId(), "ID e mjekut");
    Long patientId = Require.notNull(patient.getId(), "ID e pacientit");
    boolean linked =
        appointmentRepository.findByDoctorIdOrderByCreatedAtDesc(doctorId).stream()
            .anyMatch(
                a -> a.getPatient() != null && patientId.equals(a.getPatient().getId()));
    if (!linked) {
      throw new ResponseStatusException(
          HttpStatus.FORBIDDEN, "Ky pacient nuk ka termin me këtë mjek.");
    }
  }

  private Patient resolveAppointmentPatient(Appointment appointment) {
    if (appointment.getPatient() != null && appointment.getPatient().getId() != null) {
      return appointment.getPatient();
    }
    linkAppointmentToPatient(appointment);
    return appointment.getPatient();
  }

  private DoctorAppointmentDTO toAppointmentDto(Appointment appointment) {
    Patient patient = appointment.getPatient();
    Long patientId = patient != null ? patient.getId() : null;
    return new DoctorAppointmentDTO(
        appointment.getId(),
        appointment.getPatientName(),
        appointment.getEmail(),
        appointment.getPhone(),
        appointment.getPreferredDate(),
        appointment.getMessage(),
        appointment.getStatus(),
        patientId,
        appointment.getCreatedAt());
  }

  private DoctorProfileDTO toDoctorProfileDto(Doctor doctor) {
    String departmentName =
        doctor.getDepartment() != null ? doctor.getDepartment().getName() : null;
    return new DoctorProfileDTO(
        doctor.getId(),
        doctor.getFullName(),
        doctor.getEmail(),
        doctor.getPhone(),
        doctor.getSpecialty(),
        doctor.getBio(),
        doctor.getImageUrl(),
        departmentName);
  }

  private String fallbackPatientName(Patient patient) {
    String username = patient.getUsername();
    if (username != null && !username.isBlank()) {
      return username;
    }
    String email = patient.getEmail();
    if (email != null && email.contains("@")) {
      return email.substring(0, email.indexOf('@'));
    }
    return "Pacient";
  }

  private String safeText(String value, String fallback) {
    return value != null && !value.isBlank() ? value : fallback;
  }

  private String resolveMedicineSpecialtyKey(Doctor doctor) {
    String specialty = doctor.getSpecialty() != null ? doctor.getSpecialty().toLowerCase() : "";
    String department =
        doctor.getDepartment() != null && doctor.getDepartment().getName() != null
            ? doctor.getDepartment().getName().toLowerCase()
            : "";
    String combined = specialty + " " + department;
    if (combined.contains("kardiolog") || combined.contains("arreste") || combined.contains("zemer")) {
      return "CARDIOLOGY";
    }
    if (combined.contains("pediatr") || combined.contains("fëmij") || combined.contains("femij")) {
      return "PEDIATRICS";
    }
    if (combined.contains("neurolog") || combined.contains("trur") || combined.contains("nervor")) {
      return "NEUROLOGY";
    }
    if (combined.contains("onkolog") || combined.contains("kancer")) {
      return "ONCOLOGY";
    }
    return "GENERAL";
  }

  private Patient resolvePatient(PatientProfile profile, AppUser user) {
    if (profile.getPatient() != null) {
      return profile.getPatient();
    }
    Patient patient = patientService.ensureForUser(user);
    profile.setPatient(patient);
    patientProfileRepository.save(profile);
    return patient;
  }

  private Patient resolvePatientById(long patientOrProfileId) {
    return patientRepository
        .findById(patientOrProfileId)
        .orElseGet(
            () ->
                patientProfileRepository
                    .findById(patientOrProfileId)
                    .map(PatientProfile::getPatient)
                    .orElseThrow(
                        () ->
                            new ResponseStatusException(
                                HttpStatus.NOT_FOUND, "Pacienti nuk u gjet.")));
  }
}
