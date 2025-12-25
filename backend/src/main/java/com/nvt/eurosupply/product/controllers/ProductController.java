package com.nvt.eurosupply.product.controllers;

import com.nvt.eurosupply.product.dtos.CreateProductRequestDto;
import com.nvt.eurosupply.product.dtos.ProductResponseDto;
import com.nvt.eurosupply.product.dtos.UpdateProductRequestDto;
import com.nvt.eurosupply.product.services.ProductService;
import com.nvt.eurosupply.shared.dtos.FileResponseDto;
import com.nvt.eurosupply.shared.models.PagedResponse;
import com.nvt.eurosupply.product.dtos.ProductSearchRequestDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
@Tag(name = "Products", description = "Product management API")
@CrossOrigin
public class ProductController {

    private final ProductService service;

    @Operation(
            summary = "Create a new product",
            description = "Registers a new product in the system. Image should be uploaded separately."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Product created successfully"),
            @ApiResponse(responseCode = "400", description = "Validation error"),
            @ApiResponse(responseCode = "404", description = "Category not found"),
    })
    @PostMapping
    public ResponseEntity<ProductResponseDto> createProduct(@Valid @RequestBody CreateProductRequestDto request) {
        return new ResponseEntity<>(service.createProduct(request), HttpStatus.CREATED);
    }

    @Operation(
            summary = "Upload product image",
            description = "Uploads one image for an existing product."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Image uploaded successfully"),
            @ApiResponse(responseCode = "404", description = "Product not found"),
            @ApiResponse(responseCode = "400", description = "Invalid image data")
    })
    @PostMapping("/{id}/image")
    public ResponseEntity<FileResponseDto> uploadImage(
            @PathVariable Long id,
            @Valid @RequestBody MultipartFile image
    ) {
        return ResponseEntity.ok(service.uploadImage(id, image));
    }

    @Operation(
            summary = "Get all products",
            description = "Retrieves a paginated list of all products."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Products retrieved successfully")
    })
    @GetMapping
    public ResponseEntity<PagedResponse<ProductResponseDto>> getProducts(Pageable pageable) {
        return ResponseEntity.ok(service.getProducts(pageable));
    }

    @Operation(
            summary = "Update product",
            description = "Updates an existing product by its ID."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Product updated successfully"),
            @ApiResponse(responseCode = "404", description = "Product not found"),
            @ApiResponse(responseCode = "409", description = "The resource was modified by another user"),
            @ApiResponse(responseCode = "400", description = "Invalid update data")
    })
    @PutMapping ("/{id}")
    public ResponseEntity<ProductResponseDto> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody UpdateProductRequestDto request
    ) {
        return ResponseEntity.ok(service.updateProduct(id, request));
    }

    @Operation(
            summary = "Search products",
            description = """
                        Searches products using optional filter criteria. 
                        All parameters are optional and can be combined.
                        
                        **Available filters:**
                        - `name`: Exact or partial name match (case-insensitive)
                        - `description`: Exact or partial description match
                        - `minPrice / maxPrice`: Numeric range for product price
                        - `minWeight / maxWeight`: Numeric range for product weight (in grams/kg)
                        - `onSale`: Boolean flag to filter discounted items (`true`/`false`)
                        - `categoryId`: The unique identifier of the product category
                        
                        Results are paginated.
                        """
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Products retrieved successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid search parameters (e.g. negative price or invalid format)")
    })
    @GetMapping("/search")
    public ResponseEntity<PagedResponse<ProductResponseDto>> searchProducts(
            @Parameter(description = "Filter criteria for product search")
            @ModelAttribute ProductSearchRequestDto request,
            Pageable pageable
    ) {
        return ResponseEntity.ok(service.searchProducts(request, pageable));
    }

    @Operation(
            summary = "Delete product",
            description = "Deletes a product by its ID."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Product deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Product not found")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        service.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
