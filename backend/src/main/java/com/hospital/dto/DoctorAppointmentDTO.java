package com.hospital.dto;

import java.time.Instant;
import java.time.LocalDate;

public class DoctorAppointmentDTO {
  private Long id;
  private String patientName;
  private String email;
  private String phone;
  private LocalDate preferredDate;
  private String message;
  private String status;
  private Long patientId;
  private Instant createdAt;

  public DoctorAppointmentDTO() {}

  public DoctorAppointmentDTO(
      Long id,
      String patientName,
      String email,
      String phone,
      LocalDate preferredDate,
      String message,
      String status,
      Long patientId,
      Instant createdAt) {
    this.id = id;
    this.patientName = patientName;
    this.email = email;
    this.phone = phone;
    this.preferredDate = preferredDate;
    this.message = message;
    this.status = status;
    this.patientId = patientId;
    this.createdAt = createdAt;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getPatientName() {
    return patientName;
  }

  public void setPatientName(String patientName) {
    this.patientName = patientName;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPhone() {
    return phone;
  }

  public void setPhone(String phone) {
    this.phone = phone;
  }

  public LocalDate getPreferredDate() {
    return preferredDate;
  }

  public void setPreferredDate(LocalDate preferredDate) {
    this.preferredDate = preferredDate;
  }

  public String getMessage() {
    return message;
  }

  public void setMessage(String message) {
    this.message = message;
  }

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }

  public Long getPatientId() {
    return patientId;
  }

  public void setPatientId(Long patientId) {
    this.patientId = patientId;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(Instant createdAt) {
    this.createdAt = createdAt;
  }
}
