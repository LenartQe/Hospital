package com.hospital.repository;

import com.hospital.entity.Patient;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PatientRepository extends JpaRepository<Patient, Long> {
  Optional<Patient> findByUsername(String username);

  Optional<Patient> findByEmail(String email);

  Optional<Patient> findByUserId(Long userId);

  Optional<Patient> findByUsernameOrEmail(String username, String email);

  List<Patient> findAllByOrderByIdDesc();
}
