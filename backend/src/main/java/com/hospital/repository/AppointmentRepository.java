package com.hospital.repository;

import com.hospital.entity.Appointment;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
  List<Appointment> findByPatientProfileIdOrderByCreatedAtDesc(Long patientProfileId);

  List<Appointment> findByPatientIdOrderByCreatedAtDesc(Long patientId);

  List<Appointment> findByDoctorIdOrderByCreatedAtDesc(Long doctorId);

  long countByDoctorId(Long doctorId);

  long countByDoctorIdAndStatusIgnoreCase(Long doctorId, String status);

  @Modifying(clearAutomatically = true, flushAutomatically = true)
  @Query("DELETE FROM Appointment a WHERE a.doctor.id = :doctorId")
  void deleteByDoctorId(@Param("doctorId") Long doctorId);
}
