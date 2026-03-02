package com.nvt.eurosupply.warehouse.controllers;

import com.nvt.eurosupply.shared.dtos.ConnectionStatusDto;
import com.nvt.eurosupply.shared.dtos.DeleteImagesRequestDto;
import com.nvt.eurosupply.shared.dtos.FileResponseDto;
import com.nvt.eurosupply.shared.models.PagedResponse;
import com.nvt.eurosupply.warehouse.dtos.*;
import com.nvt.eurosupply.warehouse.services.SectorService;
import com.nvt.eurosupply.warehouse.services.WarehouseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/warehouses")
@RequiredArgsConstructor
@Tag(name = "Warehouses", description = "Warehouse management API")
public class WarehouseController {

    private final WarehouseService service;
    private final SectorService sectorService;

    @Operation(
            summary = "Get all warehouses",
            description = "Retrieves a paginated list of all warehouses.",
            security = { @SecurityRequirement(name="bearerAuth") }
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Warehouses retrieved successfully")
    })
    @GetMapping
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_MANAGER')")
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
                """,
            security = { @SecurityRequirement(name="bearerAuth") }

    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Warehouses retrieved successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid search parameters")
    })
    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ROLE_MANAGER')")
    public ResponseEntity<PagedResponse<WarehouseResponseDto>> searchWarehouses(
            @ModelAttribute WarehouseSearchRequestDto request,
            Pageable pageable
    ) {
        return ResponseEntity.ok(service.searchWarehouses(request, pageable));
    }

    @Operation(
            summary = "Retrieve warehouse details",
            description = "Fetches detailed information for a warehouse by its ID"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Warehouse details retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Warehouse not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<WarehouseResponseDto> getWarehouse(@PathVariable Long id) {
        return ResponseEntity.ok(service.getWarehouse(id));
    }

    @Operation(
            summary = "Creates a new warehouse",
            security = { @SecurityRequirement(name="bearerAuth") }
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Warehouse created successfully"),
            @ApiResponse(responseCode = "400", description = "Validation error"),
            @ApiResponse(responseCode = "404", description = "Country or City does not exist"),
    })
    @PostMapping
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_MANAGER')")
    public ResponseEntity<WarehouseResponseDto> createWarehouse(@Valid @RequestBody CreateWarehouseRequestDto request) {
        return new ResponseEntity<>(service.createWarehouse(request), HttpStatus.CREATED);
    }

    @Operation(
            summary = "Updates a warehouse",
            description = """
                Updates the details of an existing warehouse.
                
                **Updatable fields:**
                - `name`: Warehouse name (2-50 characters)
                - `address`: Warehouse address (2-50 characters)
                - `cityId`: ID of the city where the warehouse is located
                - `countryId`: ID of the country where the warehouse is located
                - `latitude`: Geographical latitude of the warehouse
                - `longitude`: Geographical longitude of the warehouse
                """
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Warehouse successfully updated"),
            @ApiResponse(responseCode = "404", description = "Warehouse not found"),
    })
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_MANAGER')")
    public ResponseEntity<WarehouseResponseDto> updateWarehouse(@PathVariable Long id,
                                                                @Valid @RequestBody UpdateWarehouseRequestDto request) {
        return ResponseEntity.ok(service.updateWarehouse(id, request));
    }

    @Operation(
            summary = "Deletes a warehouse.",
            description = "Deletes a warehouse by its ID.",
            security = { @SecurityRequirement(name="bearerAuth") }
    )
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Warehouse successfully deleted"),
            @ApiResponse(responseCode = "404", description = "Warehouse not found"),
    })
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_MANAGER')")
    public ResponseEntity<Void> deleteWarehouse(@PathVariable Long id) {
        service.deleteWarehouse(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(
            summary = "Upload warehouse images",
            description = "Uploads one or more images for an existing warehouse.",
            security = { @SecurityRequirement(name="bearerAuth") }
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Images uploaded successfully"),
            @ApiResponse(responseCode = "404", description = "Warehouse not found"),
            @ApiResponse(responseCode = "400", description = "Invalid image data")
    })
    @PostMapping("/{id}/images")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_MANAGER')")
    public ResponseEntity<List<FileResponseDto>> uploadImage(
            @PathVariable Long id,
            @Valid @RequestBody List<MultipartFile> images
    ) {
        return ResponseEntity.ok(service.uploadImages(id, images));
    }

    @Operation(
            summary = "Retrieve warehouse sectors with temperature",
            description = """
                Retrieves a paginated list of sectors for a given warehouse, including their latest temperature readings.
                
                **Parameters:**
                - `warehouseId`: ID of the warehouse
                - `page`: Page number for pagination (default: 0)
                - `size`: Number of sectors per page (default: 10)
                
                **Response:**  
                Returns a page of warehouse sectors, each containing:
                - `id`: Sector ID
                - `name`: Sector name
                - `temperature`: Latest recorded temperature for the sector (nullable if no data available)
                """
    )
    @GetMapping("/{warehouseId}/sectors")
    public Page<WarehouseSectorResponse> getSectors(@PathVariable Long warehouseId, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return service.getSectors(warehouseId, page, size);
    }

    @Operation(
            summary = "Get warehouse connection status",
            description = "Retrieves a warehouse connection status by its ID.",
            security = { @SecurityRequirement(name="bearerAuth") }
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Warehouse connection status retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Warehouse not found")
    })

    @GetMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_MANAGER')")
    public ResponseEntity<ConnectionStatusDto> getWarehouseStatus(@PathVariable Long id) {
        return ResponseEntity.ok(service.getStatus(id));
    }

    @Operation(
            summary = "Delete warehouse images",
            description = "Deletes one or more images associated with a warehouse.",
            security = { @SecurityRequirement(name="bearerAuth") }
    )
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Images deleted successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Warehouse or images not found"),
            @ApiResponse(responseCode = "400", description = "Invalid image IDs or request body")
    })
    @DeleteMapping("/{id}/images")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_MANAGER')")
    public ResponseEntity<Void> deleteImages(
            @PathVariable Long id,
            @Valid @RequestBody DeleteImagesRequestDto request) {

        service.deleteImages(id, request.getImageIds());
        return ResponseEntity.noContent().build();
    }

    @Operation(
            summary = "Updates sectors",
            description = "Updates names of existing sectors, adds new sectors, and removes sectors as needed",
            security = { @SecurityRequirement(name="bearerAuth") }
    )
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Sectors updated successfully (existing names updated, new sectors added, deleted sectors removed)"),
            @ApiResponse(responseCode = "404", description = "Warehouse not found"),
    })
    @PatchMapping("/{id}/sectors")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_MANAGER')")
    public ResponseEntity<Void> updateSectors(@PathVariable Long id, @RequestBody @Valid UpdateSectorsRequestDto sectors) {
        sectorService.updateSectors(id, sectors);
        return ResponseEntity.noContent().build();
    }
}