package com.hospital.dto;

public record DashboardStatsDto(
    long departments,
    long doctors,
    long medicines,
    long appointmentsPending,
    long appointmentsTotal) {}
