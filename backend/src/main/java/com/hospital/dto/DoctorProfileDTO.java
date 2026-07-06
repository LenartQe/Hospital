package com.hospital.dto;

public class DoctorProfileDTO {
  private Long id;
  private String fullName;
  private String email;
  private String phone;
  private String specialty;
  private String bio;
  private String imageUrl;
  private String departmentName;

  public DoctorProfileDTO() {}

  public DoctorProfileDTO(
      Long id,
      String fullName,
      String email,
      String phone,
      String specialty,
      String bio,
      String imageUrl,
      String departmentName) {
    this.id = id;
    this.fullName = fullName;
    this.email = email;
    this.phone = phone;
    this.specialty = specialty;
    this.bio = bio;
    this.imageUrl = imageUrl;
    this.departmentName = departmentName;
  }

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

  public String getDepartmentName() {
    return departmentName;
  }

  public void setDepartmentName(String departmentName) {
    this.departmentName = departmentName;
  }
}
