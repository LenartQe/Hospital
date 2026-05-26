package com.hospital.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/** Ensures nullable FK columns so admin delete can unlink related rows. */
@Component
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
