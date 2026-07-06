package com.hospital.repository;

import com.hospital.entity.DoctorHiddenPatient;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DoctorHiddenPatientRepository extends JpaRepository<DoctorHiddenPatient, Long> {
  List<DoctorHiddenPatient> findByDoctorId(Long doctorId);

  boolean existsByDoctorIdAndPatientId(Long doctorId, Long patientId);

  void deleteByDoctorIdAndPatientId(Long doctorId, Long patientId);
}
