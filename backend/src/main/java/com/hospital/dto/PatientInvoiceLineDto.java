package com.hospital.dto;

import java.math.BigDecimal;
import java.time.Instant;

public class PatientInvoiceLineDto {
  private Long prescriptionId;
  private String medicineName;
  private String dosage;
  private String frequency;
  private String doctorName;
  private BigDecimal unitPrice;
  private BigDecimal lineTotal;
  private Instant prescribedAt;

  public PatientInvoiceLineDto() {}

  public PatientInvoiceLineDto(
      Long prescriptionId,
      String medicineName,
      String dosage,
      String frequency,
      String doctorName,
      BigDecimal unitPrice,
      BigDecimal lineTotal,
      Instant prescribedAt) {
    this.prescriptionId = prescriptionId;
    this.medicineName = medicineName;
    this.dosage = dosage;
    this.frequency = frequency;
    this.doctorName = doctorName;
    this.unitPrice = unitPrice;
    this.lineTotal = lineTotal;
    this.prescribedAt = prescribedAt;
  }

  public Long getPrescriptionId() {
    return prescriptionId;
  }

  public void setPrescriptionId(Long prescriptionId) {
    this.prescriptionId = prescriptionId;
  }

  public String getMedicineName() {
    return medicineName;
  }

  public void setMedicineName(String medicineName) {
    this.medicineName = medicineName;
  }

  public String getDosage() {
    return dosage;
  }

  public void setDosage(String dosage) {
    this.dosage = dosage;
  }

  public String getFrequency() {
    return frequency;
  }

  public void setFrequency(String frequency) {
    this.frequency = frequency;
  }

  public String getDoctorName() {
    return doctorName;
  }

  public void setDoctorName(String doctorName) {
    this.doctorName = doctorName;
  }

  public BigDecimal getUnitPrice() {
    return unitPrice;
  }

  public void setUnitPrice(BigDecimal unitPrice) {
    this.unitPrice = unitPrice;
  }

  public BigDecimal getLineTotal() {
    return lineTotal;
  }

  public void setLineTotal(BigDecimal lineTotal) {
    this.lineTotal = lineTotal;
  }

  public Instant getPrescribedAt() {
    return prescribedAt;
  }

  public void setPrescribedAt(Instant prescribedAt) {
    this.prescribedAt = prescribedAt;
  }
}
