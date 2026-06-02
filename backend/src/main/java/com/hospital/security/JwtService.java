package com.hospital.security;

import com.hospital.entity.AppUser;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

  private final SecretKey key;
  private final long expirationMs;

  public JwtService(
      @Value("${app.jwt.secret}") String secret,
      @Value("${app.jwt.expiration-ms}") long expirationMs) {
    this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    this.expirationMs = expirationMs;
  }

  public String generateToken(AppUser user) {
    Date now = new Date();
    return Jwts.builder()
        .subject(String.valueOf(user.getId()))
        .claim("email", user.getEmail())
        .claim("role", user.getRole().name())
        .claim("name", user.getFullName())
        .issuedAt(now)
        .expiration(new Date(now.getTime() + expirationMs))
        .signWith(key)
        .compact();
  }

  public Claims parseClaims(String token) {
    return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
  }

  public boolean isValid(String token) {
    if (token == null || token.isBlank()) {
      return false;
    }
    try {
      Claims claims = parseClaims(token);
      Date exp = claims.getExpiration();
      return exp != null && exp.after(new Date());
    } catch (Exception e) {
      return false;
    }
  }

  @Nullable
  public Long getUserId(String token) {
    try {
      String subject = parseClaims(token).getSubject();
      if (subject == null || subject.isBlank()) {
        return null;
      }
      return Long.parseLong(subject);
    } catch (Exception e) {
      return null;
    }
  }

  @Nullable
  public String getRole(String token) {
    try {
      return parseClaims(token).get("role", String.class);
    } catch (Exception e) {
      return null;
    }
  }
}
