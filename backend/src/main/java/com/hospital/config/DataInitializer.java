package com.hospital.config;

import com.hospital.entity.Department;
import com.hospital.entity.Doctor;
import com.hospital.entity.Medicine;
import com.hospital.repository.DepartmentRepository;
import com.hospital.repository.DoctorRepository;
import com.hospital.repository.MedicineRepository;
import java.math.BigDecimal;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(1)
public class DataInitializer implements CommandLineRunner {

  private final DepartmentRepository departmentRepository;
  private final DoctorRepository doctorRepository;
  private final MedicineRepository medicineRepository;

  public DataInitializer(
      DepartmentRepository departmentRepository,
      DoctorRepository doctorRepository,
      MedicineRepository medicineRepository) {
    this.departmentRepository = departmentRepository;
    this.doctorRepository = doctorRepository;
    this.medicineRepository = medicineRepository;
  }

  @Override
  public void run(String... args) {
    if (departmentRepository.count() > 0) {
      return;
    }

    Department cardiology = new Department();
    cardiology.setName("Cardiology");
    cardiology.setDescription("Heart and vascular care.");
    cardiology.setLocation("Building A, Floor 2");
    cardiology.setHeadDoctorName("Dr. Sarah Mitchell");
    cardiology = departmentRepository.save(cardiology);

    Department pediatrics = new Department();
    pediatrics.setName("Pediatrics");
    pediatrics.setDescription("Care for infants, children, and adolescents.");
    pediatrics.setLocation("Building B, Floor 1");
    pediatrics.setHeadDoctorName("Dr. James Chen");
    pediatrics = departmentRepository.save(pediatrics);

    Department neurology = new Department();
    neurology.setName("Neurology");
    neurology.setDescription("Brain, spine, and nervous system disorders.");
    neurology.setLocation("Building A, Floor 3");
    neurology.setHeadDoctorName("Dr. Elena Rossi");
    neurology = departmentRepository.save(neurology);

    Doctor d1 = new Doctor();
    d1.setFullName("Dr. Sarah Mitchell");
    d1.setEmail("s.mitchell@hospital.local");
    d1.setPhone("+1 234 567 8901");
    d1.setSpecialty("Interventional Cardiology");
    d1.setBio("Board-certified cardiologist with 15 years of experience.");
    d1.setImageUrl(null);
    d1.setDepartment(cardiology);
    doctorRepository.save(d1);

    Doctor d2 = new Doctor();
    d2.setFullName("Dr. James Chen");
    d2.setEmail("j.chen@hospital.local");
    d2.setPhone("+1 234 567 8902");
    d2.setSpecialty("Pediatric Medicine");
    d2.setBio("Focused on preventive care and chronic disease management in children.");
    d2.setImageUrl(null);
    d2.setDepartment(pediatrics);
    doctorRepository.save(d2);

    Doctor d3 = new Doctor();
    d3.setFullName("Dr. Elena Rossi");
    d3.setEmail("e.rossi@hospital.local");
    d3.setPhone("+1 234 567 8903");
    d3.setSpecialty("Clinical Neurology");
    d3.setBio("Special interest in epilepsy and movement disorders.");
    d3.setImageUrl(null);
    d3.setDepartment(neurology);
    doctorRepository.save(d3);

    Medicine m1 = new Medicine();
    m1.setName("Paracetamol 500mg");
    m1.setDescription("Analgesic and antipyretic.");
    m1.setStockQuantity(5000);
    m1.setUnit("tablets");
    m1.setManufacturer("PharmaCo");
    m1.setPrice(new BigDecimal("0.05"));
    m1.setExpiryBatchNote("Batch 2026-A");
    medicineRepository.save(m1);

    Medicine m2 = new Medicine();
    m2.setName("Saline Solution 0.9%");
    m2.setDescription("IV fluid replenishment.");
    m2.setStockQuantity(800);
    m2.setUnit("500ml bags");
    m2.setManufacturer("MedSupply");
    m2.setPrice(new BigDecimal("2.50"));
    m2.setExpiryBatchNote("Sterile room storage");
    medicineRepository.save(m2);
  }
}
