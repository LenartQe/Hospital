package com.hospital.repository;

import com.hospital.entity.Doctor;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
  List<Doctor> findByDepartmentId(Long departmentId);

  Optional<Doctor> findByUserId(Long userId);

  Optional<Doctor> findByEmail(String email);

  @Modifying(clearAutomatically = true, flushAutomatically = true)
  @Query(value = "UPDATE doctors SET department_id = NULL WHERE department_id = :departmentId", nativeQuery = true)
  void clearDepartmentLink(@Param("departmentId") Long departmentId);
}
