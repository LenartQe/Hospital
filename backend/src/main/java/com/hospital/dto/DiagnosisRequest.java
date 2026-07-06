package com.hospital.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DiagnosisRequest {
  private Long patientId;
  private Long doctorId;
  private String diagnosisName;
  private String description;
  private String prescribedMedication;
}
