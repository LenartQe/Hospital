package com.hospital.controller;

import com.hospital.entity.Medicine;
import com.hospital.repository.MedicineRepository;
import com.hospital.service.AdminDeleteService;
import com.hospital.util.Require;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/medicines")
public class MedicineController {

  private final MedicineRepository repository;
  private final AdminDeleteService adminDeleteService;

  public MedicineController(MedicineRepository repository, AdminDeleteService adminDeleteService) {
    this.repository = repository;
    this.adminDeleteService = adminDeleteService;
  }

  @GetMapping
  public List<Medicine> list() {
    return repository.findAll();
  }

  @GetMapping("/{id}")
  public Medicine get(@PathVariable Long id) {
    long medicineId = Require.id(id, "ID e barnës");
    return repository
        .findById(medicineId)
        .orElseThrow(() -> new NotFoundException("Medicine not found"));
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public Medicine create(@Valid @RequestBody MedicineRequest body) {
    Medicine m = new Medicine();
    apply(body, m);
    return repository.save(m);
  }

  @PutMapping("/{id}")
  public Medicine update(@PathVariable Long id, @Valid @RequestBody MedicineRequest body) {
    long medicineId = Require.id(id, "ID e barnës");
    Medicine m =
        repository
            .findById(medicineId)
            .orElseThrow(() -> new NotFoundException("Medicine not found"));
    apply(body, m);
    return repository.save(m);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable Long id) {
    adminDeleteService.deleteMedicine(id);
  }

  private static void apply(MedicineRequest body, Medicine m) {
    m.setName(Require.notBlank(body.name(), "Emri"));
    m.setDescription(body.description());
    m.setStockQuantity(Require.notNull(body.stockQuantity(), "Sasia"));
    m.setUnit(body.unit());
    m.setManufacturer(body.manufacturer());
    m.setPrice(body.price());
    m.setExpiryBatchNote(body.expiryBatchNote());
  }

  public record MedicineRequest(
      @NotBlank String name,
      String description,
      @NotNull Integer stockQuantity,
      String unit,
      String manufacturer,
      BigDecimal price,
      String expiryBatchNote) {}
}
