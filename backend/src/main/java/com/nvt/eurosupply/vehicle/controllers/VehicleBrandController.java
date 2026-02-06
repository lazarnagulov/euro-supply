package com.nvt.eurosupply.vehicle.controllers;

import com.nvt.eurosupply.vehicle.dtos.VehicleBrandDto;
import com.nvt.eurosupply.vehicle.dtos.VehicleModelDto;
import com.nvt.eurosupply.vehicle.services.VehicleBrandService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/vehicles/brands")
@RequiredArgsConstructor
@Tag(name = "Vehicle Brands and Models", description = "Vehicle brand and model management API")
@CrossOrigin
public class VehicleBrandController {

    private final VehicleBrandService service;

    @Operation(
            summary = "Get all brands",
            description = "Fetches a list of all brands in the system."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved list of brands"),
    })
    @GetMapping
    public ResponseEntity<List<VehicleBrandDto>> getBrands() {
        return ResponseEntity.ok(service.getBrands());
    }

    @Operation(
            summary = "Get all models of a brand",
            description = "Returns all models that belong to the given brand ID."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Models retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Brand not found"),
    })
    @GetMapping("/{id}/models")
    public ResponseEntity<List<VehicleModelDto>> getVehicleBrandModels(@PathVariable Long id) {
        return ResponseEntity.ok(service.getBrandModels(id));
    }

}
