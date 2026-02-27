package com.nvt.eurosupply.vehicle.controllers;

import com.nvt.eurosupply.shared.dtos.ConnectionStatusDto;
import com.nvt.eurosupply.shared.dtos.DeleteImagesRequestDto;
import com.nvt.eurosupply.shared.dtos.FileResponseDto;
import com.nvt.eurosupply.shared.dtos.LocationResponseDto;
import com.nvt.eurosupply.shared.models.PagedResponse;
import com.nvt.eurosupply.vehicle.dtos.*;
import com.nvt.eurosupply.vehicle.services.VehicleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/v1/vehicles")
@RequiredArgsConstructor
@Tag(name = "Vehicles", description = "Vehicle management API")
@CrossOrigin
public class VehicleController {

    private final VehicleService service;

    @Operation(
            summary = "Create a new vehicle",
            description = "Registers a new vehicle in the system. Images should be uploaded separately.",
            security = { @SecurityRequirement(name="bearerAuth") }
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Vehicle created successfully"),
            @ApiResponse(responseCode = "400", description = "Validation error"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Model or Brand not found"),
    })
    @PostMapping
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_MANAGER')")
    public ResponseEntity<VehicleResponseDto> createVehicle(@Valid @RequestBody CreateVehicleRequestDto request) {
        VehicleResponseDto response = service.createVehicle(request);
        return ResponseEntity
                .created(URI.create("/api/v1/vehicles/" + response.getId()))
                .body(response);
    }

    @Operation(
            summary = "Upload vehicle images",
            description = "Uploads one or more images for an existing vehicle.",
            security = { @SecurityRequirement(name="bearerAuth") }
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Images uploaded successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Vehicle not found"),
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
            summary = "Update vehicle",
            description = "Updates an existing vehicle by its ID.",
            security = { @SecurityRequirement(name="bearerAuth") }
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Vehicle updated successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Vehicle not found"),
            @ApiResponse(responseCode = "409", description = "The resource was modified by another user"),
            @ApiResponse(responseCode = "400", description = "Invalid update data")
    })
    @PutMapping ("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_MANAGER')")
    public ResponseEntity<VehicleResponseDto> updateVehicle(
            @PathVariable Long id,
            @Valid @RequestBody UpdateVehicleRequestDto request
    ) {
        return ResponseEntity.ok(service.updateVehicle(id, request));
    }

    @Operation(
            summary = "Get vehicle details",
            description = "Retrieves a vehicle by its ID, including its images (public urls).",
            security = { @SecurityRequirement(name="bearerAuth") }
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Vehicle retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Vehicle not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<VehicleResponseDto> getVehicle(@PathVariable Long id) {
        return ResponseEntity.ok(service.getVehicle(id));
    }

    @Operation(
            summary = "Search vehicles",
            description = """
                Searches vehicles using optional filter criteria.
                
                **Available filters:**
                - `registration`: Exact or partial registration number match
                - `brandId`: Filter by vehicle brand
                - `modelId`: Filter by vehicle model
                - `minLoad`: Minimum load capacity
                - `maxLoad`: Maximum load capacity
                - `search`: General text search across registration, brand, model, and more
                
                Results are paginated.
                """,
            security = { @SecurityRequirement(name="bearerAuth") }
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Vehicles retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "400", description = "Invalid search parameters")
    })
    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_MANAGER')")
    public ResponseEntity<PagedResponse<VehicleResponseDto>> searchVehicles(
        @ModelAttribute VehicleSearchRequestDto request,
        Pageable pageable
    ) {
        return ResponseEntity.ok(service.searchVehicles(request, pageable));
    }

    @Operation(
            summary = "Get all vehicles",
            description = "Retrieves a paginated list of all vehicles.",
            security = { @SecurityRequirement(name="bearerAuth") }
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Vehicles retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
    })
    @GetMapping
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_MANAGER')")
    public ResponseEntity<PagedResponse<VehicleResponseDto>> getVehicles(Pageable pageable) {
        return ResponseEntity.ok(service.getVehicles(pageable));
    }

    @Operation(
            summary = "Get vehicle last location",
            description = "Retrieves a vehicle location by its ID.",
            security = { @SecurityRequirement(name="bearerAuth") }
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Vehicle location retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Vehicle not found")
    })
    @GetMapping("/{id}/location")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_MANAGER')")
    public ResponseEntity<LocationResponseDto> getVehicleLocation(@PathVariable Long id) {
        return ResponseEntity.ok(service.getVehicleLocation(id));
    }

    @Operation(
            summary = "Get vehicle connection status",
            description = "Retrieves a vehicle connection status by its ID.",
            security = { @SecurityRequirement(name="bearerAuth") }
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Vehicle connection status retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Vehicle not found")
    })
    @GetMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_MANAGER')")
    public ResponseEntity<ConnectionStatusDto> getVehicleStatus(@PathVariable Long id) {
        return ResponseEntity.ok(service.getVehicleStatus(id));
    }

    @Operation(
            summary = "Delete vehicle",
            description = "Deletes a vehicle by its ID.",
            security = { @SecurityRequirement(name="bearerAuth") }
    )
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Vehicle deleted successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Vehicle not found")
    })
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_MANAGER')")
    public ResponseEntity<Void> deleteVehicle(@PathVariable Long id) {
        service.deleteVehicle(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(
            summary = "Delete vehicle images",
            description = "Deletes one or more images associated with a vehicle.",
            security = { @SecurityRequirement(name="bearerAuth") }
    )
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Images deleted successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Vehicle or images not found"),
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

}
