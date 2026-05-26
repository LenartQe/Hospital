package com.hospital.config;

import com.hospital.controller.NotFoundException;
import java.util.Map;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class ApiExceptionHandler {

  @ExceptionHandler(ResponseStatusException.class)
  public ResponseEntity<Map<String, String>> handleStatus(ResponseStatusException ex) {
    return ResponseEntity.status(ex.getStatusCode())
        .body(Map.of("message", ex.getReason() != null ? ex.getReason() : ex.getStatusCode().toString()));
  }

  @ExceptionHandler(NotFoundException.class)
  public ResponseEntity<Map<String, String>> handleNotFound(NotFoundException ex) {
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", ex.getMessage()));
  }

  @ExceptionHandler(DataIntegrityViolationException.class)
  public ResponseEntity<Map<String, String>> handleIntegrity(DataIntegrityViolationException ex) {
    return ResponseEntity.status(HttpStatus.CONFLICT)
        .body(
            Map.of(
                "message",
                "Nuk mund të fshihet: ka të dhëna të lidhura në sistem. Largoni lidhjet fillimisht."));
  }
}
