package com.hospital.service;

import com.hospital.dto.PatientDashboardDto;
import com.hospital.entity.Appointment;
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
    return patientProfileRepository
        .findByUserId(userId)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Profili i pacientit nuk u gjet."));
  }

  public Doctor requireDoctorByUserId(Long userId) {
    return doctorRepository
        .findByUserId(userId)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Profili i mjekut nuk u gjet."));
  }

  public PatientDashboardDto patientDashboard(Long userId) {
    PatientProfile profile = requirePatientProfile(userId);
    Long pid = profile.getId();
    List<Diagnosis> diagnoses = diagnosisRepository.findByPatientIdOrderByDiagnosedAtDesc(pid);
    List<Prescription> prescriptions = prescriptionRepository.findByPatientIdOrderByPrescribedAtDesc(pid);
    List<Appointment> appointments =
        appointmentRepository.findByPatientProfileIdOrderByCreatedAtDesc(pid);
    var user = profile.getUser();
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
    Long doctorId = doctor.getId();
    List<Appointment> appointments = appointmentRepository.findByDoctorIdOrderByCreatedAtDesc(doctorId);
    long pending =
        appointments.stream().filter(a -> "PENDING".equalsIgnoreCase(a.getStatus())).count();
    long confirmed =
        appointments.stream().filter(a -> "CONFIRMED".equalsIgnoreCase(a.getStatus())).count();
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
    return appointmentRepository.findByDoctorIdOrderByCreatedAtDesc(doctor.getId());
  }

  public Appointment updateAppointmentStatus(Long userId, Long appointmentId, String status) {
    Doctor doctor = requireDoctorByUserId(userId);
    Appointment appointment =
        appointmentRepository
            .findById(appointmentId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Termini nuk u gjet."));
    if (appointment.getDoctor() == null || !appointment.getDoctor().getId().equals(doctor.getId())) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Ky termin nuk i përket këtij mjeku.");
    }
    appointment.setStatus(status);
    return appointmentRepository.save(appointment);
  }

  public List<Diagnosis> doctorDiagnoses(Long userId) {
    Doctor doctor = requireDoctorByUserId(userId);
    return diagnosisRepository.findByDoctorIdOrderByDiagnosedAtDesc(doctor.getId());
  }

  public List<Prescription> doctorPrescriptions(Long userId) {
    Doctor doctor = requireDoctorByUserId(userId);
    return prescriptionRepository.findByDoctorIdOrderByPrescribedAtDesc(doctor.getId());
  }

  public Doctor doctorProfile(Long userId) {
    return requireDoctorByUserId(userId);
  }

  public List<PatientProfile> listPatientsForDoctor() {
    return patientProfileRepository.findAll();
  }

  public Diagnosis createDiagnosis(Long doctorUserId, Long patientId, String title, String description, String severity) {
    Doctor doctor = requireDoctorByUserId(doctorUserId);
    PatientProfile patient =
        patientProfileRepository
            .findById(patientId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pacienti nuk u gjet."));
    Diagnosis d = new Diagnosis();
    d.setDoctor(doctor);
    d.setPatient(patient);
    d.setTitle(title);
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
    PatientProfile patient =
        patientProfileRepository
            .findById(patientId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pacienti nuk u gjet."));
    Medicine medicine =
        medicineRepository
            .findById(medicineId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Barna nuk u gjet."));
    Prescription p = new Prescription();
    p.setDoctor(doctor);
    p.setPatient(patient);
    p.setMedicine(medicine);
    p.setDosage(dosage);
    p.setFrequency(frequency);
    p.setInstructions(instructions);
    p.setStatus("ACTIVE");
    p.setPrescribedAt(Instant.now());
    return prescriptionRepository.save(p);
  }
}
