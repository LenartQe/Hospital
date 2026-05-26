package com.hospital.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "doctors")
public class Doctor {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, length = 200)
  private String fullName;

  @Column(length = 255)
  private String email;

  @Column(length = 50)
  private String phone;

  @Column(length = 200)
  private String specialty;

  @Column(length = 4000)
  private String bio;

  @Column(name = "image_url", length = 500)
  private String imageUrl;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "department_id", nullable = true)
  @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
  private Department department;

  @Column(name = "user_id", unique = true)
  private Long userId;

  @Column(name = "created_at")
  private Instant createdAt = Instant.now();

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getFullName() {
    return fullName;
  }

  public void setFullName(String fullName) {
    this.fullName = fullName;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPhone() {
    return phone;
  }

  public void setPhone(String phone) {
    this.phone = phone;
  }

  public String getSpecialty() {
    return specialty;
  }

  public void setSpecialty(String specialty) {
    this.specialty = specialty;
  }

  public String getBio() {
    return bio;
  }

  public void setBio(String bio) {
    this.bio = bio;
  }

  public String getImageUrl() {
    return imageUrl;
  }

  public void setImageUrl(String imageUrl) {
    this.imageUrl = imageUrl;
  }

  public Department getDepartment() {
    return department;
  }

  public void setDepartment(Department department) {
    this.department = department;
  }

  public Long getUserId() {
    return userId;
  }

  public void setUserId(Long userId) {
    this.userId = userId;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(Instant createdAt) {
    this.createdAt = createdAt;
  }
}
