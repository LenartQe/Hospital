package com.hospital.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "patients")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Patient {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true, length = 120)
  private String username;

  @Column(nullable = false, unique = true, length = 255)
  private String email;

  @Column(name = "phone_number", length = 50)
  private String phoneNumber;

  @Column(name = "blood_type", length = 10)
  private String bloodType;

  @Column(length = 2000)
  private String allergies;

  /** REGISTERED, ACTIVE, INACTIVE */
  @Column(nullable = false, length = 20)
  private String status = "ACTIVE";

  @Column(name = "user_id", unique = true)
  private Long userId;

  @OneToMany(mappedBy = "patient", fetch = FetchType.LAZY)
  @JsonIgnore
  private List<Appointment> appointments = new ArrayList<>();

  @OneToMany(mappedBy = "patient", fetch = FetchType.LAZY)
  @JsonIgnore
  private List<Diagnosis> diagnoses = new ArrayList<>();
}
