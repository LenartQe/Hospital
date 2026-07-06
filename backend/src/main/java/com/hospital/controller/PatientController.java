package com.hospital.controller;

import com.hospital.dto.PatientAdminDTO;
import com.hospital.dto.PatientUpdateRequest;
import com.hospital.entity.Patient;
import com.hospital.service.PatientService;
import com.hospital.util.Require;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

  private final PatientService patientService;

  public PatientController(PatientService patientService) {
    this.patientService = patientService;
  }

  @GetMapping
  public List<PatientAdminDTO> listAll() {
    return patientService.listAllForAdmin();
  }

  @GetMapping("/{id}")
  public Patient getById(@PathVariable Long id) {
    return patientService.getById(Require.id(id, "ID e pacientit"));
  }

  @PutMapping("/{id}")
  public Patient update(@PathVariable Long id, @RequestBody PatientUpdateRequest request) {
    return patientService.update(Require.id(id, "ID e pacientit"), request);
  }
}
