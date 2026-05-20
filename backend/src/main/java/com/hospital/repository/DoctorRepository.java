package com.hospital.repository;

import com.hospital.entity.Doctor;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
  List<Doctor> findByDepartmentId(Long departmentId);

  Optional<Doctor> findByUserId(Long userId);

  Optional<Doctor> findByEmail(String email);
}
