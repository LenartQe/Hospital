package com.hospital.repository;

import com.hospital.entity.Prescription;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
  List<Prescription> findByPatientIdOrderByPrescribedAtDesc(Long patientId);

  List<Prescription> findByDoctorIdOrderByPrescribedAtDesc(Long doctorId);

  @Modifying(clearAutomatically = true, flushAutomatically = true)
  @Query("DELETE FROM Prescription p WHERE p.doctor.id = :doctorId")
  void deleteByDoctorId(@Param("doctorId") Long doctorId);

  @Modifying(clearAutomatically = true, flushAutomatically = true)
  @Query("DELETE FROM Prescription p WHERE p.medicine.id = :medicineId")
  void deleteByMedicineId(@Param("medicineId") Long medicineId);
}
