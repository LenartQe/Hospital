package com.hospital.repository;

import com.hospital.entity.Diagnosis;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DiagnosisRepository extends JpaRepository<Diagnosis, Long> {
  List<Diagnosis> findByPatientIdOrderByDiagnosedAtDesc(Long patientId);

  List<Diagnosis> findByDoctorIdOrderByDiagnosedAtDesc(Long doctorId);
}
