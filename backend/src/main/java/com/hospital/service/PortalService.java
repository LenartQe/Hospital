package com.hospital.service;

import com.hospital.dto.PatientDashboardDto;
import com.hospital.entity.Appointment;
import com.hospital.entity.AppUser;
import com.hospital.entity.Diagnosis;
import com.hospital.entity.Doctor;
import com.hospital.entity.Medicine;
import com.hospital.entity.PatientProfile;
import com.hospital.entity.Prescription;
import com.hospital.repository.AppointmentRepository;
import com.hospital.repository.DiagnosisRepository;
import com.hospital.repository.DoctorRepository;
import com.hospital.repository.MedicineRepository;
import com.hospital.repository.PatientProfileRepository;
import com.hospital.repository.PrescriptionRepository;
import com.hospital.util.Require;
import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PortalService {

  private final PatientProfileRepository patientProfileRepository;
  private final DoctorRepository doctorRepository;
  private final DiagnosisRepository diagnosisRepository;
  private final PrescriptionRepository prescriptionRepository;
  private final AppointmentRepository appointmentRepository;
  private final MedicineRepository medicineRepository;

  public PortalService(
      PatientProfileRepository patientProfileRepository,
      DoctorRepository doctorRepository,
      DiagnosisRepository diagnosisRepository,
      PrescriptionRepository prescriptionRepository,
      AppointmentRepository appointmentRepository,
      MedicineRepository medicineRepository) {
    this.patientProfileRepository = patientProfileRepository;
    this.doctorRepository = doctorRepository;
    this.diagnosisRepository = diagnosisRepository;
    this.prescriptionRepository = prescriptionRepository;
    this.appointmentRepository = appointmentRepository;
    this.medicineRepository = medicineRepository;
  }

  public PatientProfile requirePatientProfile(Long userId) {
    long uid = Require.id(userId, "ID e përdoruesit");
    return patientProfileRepository
        .findByUserId(uid)
        .orElseThrow(
            () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Profili i pacientit nuk u gjet."));
  }

  public Doctor requireDoctorByUserId(Long userId) {
    long uid = Require.id(userId, "ID e përdoruesit");
    return doctorRepository
        .findByUserId(uid)
        .orElseThrow(
            () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Profili i mjekut nuk u gjet."));
  }

  public PatientDashboardDto patientDashboard(Long userId) {
    PatientProfile profile = requirePatientProfile(userId);
    Long pid = Require.notNull(profile.getId(), "ID e profilit");
    List<Diagnosis> diagnoses = diagnosisRepository.findByPatientIdOrderByDiagnosedAtDesc(pid);
    List<Prescription> prescriptions = prescriptionRepository.findByPatientIdOrderByPrescribedAtDesc(pid);
    List<Appointment> appointments =
        appointmentRepository.findByPatientProfileIdOrderByCreatedAtDesc(pid);
    AppUser user = Require.notNull(profile.getUser(), "Përdoruesi i pacientit");
    return new PatientDashboardDto(
        user.getFullName(),
        user.getEmail(),
        user.getPhone(),
        profile.getDateOfBirth(),
        profile.getBloodType(),
        profile.getAllergies(),
        profile.getNotes(),
        diagnoses,
        prescriptions,
        appointments);
  }

  public Map<String, Object> doctorDashboard(Long userId) {
    Doctor doctor = requireDoctorByUserId(userId);
    Long doctorId = Require.notNull(doctor.getId(), "ID e mjekut");
    List<Appointment> appointments = appointmentRepository.findByDoctorIdOrderByCreatedAtDesc(doctorId);
    long pending =
        appointments.stream()
            .filter(a -> a.getStatus() != null && "PENDING".equalsIgnoreCase(a.getStatus()))
            .count();
    long confirmed =
        appointments.stream()
            .filter(a -> a.getStatus() != null && "CONFIRMED".equalsIgnoreCase(a.getStatus()))
            .count();
    List<Diagnosis> diagnoses = diagnosisRepository.findByDoctorIdOrderByDiagnosedAtDesc(doctorId);
    List<Prescription> prescriptions = prescriptionRepository.findByDoctorIdOrderByPrescribedAtDesc(doctorId);
    long patientCount = patientProfileRepository.count();

    Map<String, Object> result = new HashMap<>();
    result.put("doctor", doctor);
    result.put("appointments", appointments);
    result.put("appointmentCount", appointments.size());
    result.put("pendingAppointments", pending);
    result.put("confirmedAppointments", confirmed);
    result.put("diagnosisCount", diagnoses.size());
    result.put("prescriptionCount", prescriptions.size());
    result.put("patientCount", patientCount);
    result.put("recentDiagnoses", diagnoses.stream().limit(5).toList());
    result.put("recentPrescriptions", prescriptions.stream().limit(5).toList());
    return result;
  }

  public List<Appointment> doctorAppointments(Long userId) {
    Doctor doctor = requireDoctorByUserId(userId);
    Long doctorId = Require.notNull(doctor.getId(), "ID e mjekut");
    return appointmentRepository.findByDoctorIdOrderByCreatedAtDesc(doctorId);
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

  public List<Diagnosis> doctorDiagnoses(Long userId) {
    Doctor doctor = requireDoctorByUserId(userId);
    Long doctorId = Require.notNull(doctor.getId(), "ID e mjekut");
    return diagnosisRepository.findByDoctorIdOrderByDiagnosedAtDesc(doctorId);
  }

  public List<Prescription> doctorPrescriptions(Long userId) {
    Doctor doctor = requireDoctorByUserId(userId);
    Long doctorId = Require.notNull(doctor.getId(), "ID e mjekut");
    return prescriptionRepository.findByDoctorIdOrderByPrescribedAtDesc(doctorId);
  }

  public Doctor doctorProfile(Long userId) {
    return requireDoctorByUserId(userId);
  }

  public List<PatientProfile> listPatientsForDoctor() {
    return patientProfileRepository.findAll();
  }

  public String patientDisplayName(PatientProfile patient) {
    if (patient == null || patient.getUser() == null) {
      return "Pacient";
    }
    String name = patient.getUser().getFullName();
    return name != null && !name.isBlank() ? name : "Pacient";
  }

  public Diagnosis createDiagnosis(
      Long doctorUserId, Long patientId, String title, String description, String severity) {
    Doctor doctor = requireDoctorByUserId(doctorUserId);
    long pid = Require.id(patientId, "ID e pacientit");
    String diagnosisTitle = Require.notBlank(title, "Titulli i diagnozës");
    PatientProfile patient =
        patientProfileRepository
            .findById(pid)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pacienti nuk u gjet."));
    Diagnosis d = new Diagnosis();
    d.setDoctor(doctor);
    d.setPatient(patient);
    d.setTitle(diagnosisTitle);
    d.setDescription(description);
    d.setSeverity(severity);
    d.setDiagnosedAt(Instant.now());
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
    PatientProfile patient =
        patientProfileRepository
            .findById(pid)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pacienti nuk u gjet."));
    Medicine medicine =
        medicineRepository
            .findById(medId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Barna nuk u gjet."));
    Prescription p = new Prescription();
    p.setDoctor(doctor);
    p.setPatient(patient);
    p.setMedicine(medicine);
    p.setDosage(dose);
    p.setFrequency(frequency);
    p.setInstructions(instructions);
    p.setStatus("ACTIVE");
    p.setPrescribedAt(Instant.now());
    return prescriptionRepository.save(p);
  }
}
