package com.hospital.repository;

import com.hospital.entity.Prescription;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
  List<Prescription> findByPatientIdOrderByPrescribedAtDesc(Long patientId);
}
