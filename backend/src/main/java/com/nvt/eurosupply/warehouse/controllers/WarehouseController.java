package com.nvt.eurosupply.warehouse.controllers;

import com.nvt.eurosupply.warehouse.dtos.CreateWarehouseRequestDto;
import com.nvt.eurosupply.warehouse.dtos.UpdateWarehouseRequestDto;
import com.nvt.eurosupply.warehouse.dtos.WarehouseResponseDto;
import com.nvt.eurosupply.warehouse.services.WarehouseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/warehouses")
@RequiredArgsConstructor
@Tag(name = "Warehouses", description = "Warehouse management API")
public class WarehouseController {

    private final WarehouseService service;

    @Operation(
            summary = "Create a new warehouse"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Warehouse created successfully"),
            @ApiResponse(responseCode = "400", description = "Validation error"),
            @ApiResponse(responseCode = "404", description = "Country or City does not exist"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping
    public ResponseEntity<WarehouseResponseDto> createWarehouse(@Valid @RequestBody CreateWarehouseRequestDto request) {
        return new ResponseEntity<>(service.createWarehouse(request), HttpStatus.CREATED);
    }

    @Operation(
            summary = "Updates a warehouse."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Warehouse successfully updated"),
            @ApiResponse(responseCode = "404", description = "Warehouse not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PutMapping("/{id}")
    public ResponseEntity<WarehouseResponseDto> updateWarehouse(@PathVariable Long id,
                                                                @Valid @RequestBody UpdateWarehouseRequestDto request) {
        return ResponseEntity.ok(service.updateWarehouse(id, request));
    }

    @Operation(
            summary = "Deletes a warehouse.",
            description = "Deletes a warehouse by its ID."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Warehouse successfully deleted"),
            @ApiResponse(responseCode = "404", description = "Warehouse not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWarehouse(@PathVariable Long id) {
        service.deleteWarehouse(id);
        return ResponseEntity.noContent().build();
    }
}