package com.hospital.service;

import com.hospital.dto.DoctorDashboardDTO;
import com.hospital.entity.Appointment;
import com.hospital.repository.AppointmentRepository;
import com.hospital.repository.DiagnosisRepository;
import com.hospital.repository.DoctorRepository;
import com.hospital.repository.PrescriptionRepository;
import com.hospital.util.Require;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class DoctorService {

  private final DoctorRepository doctorRepository;
  private final AppointmentRepository appointmentRepository;
  private final DiagnosisRepository diagnosisRepository;
  private final PrescriptionRepository prescriptionRepository;

  public DoctorService(
      DoctorRepository doctorRepository,
      AppointmentRepository appointmentRepository,
      DiagnosisRepository diagnosisRepository,
      PrescriptionRepository prescriptionRepository) {
    this.doctorRepository = doctorRepository;
    this.appointmentRepository = appointmentRepository;
    this.diagnosisRepository = diagnosisRepository;
    this.prescriptionRepository = prescriptionRepository;
  }

  public DoctorDashboardDTO getDashboardSummary(Long doctorId) {
    Require.found(doctorRepository.findById(doctorId), "Doctor not found");

    int totalAppointments = (int) appointmentRepository.countByDoctorId(doctorId);
    int pendingAppointments =
        (int) appointmentRepository.countByDoctorIdAndStatusIgnoreCase(doctorId, "PENDING");
    int totalDiagnoses = (int) diagnosisRepository.countByDoctorId(doctorId);
    int totalPrescriptions = (int) prescriptionRepository.countByDoctorId(doctorId);

    return new DoctorDashboardDTO(
        totalAppointments, pendingAppointments, totalDiagnoses, totalPrescriptions);
  }

  public List<Appointment> getAppointments(Long doctorId) {
    Require.found(doctorRepository.findById(doctorId), "Doctor not found");
    return appointmentRepository.findByDoctorIdOrderByCreatedAtDesc(doctorId);
  }
}
