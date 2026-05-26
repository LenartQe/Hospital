package com.hospital.controller;

import com.hospital.entity.Department;
import com.hospital.repository.DepartmentRepository;
import com.hospital.service.AdminDeleteService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

  private final DepartmentRepository repository;
  private final AdminDeleteService adminDeleteService;

  public DepartmentController(DepartmentRepository repository, AdminDeleteService adminDeleteService) {
    this.repository = repository;
    this.adminDeleteService = adminDeleteService;
  }

  @GetMapping
  public List<Department> list() {
    return repository.findAll();
  }

  @GetMapping("/{id}")
  public Department get(@PathVariable Long id) {
    return repository.findById(id).orElseThrow(() -> new NotFoundException("Department not found"));
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public Department create(@Valid @RequestBody DepartmentRequest body) {
    Department d = new Department();
    apply(body, d);
    return repository.save(d);
  }

  @PutMapping("/{id}")
  public Department update(@PathVariable Long id, @Valid @RequestBody DepartmentRequest body) {
    Department d =
        repository.findById(id).orElseThrow(() -> new NotFoundException("Department not found"));
    apply(body, d);
    return repository.save(d);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable Long id) {
    adminDeleteService.deleteDepartment(id);
  }

  private static void apply(DepartmentRequest body, Department d) {
    d.setName(body.name());
    d.setDescription(body.description());
    d.setLocation(body.location());
    d.setHeadDoctorName(body.headDoctorName());
  }

  public record DepartmentRequest(
      @NotBlank String name,
      String description,
      String location,
      String headDoctorName) {}
}
