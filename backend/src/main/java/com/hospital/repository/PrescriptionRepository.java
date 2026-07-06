package com.hospital.repository;

import com.hospital.entity.Prescription;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
  @Query("SELECT p FROM Prescription p WHERE p.patient.id = :patientId ORDER BY p.prescribedAt DESC")
  List<Prescription> findByPatientIdOrderByPrescribedAtDesc(@Param("patientId") Long patientId);

  @Query("SELECT p FROM Prescription p WHERE p.doctor.id = :doctorId ORDER BY p.prescribedAt DESC")
  List<Prescription> findByDoctorIdOrderByPrescribedAtDesc(@Param("doctorId") Long doctorId);

  @Query("SELECT COUNT(p) FROM Prescription p WHERE p.doctor.id = :doctorId")
  long countByDoctorId(@Param("doctorId") Long doctorId);

  @Modifying(clearAutomatically = true, flushAutomatically = true)
  @Query("DELETE FROM Prescription p WHERE p.doctor.id = :doctorId")
  void deleteByDoctorId(@Param("doctorId") Long doctorId);

  @Modifying(clearAutomatically = true, flushAutomatically = true)
  @Query("DELETE FROM Prescription p WHERE p.medicine.id = :medicineId")
  void deleteByMedicineId(@Param("medicineId") Long medicineId);
}
