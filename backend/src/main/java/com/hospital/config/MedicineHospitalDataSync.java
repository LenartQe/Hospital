package com.hospital.config;

import com.hospital.entity.Medicine;
import com.hospital.repository.MedicineRepository;
import java.math.BigDecimal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

/** Seeds medicines grouped by medical specialty for doctor prescriptions. */
@Component
@Order(4)
public class MedicineHospitalDataSync implements CommandLineRunner {

  private static final Logger log = LoggerFactory.getLogger(MedicineHospitalDataSync.class);

  private final MedicineRepository medicineRepository;

  public MedicineHospitalDataSync(MedicineRepository medicineRepository) {
    this.medicineRepository = medicineRepository;
  }

  @Override
  public void run(String... args) {
    syncMedicine("GENERAL", "Paracetamol 500mg", "Analgjetik dhe antipiretik.", "tableta", 5000);
    syncMedicine("GENERAL", "Ibuprofen 400mg", "Anti-inflamator jo-streoidal.", "tableta", 3200);
    syncMedicine("GENERAL", "Amoxicillin 500mg", "Antibiotik me spektër të gjerë.", "kapsula", 1800);
    syncMedicine("GENERAL", "Omeprazol 20mg", "Për ulçerë dhe refluks.", "kapsula", 2400);
    syncMedicine("GENERAL", "Vitaminë D3 1000 IU", "Suplement për kocka dhe imunitet.", "tableta", 1500);

    syncMedicine("CARDIOLOGY", "Aspirin 100mg", "Antiagregues për profilaksi kardiake.", "tableta", 4000);
    syncMedicine("CARDIOLOGY", "Atorvastatin 20mg", "Statina për kolesterolin.", "tableta", 2200);
    syncMedicine("CARDIOLOGY", "Metoprolol 50mg", "Beta-bllokues për presion dhe aritmi.", "tableta", 1900);
    syncMedicine("CARDIOLOGY", "Lisinopril 10mg", "ACE inhibitor për hipertension.", "tableta", 2100);
    syncMedicine("CARDIOLOGY", "Clopidogrel 75mg", "Antiagregues pas stentit.", "tableta", 1600);

    syncMedicine("PEDIATRICS", "Paracetamol Shurup 120mg/5ml", "Antipiretik për fëmijë.", "shishe", 900);
    syncMedicine("PEDIATRICS", "Ibuprofen Shurup 100mg/5ml", "Anti-inflamator për fëmijë.", "shishe", 850);
    syncMedicine("PEDIATRICS", "Amoxicillin Shurup 250mg/5ml", "Antibiotik pediatrik.", "shishe", 700);
    syncMedicine("PEDIATRICS", "Salbutamol Inhaler", "Bronkodilatator për astmë te fëmijët.", "inhalator", 400);
    syncMedicine("PEDIATRICS", "Vitamin Drops A+D", "Suplement për foshnjat.", "shishe", 600);

    log.debug("Medicine specialty sync completed.");
  }

  private void syncMedicine(
      String specialtyKey, String name, String description, String unit, int stock) {
    Medicine medicine =
        medicineRepository.findAll().stream()
            .filter(m -> name.equalsIgnoreCase(m.getName()))
            .findFirst()
            .orElseGet(Medicine::new);
    medicine.setName(name);
    medicine.setDescription(description);
    medicine.setSpecialtyKey(specialtyKey);
    medicine.setUnit(unit);
    medicine.setStockQuantity(stock);
    if (medicine.getManufacturer() == null) {
      medicine.setManufacturer("Spitali i Prizrenit");
    }
    if (medicine.getPrice() == null) {
      medicine.setPrice(new BigDecimal("1.00"));
    }
    medicineRepository.save(medicine);
  }
}
