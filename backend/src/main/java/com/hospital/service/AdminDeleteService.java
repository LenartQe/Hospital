package com.hospital.service;

import com.hospital.controller.NotFoundException;
import com.hospital.repository.AppointmentRepository;
import com.hospital.repository.DepartmentRepository;
import com.hospital.repository.DiagnosisRepository;
import com.hospital.repository.DoctorRepository;
import com.hospital.repository.MedicineRepository;
import com.hospital.repository.PrescriptionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminDeleteService {

  private final DepartmentRepository departmentRepository;
  private final DoctorRepository doctorRepository;
  private final MedicineRepository medicineRepository;
  private final AppointmentRepository appointmentRepository;
  private final DiagnosisRepository diagnosisRepository;
  private final PrescriptionRepository prescriptionRepository;

  public AdminDeleteService(
      DepartmentRepository departmentRepository,
      DoctorRepository doctorRepository,
      MedicineRepository medicineRepository,
      AppointmentRepository appointmentRepository,
      DiagnosisRepository diagnosisRepository,
      PrescriptionRepository prescriptionRepository) {
    this.departmentRepository = departmentRepository;
    this.doctorRepository = doctorRepository;
    this.medicineRepository = medicineRepository;
    this.appointmentRepository = appointmentRepository;
    this.diagnosisRepository = diagnosisRepository;
    this.prescriptionRepository = prescriptionRepository;
  }

  @Transactional
  public void deleteDepartment(Long id) {
    if (!departmentRepository.existsById(id)) {
      throw new NotFoundException("Departamenti nuk u gjet.");
    }
    doctorRepository.clearDepartmentLink(id);
    departmentRepository.deleteById(id);
  }

  @Transactional
  public void deleteDoctor(Long id) {
    if (!doctorRepository.existsById(id)) {
      throw new NotFoundException("Mjeku nuk u gjet.");
    }
    prescriptionRepository.deleteByDoctorId(id);
    diagnosisRepository.deleteByDoctorId(id);
    appointmentRepository.deleteByDoctorId(id);
    doctorRepository.deleteById(id);
  }

  @Transactional
  public void deleteMedicine(Long id) {
    if (!medicineRepository.existsById(id)) {
      throw new NotFoundException("Barna nuk u gjet.");
    }
    prescriptionRepository.deleteByMedicineId(id);
    medicineRepository.deleteById(id);
  }
}
