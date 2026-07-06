package com.hospital.controller;

import com.hospital.dto.DoctorDashboardDTO;
import com.hospital.entity.Appointment;
import com.hospital.entity.Department;
import com.hospital.entity.Doctor;
import com.hospital.repository.DepartmentRepository;
import com.hospital.repository.DoctorRepository;
import com.hospital.service.AdminDeleteService;
import com.hospital.service.DoctorService;
import com.hospital.util.DoctorCatalog;
import com.hospital.util.Require;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

  private final DoctorRepository doctorRepository;
  private final DepartmentRepository departmentRepository;
  private final AdminDeleteService adminDeleteService;
  private final DoctorService doctorService;

  public DoctorController(
      DoctorRepository doctorRepository,
      DepartmentRepository departmentRepository,
      AdminDeleteService adminDeleteService,
      DoctorService doctorService) {
    this.doctorRepository = doctorRepository;
    this.departmentRepository = departmentRepository;
    this.adminDeleteService = adminDeleteService;
    this.doctorService = doctorService;
  }

  @GetMapping
  public List<Doctor> list(
      @RequestParam(required = false) Long departmentId,
      @RequestParam(defaultValue = "false") boolean all) {
    List<Doctor> doctors =
        all
            ? doctorRepository.findAll()
            : DoctorCatalog.featuredDoctors(doctorRepository.findByFeaturedTrueOrderByNameAsc());
    if (departmentId != null) {
      long deptId = Require.id(departmentId, "ID e departamentit");
      return doctors.stream()
          .filter(d -> d.getDepartment() != null && deptId == d.getDepartment().getId())
          .toList();
    }
    return doctors;
  }

  @GetMapping("/{id}")
  public Doctor get(@PathVariable Long id) {
    long doctorId = Require.id(id, "ID e mjekut");
    return doctorRepository
        .findById(doctorId)
        .orElseThrow(() -> new NotFoundException("Doctor not found"));
  }

  @GetMapping("/{id}/dashboard-summary")
  public DoctorDashboardDTO dashboardSummary(@PathVariable Long id) {
    return doctorService.getDashboardSummary(Require.id(id, "ID e mjekut"));
  }

  @GetMapping("/{id}/appointments")
  public List<Appointment> doctorAppointments(@PathVariable Long id) {
    return doctorService.getAppointments(Require.id(id, "ID e mjekut"));
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public Doctor create(@Valid @RequestBody DoctorRequest body) {
    Doctor d = new Doctor();
    apply(body, d);
    return doctorRepository.save(d);
  }

  @PutMapping("/{id}")
  public Doctor update(@PathVariable Long id, @Valid @RequestBody DoctorRequest body) {
    long doctorId = Require.id(id, "ID e mjekut");
    Doctor d =
        doctorRepository
            .findById(doctorId)
            .orElseThrow(() -> new NotFoundException("Doctor not found"));
    apply(body, d);
    return doctorRepository.save(d);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable Long id) {
    adminDeleteService.deleteDoctor(id);
  }

  private void apply(DoctorRequest body, Doctor d) {
    d.setFullName(Require.notBlank(body.fullName(), "Emri"));
    d.setEmail(body.email());
    d.setPhone(body.phone());
    d.setSpecialty(body.specialty());
    d.setTreatmentType(body.treatmentType());
    d.setBio(body.bio());
    d.setImageUrl(body.imageUrl());
    Long deptId = Require.notNull(body.departmentId(), "ID e departamentit");
    Department dept =
        departmentRepository
            .findById(deptId)
            .orElseThrow(() -> new NotFoundException("Department not found"));
    d.setDepartment(dept);
  }

  public record DoctorRequest(
      @NotBlank String fullName,
      String email,
      String phone,
      String specialty,
      String treatmentType,
      String bio,
      String imageUrl,
      @NotNull Long departmentId) {}
}
