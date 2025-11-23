package com.nvt.eurosupply.vehicle.controllers;

import com.nvt.eurosupply.shared.dtos.FileResponseDto;
import com.nvt.eurosupply.shared.models.PagedResponse;
import com.nvt.eurosupply.vehicle.dtos.CreateVehicleRequestDto;
import com.nvt.eurosupply.vehicle.dtos.VehicleResponseDto;
import com.nvt.eurosupply.vehicle.dtos.VehicleSearchRequestDto;
import com.nvt.eurosupply.vehicle.services.VehicleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/vehicles")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleService service;


    @PostMapping
    public ResponseEntity<VehicleResponseDto> createVehicle(@Valid @RequestBody CreateVehicleRequestDto request) {
        return new ResponseEntity<>(service.createVehicle(request), HttpStatus.CREATED);
    }

    @PostMapping("/{id}/images")
    public ResponseEntity<List<FileResponseDto>> uploadImage(
            @PathVariable Long id,
            @Valid @RequestBody List<MultipartFile> images
    ) {
        return ResponseEntity.ok(service.uploadImages(id, images));
    }

    @PutMapping ("/{id}")
    public ResponseEntity<VehicleResponseDto> updateVehicle(@PathVariable Long id) {
        return null;
    }

    @GetMapping("/{id}")
    public ResponseEntity<VehicleResponseDto> getVehicle(@PathVariable Long id) {
        return ResponseEntity.ok(service.getVehicle(id));
    }

    @GetMapping("/search")
    public ResponseEntity<PagedResponse<VehicleResponseDto>> searchVehicles(
        @ModelAttribute VehicleSearchRequestDto request,
        Pageable pageable
    ) {
        return null;
    }

    @GetMapping
    public ResponseEntity<PagedResponse<VehicleResponseDto>> getVehicles(Pageable pageable) {
        return ResponseEntity.ok(service.getVehicles(pageable));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVehicle(@PathVariable Long id) {
        service.deleteVehicle(id);
        return ResponseEntity.noContent().build();
    }

}
