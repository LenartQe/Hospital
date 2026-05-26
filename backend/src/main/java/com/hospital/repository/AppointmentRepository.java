package com.hospital.repository;

import com.hospital.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
  java.util.List<Appointment> findByPatientProfileIdOrderByCreatedAtDesc(Long patientProfileId);

  java.util.List<Appointment> findByDoctorIdOrderByCreatedAtDesc(Long doctorId);

  @Modifying(clearAutomatically = true, flushAutomatically = true)
  @Query("DELETE FROM Appointment a WHERE a.doctor.id = :doctorId")
  void deleteByDoctorId(@Param("doctorId") Long doctorId);
}
