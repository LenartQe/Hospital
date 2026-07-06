package com.hospital.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.ConstraintMode;
import jakarta.persistence.ForeignKey;

@Entity
@Table(name = "diagnoses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Diagnosis {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "title", nullable = false, length = 300)
  private String diagnosisName;

  @Column(length = 4000)
  private String description;

  @Column(name = "prescribed_medication", length = 2000)
  private String prescribedMedication;

  @Column(name = "diagnosed_at", nullable = false)
  private LocalDateTime createdAt = LocalDateTime.now();

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "patient_id", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
  @JsonIgnoreProperties({"appointments", "diagnoses", "hibernateLazyInitializer", "handler"})
  private Patient patient;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "doctor_id", nullable = false)
  @JsonIgnoreProperties({"appointments", "diagnoses", "department", "hibernateLazyInitializer", "handler"})
  private Doctor doctor;

  /** Legacy field kept for older API consumers. */
  @Column(length = 50)
  private String severity;

  /** Backward-compatible alias. */
  public String getTitle() {
    return diagnosisName;
  }

  public void setTitle(String title) {
    this.diagnosisName = title;
  }

  /** Backward-compatible alias for portal APIs. */
  public Instant getDiagnosedAt() {
    return createdAt == null
        ? null
        : createdAt.atZone(ZoneId.systemDefault()).toInstant();
  }

  public void setDiagnosedAt(Instant diagnosedAt) {
    this.createdAt =
        diagnosedAt == null ? null : LocalDateTime.ofInstant(diagnosedAt, ZoneId.systemDefault());
  }
}
