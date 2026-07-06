package com.hospital.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "doctors")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Doctor {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "full_name", nullable = false, length = 200)
  private String name;

  @Column(length = 255)
  private String email;

  @Column(length = 50)
  private String phone;

  @Column(name = "specialty", length = 200)
  private String specialization;

  @Column(name = "treatment_type", length = 300)
  private String treatmentType;

  @Column(length = 4000)
  private String bio;

  @Column(name = "image_url", length = 500)
  private String imageUrl;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "department_id", nullable = true)
  @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
  private Department department;

  @Column(name = "user_id", unique = true)
  private Long userId;

  /** Shown on the public Mjekët page and doctor login picker. */
  @Column(name = "featured", nullable = false)
  private boolean featured = false;

  @Column(name = "created_at")
  private Instant createdAt = Instant.now();

  @OneToMany(mappedBy = "doctor", fetch = FetchType.LAZY)
  @JsonIgnore
  private List<Appointment> appointments = new ArrayList<>();

  @OneToMany(mappedBy = "doctor", fetch = FetchType.LAZY)
  @JsonIgnore
  private List<Diagnosis> diagnoses = new ArrayList<>();

  /** Backward-compatible accessors used by existing code. */
  public String getFullName() {
    return name;
  }

  public void setFullName(String fullName) {
    this.name = fullName;
  }

  public String getSpecialty() {
    return specialization;
  }

  public void setSpecialty(String specialty) {
    this.specialization = specialty;
  }
}
