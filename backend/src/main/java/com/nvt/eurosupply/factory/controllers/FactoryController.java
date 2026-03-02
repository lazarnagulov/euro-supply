package com.nvt.eurosupply.factory.controllers;

import com.nvt.eurosupply.factory.dtos.*;
import com.nvt.eurosupply.factory.services.FactoryService;
import com.nvt.eurosupply.product.services.ProductService;
import com.nvt.eurosupply.shared.dtos.ConnectionStatusDto;
import com.nvt.eurosupply.shared.dtos.DeleteImagesRequestDto;
import com.nvt.eurosupply.shared.dtos.FileResponseDto;
import com.nvt.eurosupply.shared.models.PagedResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
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
@RequestMapping("/api/v1/factories")
@RequiredArgsConstructor
@Tag(name = "Factories", description = "Factory management API")
@CrossOrigin
public class FactoryController {

    private final FactoryService service;
    private final ProductService productService;

    @Operation(
            summary = "Create a new factory",
            description = "Creates a new factory record without files. Files should be uploaded separately."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Factory created successfully"),
            @ApiResponse(responseCode = "400", description = "Validation error"),
            @ApiResponse(responseCode = "404", description = "Country or City does not exist")
    })
    @PostMapping
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_MANAGER')")
    public ResponseEntity<FactoryResponseDto> createFactory(@Valid @RequestBody CreateFactoryRequestDto request) {
        FactoryResponseDto response = service.createFactory(request);
        return ResponseEntity
                .created(URI.create("/api/v1/factories/" + response.getId()))
                .body(response);
    }

    @Operation(
            summary = "Upload images for a factory",
            description = "Uploads one or more images for an existing factory."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Files uploaded successfully"),
            @ApiResponse(responseCode = "404", description = "Factory not found"),
            @ApiResponse(responseCode = "400", description = "Invalid file data")
    })
    @PostMapping("/{id}/images")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_MANAGER')")
    public ResponseEntity<List<FileResponseDto>> uploadImages(@PathVariable Long id, @Valid @RequestBody List<MultipartFile> images) {
        return ResponseEntity.ok(service.uploadFiles(id, images));
    }

    @Operation(
            summary = "Update factory",
            description = "Updates an existing factory by its ID."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Factory updated successfully"),
            @ApiResponse(responseCode = "404", description = "Factory not found"),
            @ApiResponse(responseCode = "409", description = "The resource was modified by another user"),
            @ApiResponse(responseCode = "400", description = "Invalid update data")
    })
    @PutMapping ("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_MANAGER')")
    public ResponseEntity<FactoryResponseDto> updateFactory(
            @PathVariable Long id,
            @Valid @RequestBody UpdateFactoryRequestDto request
    ) {
        return ResponseEntity.ok(service.updateFactory(id, request));
    }

    @Operation(
            summary = "Get factory details",
            description = "Retrieves a factory by its ID, including its images (public urls)."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Factory retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Factory not found")
    })
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_MANAGER')")
    public ResponseEntity<FactoryResponseDto> getFactory(@PathVariable Long id) {
        return ResponseEntity.ok(service.getFactory(id));
    }

    @Operation(
            summary = "Get all factories",
            description = "Retrieves a paginated list of all factories."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Factories retrieved successfully")
    })
    @GetMapping
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_MANAGER')")
    public ResponseEntity<PagedResponse<FactoryResponseDto>> getFactories(Pageable pageable) {
        return ResponseEntity.ok(service.getFactories(pageable));
    }

    @Operation(
            summary = "Search factories",
            description = """
                Searches factories using optional filter criteria.
                
                **Available filters:**
                - `name`: Exact or partial name match
                - `cityId`: Filter by city
                - `countryId`: Filter by country
                - `address`: Exact or partial address match
                
                Results are paginated.
                """
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Factories retrieved successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid search parameters")
    })
    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_MANAGER')")
    public ResponseEntity<PagedResponse<FactoryResponseDto>> searchFactories(
            @ModelAttribute FactorySearchRequestDto request,
            Pageable pageable
    ) {
        return ResponseEntity.ok(service.searchFactories(request, pageable));
    }

    @Operation(
            summary = "Delete factory images",
            description = "Deletes one or more images associated with a factory."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Images deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Factory or images not found"),
            @ApiResponse(responseCode = "400", description = "Invalid image IDs or request body")
    })
    @DeleteMapping("/{factoryId}/images")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_MANAGER')")
    public ResponseEntity<Void> deleteImages(
            @PathVariable Long factoryId,
            @Valid @RequestBody DeleteImagesRequestDto request) {

        service.deleteImages(factoryId, request.getImageIds());
        return ResponseEntity.noContent().build();
    }

    @Operation(
            summary = "Delete factory",
            description = "Deletes a factory by its ID."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Factory deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Factory not found")
    })
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_MANAGER')")
    public ResponseEntity<Void> deleteFactory(@PathVariable Long id) {
        service.deleteFactory(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(
            summary = "Get factories producing a product",
            description = "Retrieves the list of factories where the specified product is being produced."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Factories producing the product retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Product not found")
    })
    @GetMapping("/producing-product/{productId}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_MANAGER')")
    public ResponseEntity<List<FactoryResponseDto>> getFactoriesByProductId(
            @PathVariable Long productId) {
        List<FactoryResponseDto> factories = service.getFactoriesByProductId(productId);
        return ResponseEntity.ok(factories);
    }

    @Operation(
            summary = "Get factory connection status",
            description = "Retrieves a factory connection status by its ID."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Factory connection status retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Factory not found")
    })
    @GetMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_MANAGER')")
    public ResponseEntity<ConnectionStatusDto> getFactoryStatus(@PathVariable Long id) {
        return ResponseEntity.ok(service.getFactoryStatus(id));
    }

    @Operation(
            summary = "Get products produced by a factory",
            description = "Returns a paginated list of products" +
                    " that are produced by the factory identified by the given factory ID."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "List of products successfully retrieved")
    })
    @GetMapping("/{id}/products")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_MANAGER')")
    public PagedResponse<FactoryProductListItemDto> getProductsByFactory(@PathVariable Long id, Pageable pageable) {
        return productService.getProductsByFactoryId(id, pageable);
    }
}
