package com.hospital.util;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.server.ResponseStatusException;

/** Null-safe guards for API parameters (satisfies IDE null analysis). */
public final class Require {

  private Require() {}

  public static long id(Long id, String fieldName) {
    if (id == null) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, fieldName + " mungon.");
    }
    return id;
  }

  public static long authUserId(Authentication authentication) {
    if (authentication == null || authentication.getPrincipal() == null) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Nuk jeni të identifikuar.");
    }
    Object principal = authentication.getPrincipal();
    if (principal instanceof Long userId) {
      return userId;
    }
    throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Sesioni është i pavlefshëm.");
  }

  public static String notBlank(String value, String fieldName) {
    if (value == null || value.isBlank()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, fieldName + " mungon.");
    }
    return value.trim();
  }

  public static <T> T notNull(T value, String fieldName) {
    if (value == null) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, fieldName + " mungon.");
    }
    return value;
  }
}
