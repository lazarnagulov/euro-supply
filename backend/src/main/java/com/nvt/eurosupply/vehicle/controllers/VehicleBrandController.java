package com.nvt.eurosupply.vehicle.controllers;

import com.nvt.eurosupply.vehicle.dtos.VehicleBrandDto;
import com.nvt.eurosupply.vehicle.dtos.VehicleModelDto;
import com.nvt.eurosupply.vehicle.services.VehicleBrandService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/vehicles/brands")
@RequiredArgsConstructor
@Tag(name = "Vehicle Brands", description = "Vehicle brand management API")
public class VehicleBrandController {

    private final VehicleBrandService service;

    @GetMapping
    public ResponseEntity<List<VehicleBrandDto>> getBrands() {
        return ResponseEntity.ok(service.getBrands());
    }

    @GetMapping("/{id}/models")
    public ResponseEntity<List<VehicleModelDto>> getVehicleBrandModels(@PathVariable Long id) {
        return ResponseEntity.ok(service.getBrandModels(id));
    }


}
