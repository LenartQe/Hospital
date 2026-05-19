package com.hospital.controller;

import com.hospital.entity.Department;
import com.hospital.entity.Doctor;
import com.hospital.repository.DepartmentRepository;
import com.hospital.repository.DoctorRepository;
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

  public DoctorController(DoctorRepository doctorRepository, DepartmentRepository departmentRepository) {
    this.doctorRepository = doctorRepository;
    this.departmentRepository = departmentRepository;
  }

  @GetMapping
  public List<Doctor> list(@RequestParam(required = false) Long departmentId) {
    if (departmentId != null) {
      return doctorRepository.findByDepartmentId(departmentId);
    }
    return doctorRepository.findAll();
  }

  @GetMapping("/{id}")
  public Doctor get(@PathVariable Long id) {
    return doctorRepository.findById(id).orElseThrow(() -> new NotFoundException("Doctor not found"));
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
    Doctor d =
        doctorRepository.findById(id).orElseThrow(() -> new NotFoundException("Doctor not found"));
    apply(body, d);
    return doctorRepository.save(d);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable Long id) {
    doctorRepository.deleteById(id);
  }

  private void apply(DoctorRequest body, Doctor d) {
    d.setFullName(body.fullName());
    d.setEmail(body.email());
    d.setPhone(body.phone());
    d.setSpecialty(body.specialty());
    d.setBio(body.bio());
    d.setImageUrl(body.imageUrl());
    Department dept =
        departmentRepository
            .findById(body.departmentId())
            .orElseThrow(() -> new NotFoundException("Department not found"));
    d.setDepartment(dept);
  }

  public record DoctorRequest(
      @NotBlank String fullName,
      String email,
      String phone,
      String specialty,
      String bio,
      String imageUrl,
      @NotNull Long departmentId) {}
}
