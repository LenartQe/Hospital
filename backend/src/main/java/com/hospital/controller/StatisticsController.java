package com.hospital.controller;

import com.hospital.dto.DashboardStatsDto;
import com.hospital.repository.AppointmentRepository;
import com.hospital.repository.DepartmentRepository;
import com.hospital.repository.DoctorRepository;
import com.hospital.repository.MedicineRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stats")
public class StatisticsController {

  private final DepartmentRepository departmentRepository;
  private final DoctorRepository doctorRepository;
  private final MedicineRepository medicineRepository;
  private final AppointmentRepository appointmentRepository;

  public StatisticsController(
      DepartmentRepository departmentRepository,
      DoctorRepository doctorRepository,
      MedicineRepository medicineRepository,
      AppointmentRepository appointmentRepository) {
    this.departmentRepository = departmentRepository;
    this.doctorRepository = doctorRepository;
    this.medicineRepository = medicineRepository;
    this.appointmentRepository = appointmentRepository;
  }

  @GetMapping
  public DashboardStatsDto stats() {
    long pending =
        appointmentRepository.findAll().stream()
            .filter(a -> "PENDING".equalsIgnoreCase(a.getStatus()))
            .count();
    return new DashboardStatsDto(
        departmentRepository.count(),
        doctorRepository.count(),
        medicineRepository.count(),
        pending,
        appointmentRepository.count());
  }
}
