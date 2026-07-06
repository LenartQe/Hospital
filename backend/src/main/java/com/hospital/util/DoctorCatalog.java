package com.hospital.util;

import com.hospital.entity.Doctor;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public final class DoctorCatalog {

  private DoctorCatalog() {}

  /** One public/login doctor per email — keeps the original Mjekët record (lowest id). */
  public static List<Doctor> publicDoctors(List<Doctor> doctors) {
    Map<String, Doctor> byEmail = new LinkedHashMap<>();
    doctors.stream()
        .filter(d -> d.isFeatured() && d.getEmail() != null && !d.getEmail().isBlank())
        .sorted(Comparator.comparing(Doctor::getId))
        .forEach(
            d -> {
              String key = d.getEmail().trim().toLowerCase();
              byEmail.merge(key, d, DoctorCatalog::preferDoctorRecord);
            });
    return byEmail.values().stream()
        .sorted(Comparator.comparing(Doctor::getFullName, Comparator.nullsLast(String::compareToIgnoreCase)))
        .toList();
  }

  public static Doctor preferDoctorRecord(Doctor current, Doctor candidate) {
    if (current.getId() == null) {
      return candidate;
    }
    if (candidate.getId() == null) {
      return current;
    }
    return current.getId() < candidate.getId() ? current : candidate;
  }

  public static Doctor resolveByEmail(List<Doctor> doctors, String email) {
    String normalized = email.trim().toLowerCase();
    return doctors.stream()
        .filter(d -> normalized.equalsIgnoreCase(d.getEmail()))
        .reduce(DoctorCatalog::preferDoctorRecord)
        .orElse(null);
  }
}
