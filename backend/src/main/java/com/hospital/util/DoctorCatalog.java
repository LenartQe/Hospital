package com.hospital.util;

import com.hospital.entity.Doctor;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public final class DoctorCatalog {

  private DoctorCatalog() {}

  public static List<Doctor> featuredDoctors(List<Doctor> doctors) {
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
    if (isPreferredDoctorName(candidate.getFullName()) && !isPreferredDoctorName(current.getFullName())) {
      return candidate;
    }
    if (!isPreferredDoctorName(candidate.getFullName()) && isPreferredDoctorName(current.getFullName())) {
      return current;
    }
    return candidate.getId() != null && current.getId() != null && candidate.getId() > current.getId()
        ? candidate
        : current;
  }

  public static boolean isPreferredDoctorName(String name) {
    if (name == null) {
      return false;
    }
    String normalized = name.trim();
    return !normalized.regionMatches(true, 0, "Dr.", 0, 3)
        && !normalized.regionMatches(true, 0, "Dr", 0, 2);
  }
}
