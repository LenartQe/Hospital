package com.hospital.dto;

import com.hospital.entity.Appointment;
import com.hospital.entity.Diagnosis;
import com.hospital.entity.Prescription;
import java.time.LocalDate;
import java.util.List;

public record PatientDashboardDto(
    String fullName,
    String email,
    String phone,
    LocalDate dateOfBirth,
    String bloodType,
    String allergies,
    String notes,
    List<Diagnosis> diagnoses,
    List<Prescription> prescriptions,
    List<Appointment> appointments) {}
