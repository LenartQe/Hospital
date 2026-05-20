package com.hospital.repository;

import com.hospital.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
  java.util.List<Appointment> findByPatientProfileIdOrderByCreatedAtDesc(Long patientProfileId);

  java.util.List<Appointment> findByDoctorIdOrderByCreatedAtDesc(Long doctorId);
}
