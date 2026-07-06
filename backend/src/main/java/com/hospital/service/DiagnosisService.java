package com.hospital.service;

import com.hospital.dto.DiagnosisRequest;
import com.hospital.entity.Diagnosis;
import com.hospital.entity.Doctor;
import com.hospital.entity.Patient;
import com.hospital.repository.DiagnosisRepository;
import com.hospital.repository.DoctorRepository;
import com.hospital.repository.PatientRepository;
import com.hospital.util.Require;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DiagnosisService {

  private final DiagnosisRepository diagnosisRepository;
  private final PatientRepository patientRepository;
  private final DoctorRepository doctorRepository;

  public DiagnosisService(
      DiagnosisRepository diagnosisRepository,
      PatientRepository patientRepository,
      DoctorRepository doctorRepository) {
    this.diagnosisRepository = diagnosisRepository;
    this.patientRepository = patientRepository;
    this.doctorRepository = doctorRepository;
  }

  @Transactional
  public Diagnosis addDiagnosis(DiagnosisRequest request) {
    Require.nonNull(request.getPatientId(), "patientId is required");
    Require.nonNull(request.getDoctorId(), "doctorId is required");
    Require.nonBlank(request.getDiagnosisName(), "diagnosisName is required");

    Patient patient =
        Require.found(patientRepository.findById(request.getPatientId()), "Patient not found");
    Doctor doctor =
        Require.found(doctorRepository.findById(request.getDoctorId()), "Doctor not found");

    Diagnosis diagnosis = new Diagnosis();
    diagnosis.setDiagnosisName(request.getDiagnosisName().trim());
    diagnosis.setDescription(request.getDescription());
    diagnosis.setPrescribedMedication(request.getPrescribedMedication());
    diagnosis.setCreatedAt(LocalDateTime.now());
    diagnosis.setPatient(patient);
    diagnosis.setDoctor(doctor);

    return diagnosisRepository.save(diagnosis);
  }

  public List<Diagnosis> getByPatientId(Long patientId) {
    Require.found(patientRepository.findById(patientId), "Patient not found");
    return diagnosisRepository.findByPatientIdOrderByCreatedAtDesc(patientId);
  }
}
