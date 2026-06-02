package com.hospital.controller;

import com.hospital.dto.PatientDashboardDto;
import com.hospital.service.PortalService;
import com.hospital.util.Require;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/patient")
public class PatientPortalController {

  private final PortalService portalService;

  public PatientPortalController(PortalService portalService) {
    this.portalService = portalService;
  }

  @GetMapping("/dashboard")
  public PatientDashboardDto dashboard(Authentication authentication) {
    return portalService.patientDashboard(Require.authUserId(authentication));
  }
}
