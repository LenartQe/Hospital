package com.hospital.dto;

import java.util.List;

public record DoctorPatientDTO(
    Long id,
    String fullName,
    String email,
    String phone,
    List<DoctorAppointmentDTO> appointments) {}
