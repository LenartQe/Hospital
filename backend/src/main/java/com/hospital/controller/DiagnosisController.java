package com.hospital.controller;

import com.hospital.dto.DiagnosisRequest;
import com.hospital.entity.Diagnosis;
import com.hospital.service.DiagnosisService;
import com.hospital.util.Require;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/diagnoses")
public class DiagnosisController {

  private final DiagnosisService diagnosisService;

  public DiagnosisController(DiagnosisService diagnosisService) {
    this.diagnosisService = diagnosisService;
  }

  @PostMapping("/add")
  @ResponseStatus(HttpStatus.CREATED)
  public Map<String, Object> addDiagnosis(@RequestBody DiagnosisRequest request) {
    Diagnosis saved = diagnosisService.addDiagnosis(request);
    return Map.of(
        "message", "Diagnosis saved successfully",
        "diagnosis", saved);
  }

  @GetMapping("/patient/{patientId}")
  public List<Diagnosis> getByPatient(@PathVariable Long patientId) {
    return diagnosisService.getByPatientId(Require.id(patientId, "ID e pacientit"));
  }
}
