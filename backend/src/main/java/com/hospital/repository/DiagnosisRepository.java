package com.hospital.repository;

import com.hospital.entity.Diagnosis;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DiagnosisRepository extends JpaRepository<Diagnosis, Long> {
  List<Diagnosis> findByPatientIdOrderByDiagnosedAtDesc(Long patientId);

  List<Diagnosis> findByDoctorIdOrderByDiagnosedAtDesc(Long doctorId);

  @Modifying(clearAutomatically = true, flushAutomatically = true)
  @Query("DELETE FROM Diagnosis d WHERE d.doctor.id = :doctorId")
  void deleteByDoctorId(@Param("doctorId") Long doctorId);
}
