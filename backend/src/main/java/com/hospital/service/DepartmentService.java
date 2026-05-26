package com.hospital.service;

import com.hospital.controller.NotFoundException;
import com.hospital.entity.Department;
import com.hospital.entity.Doctor;
import com.hospital.repository.DepartmentRepository;
import com.hospital.repository.DoctorRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DepartmentService {

  private final DepartmentRepository departmentRepository;
  private final DoctorRepository doctorRepository;

  public DepartmentService(
      DepartmentRepository departmentRepository, DoctorRepository doctorRepository) {
    this.departmentRepository = departmentRepository;
    this.doctorRepository = doctorRepository;
  }

  @Transactional
  public void deleteById(Long id) {
    Department department =
        departmentRepository
            .findById(id)
            .orElseThrow(() -> new NotFoundException("Departamenti nuk u gjet."));

    List<Doctor> linked = doctorRepository.findByDepartmentId(id);
    for (Doctor doctor : linked) {
      doctor.setDepartment(null);
      doctorRepository.save(doctor);
    }

    departmentRepository.delete(department);
  }
}
