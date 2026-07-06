package com.hospital.repository;

import com.hospital.entity.Medicine;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MedicineRepository extends JpaRepository<Medicine, Long> {
  List<Medicine> findBySpecialtyKeyOrderByNameAsc(String specialtyKey);
}
