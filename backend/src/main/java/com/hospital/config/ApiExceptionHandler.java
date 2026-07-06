package com.hospital.config;

import com.hospital.controller.NotFoundException;
import jakarta.servlet.ServletException;
import java.util.Map;
import org.hibernate.LazyInitializationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class ApiExceptionHandler {

  private static final Logger log = LoggerFactory.getLogger(ApiExceptionHandler.class);

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
    log.warn("Data integrity violation: {}", ex.getMostSpecificCause().getMessage());
    return ResponseEntity.status(HttpStatus.CONFLICT)
        .body(
            Map.of(
                "message",
                "Nuk mund të fshihet: ka të dhëna të lidhura në sistem. Provoni përsëri pas rifillimit të serverit."));
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<Map<String, String>> handleValidation(MethodArgumentNotValidException ex) {
    String msg =
        ex.getBindingResult().getFieldErrors().stream()
            .findFirst()
            .map(f -> f.getField() + ": " + f.getDefaultMessage())
            .orElse("Të dhënat nuk janë valide.");
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", msg));
  }

  @ExceptionHandler(HttpMessageNotReadableException.class)
  public ResponseEntity<Map<String, String>> handleBadJson(HttpMessageNotReadableException ex) {
    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
        .body(Map.of("message", "Formati i të dhënave nuk është valid."));
  }

  @ExceptionHandler(ServletException.class)
  public ResponseEntity<Map<String, String>> handleServlet(ServletException ex) {
    Throwable root = unwrap(ex);
    log.error("Servlet error: {}", root.getMessage(), ex);
    String detail = root.getMessage() != null ? root.getMessage() : "Problem gjatë përpunimit të kërkesës.";
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
        .body(Map.of("message", "Gabim në server: " + detail));
  }

  @ExceptionHandler(LazyInitializationException.class)
  public ResponseEntity<Map<String, String>> handleLazy(LazyInitializationException ex) {
    log.error("Lazy init error: {}", ex.getMessage(), ex);
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
        .body(Map.of("message", "Gabim në server: të dhënat nuk u ngarkuan plotësisht. Rinisni backend-in."));
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<Map<String, String>> handleGeneric(Exception ex) {
    Throwable root = unwrap(ex);
    log.error("Unhandled API error: {}", root.getMessage(), ex);
    if (root instanceof DataIntegrityViolationException) {
      return handleIntegrity((DataIntegrityViolationException) root);
    }
    if (root instanceof LazyInitializationException) {
      return handleLazy((LazyInitializationException) root);
    }
    String detail = root.getMessage() != null ? root.getMessage() : ex.getClass().getSimpleName();
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
        .body(Map.of("message", "Gabim në server: " + detail));
  }

  private static Throwable unwrap(Throwable ex) {
    Throwable root = ex;
    while (root.getCause() != null && root.getCause() != root) {
      root = root.getCause();
    }
    return root;
  }
}
