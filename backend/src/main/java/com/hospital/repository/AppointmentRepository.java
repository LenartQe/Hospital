package com.hospital.repository;

import com.hospital.entity.Appointment;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
  List<Appointment> findByPatientProfileIdOrderByCreatedAtDesc(Long patientProfileId);

  @Query("SELECT a FROM Appointment a WHERE a.patient.id = :patientId ORDER BY a.createdAt DESC")
  List<Appointment> findByPatientIdOrderByCreatedAtDesc(@Param("patientId") Long patientId);

  @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId ORDER BY a.createdAt DESC")
  List<Appointment> findByDoctorIdOrderByCreatedAtDesc(@Param("doctorId") Long doctorId);

  @Query("SELECT COUNT(a) FROM Appointment a WHERE a.doctor.id = :doctorId")
  long countByDoctorId(@Param("doctorId") Long doctorId);

  @Query("SELECT COUNT(a) FROM Appointment a WHERE a.doctor.id = :doctorId AND UPPER(a.status) = UPPER(:status)")
  long countByDoctorIdAndStatusIgnoreCase(@Param("doctorId") Long doctorId, @Param("status") String status);

  @Modifying(clearAutomatically = true, flushAutomatically = true)
  @Query("DELETE FROM Appointment a WHERE a.doctor.id = :doctorId")
  void deleteByDoctorId(@Param("doctorId") Long doctorId);
}
