package com.hospital.config;

import com.hospital.entity.AppUser;
import com.hospital.entity.Diagnosis;
import com.hospital.entity.Doctor;
import com.hospital.entity.Medicine;
import com.hospital.entity.PatientProfile;
import com.hospital.entity.Prescription;
import com.hospital.entity.UserRole;
import com.hospital.repository.AppUserRepository;
import com.hospital.repository.DiagnosisRepository;
import com.hospital.repository.DoctorRepository;
import com.hospital.repository.MedicineRepository;
import com.hospital.repository.PatientProfileRepository;
import com.hospital.repository.PrescriptionRepository;
import java.time.LocalDate;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@Order(2)
public class AuthDataInitializer implements CommandLineRunner {

  public static final String DEMO_PASSWORD = "hospital123";

  private final AppUserRepository appUserRepository;
  private final PatientProfileRepository patientProfileRepository;
  private final DoctorRepository doctorRepository;
  private final MedicineRepository medicineRepository;
  private final DiagnosisRepository diagnosisRepository;
  private final PrescriptionRepository prescriptionRepository;
  private final PasswordEncoder passwordEncoder;

  public AuthDataInitializer(
      AppUserRepository appUserRepository,
      PatientProfileRepository patientProfileRepository,
      DoctorRepository doctorRepository,
      MedicineRepository medicineRepository,
      DiagnosisRepository diagnosisRepository,
      PrescriptionRepository prescriptionRepository,
      PasswordEncoder passwordEncoder) {
    this.appUserRepository = appUserRepository;
    this.patientProfileRepository = patientProfileRepository;
    this.doctorRepository = doctorRepository;
    this.medicineRepository = medicineRepository;
    this.diagnosisRepository = diagnosisRepository;
    this.prescriptionRepository = prescriptionRepository;
    this.passwordEncoder = passwordEncoder;
  }

  @Override
  public void run(String... args) {
    if (appUserRepository.count() > 0) {
      return;
    }

    saveUser("admin@hospital.local", UserRole.ADMIN, "Administrator", "+383 44 000 001");

    AppUser patientUser =
        saveUser("patient@hospital.local", UserRole.PATIENT, "Arben Krasniqi", "+383 44 100 200");
    PatientProfile patient = new PatientProfile();
    patient.setUser(patientUser);
    patient.setDateOfBirth(LocalDate.of(1990, 5, 12));
    patient.setBloodType("A+");
    patient.setAllergies("Penicillin");
    patient.setNotes("Pacient demo për portalin.");
    patient = patientProfileRepository.save(patient);

    Doctor doctor =
        doctorRepository.findAll().stream().findFirst().orElse(null);
    if (doctor == null) {
      return;
    }

    AppUser doctorUser =
        saveUser(doctor.getEmail(), UserRole.DOCTOR, doctor.getFullName(), doctor.getPhone());
    doctor.setUserId(doctorUser.getId());
    doctorRepository.save(doctor);

    Medicine medicine = medicineRepository.findAll().stream().findFirst().orElse(null);
    if (medicine == null) {
      return;
    }

    Diagnosis dx = new Diagnosis();
    dx.setPatient(patient);
    dx.setDoctor(doctor);
    dx.setTitle("Hipertension i lehtë");
    dx.setDescription("Presion i lartë gjaku — monitorim dhe ndryshim stili jetese.");
    dx.setSeverity("MODERATE");
    diagnosisRepository.save(dx);

    Prescription rx = new Prescription();
    rx.setPatient(patient);
    rx.setDoctor(doctor);
    rx.setMedicine(medicine);
    rx.setDosage("500mg");
    rx.setFrequency("2 herë në ditë");
    rx.setInstructions("Pas vaktit; mos tejkaloni dozën e rekomanduar.");
    rx.setStatus("ACTIVE");
    prescriptionRepository.save(rx);
  }

  private AppUser saveUser(String email, UserRole role, String fullName, String phone) {
    AppUser user = new AppUser();
    user.setEmail(email.trim().toLowerCase());
    user.setPasswordHash(passwordEncoder.encode(DEMO_PASSWORD));
    user.setRole(role);
    user.setFullName(fullName);
    user.setPhone(phone);
    return appUserRepository.save(user);
  }
}
