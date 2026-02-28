package com.nvt.eurosupply.warehouse.controllers;

import com.nvt.eurosupply.shared.dtos.FileResponseDto;
import com.nvt.eurosupply.shared.models.PagedResponse;
import com.nvt.eurosupply.warehouse.dtos.*;
import com.nvt.eurosupply.warehouse.services.WarehouseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/warehouses")
@RequiredArgsConstructor
@Tag(name = "Warehouses", description = "Warehouse management API")
public class WarehouseController {

    private final WarehouseService service;

    @Operation(
            summary = "Get all warehouses",
            description = "Retrieves a paginated list of all warehouses."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Warehouses retrieved successfully")
    })
    @GetMapping
    public ResponseEntity<PagedResponse<WarehouseResponseDto>> getWarehouses(Pageable pageable) {
        return ResponseEntity.ok(service.getWarehouses(pageable));
    }

    @Operation(
            summary = "Search warehouses",
            description = """
                Searches warehouses using optional filter criteria.
                
                **Available filters:**
                - `name`: Exact or partial name match
                - `address`: Exact or partial address match
                - `countryId`: Filter by warehouse country
                - `cityId`: Filter by warehouse city
                Results are paginated.
                """
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Warehouses retrieved successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid search parameters")
    })
    @GetMapping("/search")
    public ResponseEntity<PagedResponse<WarehouseResponseDto>> searchWarehouses(
            @ModelAttribute WarehouseSearchRequestDto request,
            Pageable pageable
    ) {
        return ResponseEntity.ok(service.searchWarehouses(request, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<WarehouseResponseDto> getWarehouse(@PathVariable Long id) {
        return ResponseEntity.ok(service.getWarehouse(id));
    }

    @Operation(
            summary = "Create a new warehouse"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Warehouse created successfully"),
            @ApiResponse(responseCode = "400", description = "Validation error"),
            @ApiResponse(responseCode = "404", description = "Country or City does not exist"),
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
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWarehouse(@PathVariable Long id) {
        service.deleteWarehouse(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(
            summary = "Upload warehouse images",
            description = "Uploads one or more images for an existing warehouse."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Images uploaded successfully"),
            @ApiResponse(responseCode = "404", description = "Warehouse not found"),
            @ApiResponse(responseCode = "400", description = "Invalid image data")
    })
    @PostMapping("/{id}/images")
    public ResponseEntity<List<FileResponseDto>> uploadImage(
            @PathVariable Long id,
            @Valid @RequestBody List<MultipartFile> images
    ) {
        return ResponseEntity.ok(service.uploadImages(id, images));
    }

    @GetMapping("/{warehouseId}/sectors")
    public Page<WarehouseSectorResponse> getSectors(@PathVariable Long warehouseId, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return service.getSectors(warehouseId, page, size);
    }
}