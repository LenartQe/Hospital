package com.hospital.controller;

import com.hospital.entity.Appointment;
import com.hospital.entity.Doctor;
import com.hospital.repository.AppointmentRepository;
import com.hospital.repository.DoctorRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

  private final AppointmentRepository appointmentRepository;
  private final DoctorRepository doctorRepository;

  public AppointmentController(
      AppointmentRepository appointmentRepository, DoctorRepository doctorRepository) {
    this.appointmentRepository = appointmentRepository;
    this.doctorRepository = doctorRepository;
  }

  @GetMapping
  public List<Appointment> list() {
    return appointmentRepository.findAll();
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public Appointment create(@Valid @RequestBody AppointmentRequest body) {
    Doctor doctor =
        doctorRepository
            .findById(body.doctorId())
            .orElseThrow(() -> new NotFoundException("Doctor not found"));
    Appointment a = new Appointment();
    a.setPatientName(body.patientName());
    a.setEmail(body.email());
    a.setPhone(body.phone());
    a.setPreferredDate(body.preferredDate());
    a.setMessage(body.message());
    a.setDoctor(doctor);
    a.setStatus("PENDING");
    return appointmentRepository.save(a);
  }

  @PatchMapping("/{id}/status")
  public Appointment updateStatus(@PathVariable Long id, @RequestBody StatusRequest body) {
    Appointment a =
        appointmentRepository
            .findById(id)
            .orElseThrow(() -> new NotFoundException("Appointment not found"));
    a.setStatus(body.status());
    return appointmentRepository.save(a);
  }

  public record AppointmentRequest(
      @NotBlank String patientName,
      String email,
      String phone,
      LocalDate preferredDate,
      String message,
      @NotNull Long doctorId) {}

  public record StatusRequest(String status) {}
}
