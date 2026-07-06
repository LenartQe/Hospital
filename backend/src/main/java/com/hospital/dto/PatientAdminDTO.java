package com.hospital.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatientAdminDTO {
  private Long id;
  private String username;
  private String email;
  private String phoneNumber;
  private String bloodType;
  private String allergies;
  private String status;
  private boolean active;
}
