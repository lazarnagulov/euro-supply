package com.nvt.eurosupply.product.controllers;

import com.nvt.eurosupply.product.dtos.CreateProductRequestDto;
import com.nvt.eurosupply.product.dtos.ProductResponseDto;
import com.nvt.eurosupply.product.services.ProductService;
import com.nvt.eurosupply.shared.dtos.FileResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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
}
