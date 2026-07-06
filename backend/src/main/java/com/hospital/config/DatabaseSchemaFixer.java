package com.hospital.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/** Ensures nullable FK columns so admin delete can unlink related rows. */
@Component
@Order(0)
public class DatabaseSchemaFixer implements CommandLineRunner {

  private static final Logger log = LoggerFactory.getLogger(DatabaseSchemaFixer.class);

  private final JdbcTemplate jdbcTemplate;

  public DatabaseSchemaFixer(JdbcTemplate jdbcTemplate) {
    this.jdbcTemplate = jdbcTemplate;
  }

  @Override
  public void run(String... args) {
    alterNullable("doctors", "department_id");
    alterNullable("appointments", "doctor_id");
    addColumnIfMissing("doctors", "featured", "TINYINT(1) NOT NULL DEFAULT 0");
    addColumnIfMissing("medicines", "specialty_key", "VARCHAR(50) NULL");
  }

  private void addColumnIfMissing(String table, String column, String definition) {
    try {
      Integer count =
          jdbcTemplate.queryForObject(
              "SELECT COUNT(*) FROM information_schema.COLUMNS "
                  + "WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?",
              Integer.class,
              table,
              column);
      if (count != null && count == 0) {
        jdbcTemplate.execute("ALTER TABLE " + table + " ADD COLUMN " + column + " " + definition);
        log.info("Added column {}.{}", table, column);
      }
    } catch (Exception e) {
      log.warn("Could not add {}.{}: {}", table, column, e.getMessage());
    }
  }

  private void alterNullable(String table, String column) {
    try {
      jdbcTemplate.execute(
          "ALTER TABLE " + table + " MODIFY COLUMN " + column + " BIGINT NULL");
      log.debug("Schema OK: {}.{} is nullable", table, column);
    } catch (Exception e) {
      log.warn("Could not alter {}.{} (may already be nullable): {}", table, column, e.getMessage());
    }
  }
}
