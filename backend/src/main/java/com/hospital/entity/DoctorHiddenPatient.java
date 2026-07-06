package com.hospital.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.Instant;

@Entity
@Table(
    name = "doctor_hidden_patients",
    uniqueConstraints = @UniqueConstraint(columnNames = {"doctor_id", "patient_id"}))
public class DoctorHiddenPatient {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "doctor_id", nullable = false)
  private Long doctorId;

  @Column(name = "patient_id", nullable = false)
  private Long patientId;

  @Column(name = "hidden_at")
  private Instant hiddenAt = Instant.now();

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Long getDoctorId() {
    return doctorId;
  }

  public void setDoctorId(Long doctorId) {
    this.doctorId = doctorId;
  }

  public Long getPatientId() {
    return patientId;
  }

  public void setPatientId(Long patientId) {
    this.patientId = patientId;
  }

  public Instant getHiddenAt() {
    return hiddenAt;
  }

  public void setHiddenAt(Instant hiddenAt) {
    this.hiddenAt = hiddenAt;
  }
}
