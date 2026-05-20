package com.hospital.repository;

import com.hospital.entity.AppUser;
import com.hospital.entity.UserRole;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppUserRepository extends JpaRepository<AppUser, Long> {
  Optional<AppUser> findByEmail(String email);

  Optional<AppUser> findByEmailAndRole(String email, UserRole role);

  Optional<AppUser> findFirstByRole(UserRole role);

  List<AppUser> findAllByRole(UserRole role);

  boolean existsByEmail(String email);
}
