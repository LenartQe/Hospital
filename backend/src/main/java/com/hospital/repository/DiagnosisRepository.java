package com.hospital.repository;

import com.hospital.entity.Diagnosis;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DiagnosisRepository extends JpaRepository<Diagnosis, Long> {
  @Query("SELECT d FROM Diagnosis d WHERE d.patient.id = :patientId ORDER BY d.createdAt DESC")
  List<Diagnosis> findByPatientIdOrderByCreatedAtDesc(@Param("patientId") Long patientId);

  @Query("SELECT d FROM Diagnosis d WHERE d.doctor.id = :doctorId ORDER BY d.createdAt DESC")
  List<Diagnosis> findByDoctorIdOrderByCreatedAtDesc(@Param("doctorId") Long doctorId);

  @Query("SELECT COUNT(d) FROM Diagnosis d WHERE d.doctor.id = :doctorId")
  long countByDoctorId(@Param("doctorId") Long doctorId);

  @Modifying(clearAutomatically = true, flushAutomatically = true)
  @Query("DELETE FROM Diagnosis d WHERE d.doctor.id = :doctorId")
  void deleteByDoctorId(@Param("doctorId") Long doctorId);
}
