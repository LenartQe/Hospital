package com.hospital.service;

import com.hospital.controller.NotFoundException;
import com.hospital.repository.AppointmentRepository;
import com.hospital.repository.DepartmentRepository;
import com.hospital.repository.DiagnosisRepository;
import com.hospital.repository.DoctorRepository;
import com.hospital.repository.MedicineRepository;
import com.hospital.repository.PrescriptionRepository;
import com.hospital.util.Require;
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
    long departmentId = Require.id(id, "ID e departamentit");
    if (!departmentRepository.existsById(departmentId)) {
      throw new NotFoundException("Departamenti nuk u gjet.");
    }
    doctorRepository.clearDepartmentLink(departmentId);
    departmentRepository.deleteById(departmentId);
  }

  @Transactional
  public void deleteDoctor(Long id) {
    long doctorId = Require.id(id, "ID e mjekut");
    if (!doctorRepository.existsById(doctorId)) {
      throw new NotFoundException("Mjeku nuk u gjet.");
    }
    prescriptionRepository.deleteByDoctorId(doctorId);
    diagnosisRepository.deleteByDoctorId(doctorId);
    appointmentRepository.deleteByDoctorId(doctorId);
    doctorRepository.deleteById(doctorId);
  }

  @Transactional
  public void deleteMedicine(Long id) {
    long medicineId = Require.id(id, "ID e barnës");
    if (!medicineRepository.existsById(medicineId)) {
      throw new NotFoundException("Barna nuk u gjet.");
    }
    prescriptionRepository.deleteByMedicineId(medicineId);
    medicineRepository.deleteById(medicineId);
  }
}
