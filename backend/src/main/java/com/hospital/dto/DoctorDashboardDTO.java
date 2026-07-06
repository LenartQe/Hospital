package com.hospital.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DoctorDashboardDTO {
  private int totalAppointments;
  private int pendingAppointments;
  private int totalDiagnosesAuthored;
  private int totalPrescriptionsWritten;
}
