package com.hospital.service;

import com.hospital.dto.DoctorAppointmentDTO;
import com.hospital.dto.DoctorProfileDTO;
import com.hospital.dto.PatientDashboardDto;
import com.hospital.dto.PatientInvoiceLineDto;
import com.hospital.entity.Appointment;
import com.hospital.entity.AppUser;
import com.hospital.entity.Diagnosis;
import com.hospital.entity.Doctor;
import com.hospital.entity.DoctorHiddenPatient;
import com.hospital.entity.Medicine;
import com.hospital.entity.Patient;
import com.hospital.entity.PatientProfile;
import com.hospital.entity.Prescription;
import com.hospital.repository.AppointmentRepository;
import com.hospital.repository.DiagnosisRepository;
import com.hospital.repository.DoctorHiddenPatientRepository;
import com.hospital.repository.DoctorRepository;
import com.hospital.repository.MedicineRepository;
import com.hospital.repository.PatientProfileRepository;
import com.hospital.repository.PatientRepository;
import com.hospital.repository.PrescriptionRepository;
import com.hospital.util.Require;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
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
  private final DoctorHiddenPatientRepository doctorHiddenPatientRepository;

  public PortalService(
      PatientProfileRepository patientProfileRepository,
      PatientRepository patientRepository,
      PatientService patientService,
      DoctorRepository doctorRepository,
      DiagnosisRepository diagnosisRepository,
      PrescriptionRepository prescriptionRepository,
      AppointmentRepository appointmentRepository,
      MedicineRepository medicineRepository,
      DoctorHiddenPatientRepository doctorHiddenPatientRepository) {
    this.patientProfileRepository = patientProfileRepository;
    this.patientRepository = patientRepository;
    this.patientService = patientService;
    this.doctorRepository = doctorRepository;
    this.diagnosisRepository = diagnosisRepository;
    this.prescriptionRepository = prescriptionRepository;
    this.appointmentRepository = appointmentRepository;
    this.medicineRepository = medicineRepository;
    this.doctorHiddenPatientRepository = doctorHiddenPatientRepository;
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
    syncPatientRecords(profile, user, patient);
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
    List<PatientInvoiceLineDto> invoiceLines = buildInvoiceLines(prescriptions);
    BigDecimal invoiceTotal =
        invoiceLines.stream()
            .map(PatientInvoiceLineDto::getLineTotal)
            .filter(total -> total != null)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

    String displayEmail =
        user.getEmail() != null && !user.getEmail().isBlank()
            ? user.getEmail()
            : patient.getEmail();

    return new PatientDashboardDto(
        user.getFullName(),
        displayEmail,
        user.getPhone() != null ? user.getPhone() : patient.getPhoneNumber(),
        profile.getDateOfBirth(),
        patient.getBloodType() != null ? patient.getBloodType() : profile.getBloodType(),
        patient.getAllergies() != null ? patient.getAllergies() : profile.getAllergies(),
        profile.getNotes(),
        diagnoses,
        prescriptions,
        appointments,
        invoiceLines,
        invoiceTotal);
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
    Set<Long> hidden = new HashSet<>();
    doctorHiddenPatientRepository.findByDoctorId(doctorId).forEach(h -> hidden.add(h.getPatientId()));
    List<Appointment> appointments = appointmentRepository.findByDoctorIdOrderByCreatedAtDesc(doctorId);
    Map<Long, Patient> byId = new LinkedHashMap<>();
    for (Appointment appointment : appointments) {
      Patient patient = resolveAppointmentPatient(appointment);
      if (patient != null && patient.getId() != null && !hidden.contains(patient.getId())) {
        byId.putIfAbsent(patient.getId(), patient);
      }
    }
    return new ArrayList<>(byId.values());
  }

  public void hidePatientFromDoctor(Long userId, Long patientId) {
    Doctor doctor = requireDoctorByUserId(userId);
    long pid = Require.id(patientId, "ID e pacientit");
    Patient patient = resolvePatientById(pid);
    assertDoctorPatientAccess(doctor, patient);
    Long doctorId = Require.notNull(doctor.getId(), "ID e mjekut");
    if (!doctorHiddenPatientRepository.existsByDoctorIdAndPatientId(doctorId, pid)) {
      DoctorHiddenPatient hidden = new DoctorHiddenPatient();
      hidden.setDoctorId(doctorId);
      hidden.setPatientId(pid);
      doctorHiddenPatientRepository.save(hidden);
    }
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

  private void syncPatientRecords(PatientProfile profile, AppUser user, Patient patient) {
    boolean patientUpdated = false;
    if ((patient.getEmail() == null || patient.getEmail().isBlank())
        && user.getEmail() != null
        && !user.getEmail().isBlank()) {
      patient.setEmail(user.getEmail().trim().toLowerCase());
      patientUpdated = true;
    }
    if ((patient.getPhoneNumber() == null || patient.getPhoneNumber().isBlank())
        && user.getPhone() != null
        && !user.getPhone().isBlank()) {
      patient.setPhoneNumber(user.getPhone());
      patientUpdated = true;
    }
    if (patientUpdated) {
      patientRepository.save(patient);
    }

    patientRepository
        .findByEmail(user.getEmail())
        .filter(existing -> existing.getUserId() == null)
        .ifPresent(
            existing -> {
              existing.setUserId(user.getId());
              patientRepository.save(existing);
              if (profile.getPatient() == null || !existing.getId().equals(profile.getPatient().getId())) {
                profile.setPatient(existing);
                patientProfileRepository.save(profile);
              }
            });

    if (user.getEmail() != null && !user.getEmail().isBlank()) {
      for (Appointment appointment :
          appointmentRepository.findByEmailIgnoreCaseOrderByCreatedAtDesc(user.getEmail())) {
        linkAppointmentToPatientRecord(appointment, profile, patient);
      }
    }
    if (profile.getId() != null) {
      for (Appointment appointment :
          appointmentRepository.findByPatientProfileIdOrderByCreatedAtDesc(profile.getId())) {
        linkAppointmentToPatientRecord(appointment, profile, patient);
      }
    }
  }

  private void linkAppointmentToPatientRecord(
      Appointment appointment, PatientProfile profile, Patient patient) {
    boolean changed = false;
    if (appointment.getPatient() == null
        || !patient.getId().equals(appointment.getPatient().getId())) {
      appointment.setPatient(patient);
      changed = true;
    }
    if (profile.getId() != null && appointment.getPatientProfileId() == null) {
      appointment.setPatientProfileId(profile.getId());
      changed = true;
    }
    if (changed) {
      appointmentRepository.save(appointment);
    }
  }

  private List<PatientInvoiceLineDto> buildInvoiceLines(List<Prescription> prescriptions) {
    List<PatientInvoiceLineDto> lines = new ArrayList<>();
    for (Prescription prescription : prescriptions) {
      Medicine medicine = prescription.getMedicine();
      BigDecimal unitPrice =
          medicine != null && medicine.getPrice() != null ? medicine.getPrice() : BigDecimal.ZERO;
      String doctorName =
          prescription.getDoctor() != null ? prescription.getDoctor().getFullName() : "—";
      String medicineName = medicine != null ? medicine.getName() : "—";
      lines.add(
          new PatientInvoiceLineDto(
              prescription.getId(),
              medicineName,
              prescription.getDosage(),
              prescription.getFrequency(),
              doctorName,
              unitPrice,
              unitPrice,
              prescription.getPrescribedAt()));
    }
    return lines;
  }
}
