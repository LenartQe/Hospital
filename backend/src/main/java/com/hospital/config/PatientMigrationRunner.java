package com.hospital.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import java.util.Objects;

/**
 * Migrates legacy patient_profile references to the new patients table so diagnosis and
 * prescription foreign keys remain valid after the schema change.
 */
@Component
@Order(1)
public class PatientMigrationRunner implements CommandLineRunner {

  private static final Logger log = LoggerFactory.getLogger(PatientMigrationRunner.class);

  private final JdbcTemplate jdbcTemplate;

  public PatientMigrationRunner(JdbcTemplate jdbcTemplate) {
    this.jdbcTemplate = jdbcTemplate;
  }

  @Override
  public void run(String... args) {
    if (!tableExists("patients")) {
      return;
    }

    try {
      seedPatientsFromProfiles();
      linkProfilesToPatients();
      dropForeignKeyIfPresent("diagnoses", "patient_id");
      dropForeignKeyIfPresent("prescriptions", "patient_id");
      remapPatientForeignKeys("diagnoses");
      remapPatientForeignKeys("prescriptions");
      log.info("Patient migration completed.");
    } catch (Exception e) {
      log.warn("Patient migration skipped or partially applied: {}", e.getMessage());
    }
  }

  private void seedPatientsFromProfiles() {
    jdbcTemplate.update(
        """
        INSERT INTO patients (username, email, phone_number, blood_type, allergies, status, user_id)
        SELECT
          LOWER(SUBSTRING_INDEX(u.email, '@', 1)),
          u.email,
          u.phone,
          pp.blood_type,
          pp.allergies,
          'ACTIVE',
          u.id
        FROM patient_profiles pp
        JOIN app_users u ON pp.user_id = u.id
        WHERE NOT EXISTS (
          SELECT 1 FROM patients p WHERE p.user_id = u.id
        )
        """);
  }

  private void linkProfilesToPatients() {
    jdbcTemplate.update(
        """
        UPDATE patient_profiles pp
        JOIN patients p ON pp.user_id = p.user_id
        SET pp.patient_record_id = p.id
        WHERE pp.patient_record_id IS NULL
        """);
  }

  private void remapPatientForeignKeys(String table) {
    if (!tableExists(table) || !columnExists(table, "patient_id")) {
      return;
    }
    jdbcTemplate.update(
      Objects.requireNonNull(
          """
          UPDATE %s t
          JOIN patient_profiles pp ON t.patient_id = pp.id
          SET t.patient_id = pp.patient_record_id
          WHERE pp.patient_record_id IS NOT NULL
            AND t.patient_id = pp.id
          """.formatted(table)
      )
  );
  }

  private void dropForeignKeyIfPresent(String table, String column) {
    if (!tableExists(table)) {
      return;
    }
    String constraint =
        jdbcTemplate.query(
            """
            SELECT CONSTRAINT_NAME
            FROM information_schema.KEY_COLUMN_USAGE
            WHERE TABLE_SCHEMA = DATABASE()
              AND TABLE_NAME = ?
              AND COLUMN_NAME = ?
              AND REFERENCED_TABLE_NAME IS NOT NULL
            LIMIT 1
            """,
            rs -> rs.next() ? rs.getString(1) : null,
            table,
            column);
    if (constraint != null && !constraint.isBlank()) {
      jdbcTemplate.execute("ALTER TABLE " + table + " DROP FOREIGN KEY " + constraint);
    }
  }

  private boolean tableExists(String table) {
    Integer count =
        jdbcTemplate.queryForObject(
            """
            SELECT COUNT(*)
            FROM information_schema.TABLES
            WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?
            """,
            Integer.class,
            table);
    return count != null && count > 0;
  }

  private boolean columnExists(String table, String column) {
    Integer count =
        jdbcTemplate.queryForObject(
            """
            SELECT COUNT(*)
            FROM information_schema.COLUMNS
            WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?
            """,
            Integer.class,
            table,
            column);
    return count != null && count > 0;
  }
}
