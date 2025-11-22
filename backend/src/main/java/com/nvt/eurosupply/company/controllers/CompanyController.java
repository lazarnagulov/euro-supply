package com.nvt.eurosupply.company.controllers;

import com.nvt.eurosupply.company.dtos.CompanyResponseDto;
import com.nvt.eurosupply.company.dtos.RegisterCompanyRequestDto;
import com.nvt.eurosupply.company.dtos.ReviewCompanyRequestDto;
import com.nvt.eurosupply.company.services.CompanyService;
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

import java.util.List;

@RestController
@RequestMapping("/api/v1/companies")
@RequiredArgsConstructor
@Tag(name = "Companies", description = "Company management API")
public class CompanyController {

    private final CompanyService service;

    @Operation(
            summary = "Register a new company",
            description = "Creates a new company record without files. Files should be uploaded separately."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Company created successfully"),
            @ApiResponse(responseCode = "400", description = "Validation error"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping
    public ResponseEntity<CompanyResponseDto> registerCompany(@Valid @RequestBody RegisterCompanyRequestDto request) {
        return new ResponseEntity<>(service.registerCompany(request), HttpStatus.CREATED);
    }

    @Operation(
            summary = "Upload files for a company",
            description = "Uploads one or more files (images, PDFs) for an existing company."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Files uploaded successfully"),
            @ApiResponse(responseCode = "404", description = "Company not found"),
            @ApiResponse(responseCode = "400", description = "Invalid file data")
    })
    @PostMapping("/{id}/files")
    public ResponseEntity<Void> uploadFiles(@PathVariable Long id, @Valid @RequestBody List<MultipartFile> files) {
        return null;
    }

    @Operation(
            summary = "Get company details",
            description = "Returns the company by ID along with its files."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Company retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Company not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<CompanyResponseDto> getCompany(@Valid @PathVariable Long id) {
        return ResponseEntity.ok(service.getCompany(id));
    }


    @Operation(
            summary = "Review a company",
            description = "Updates the status of a company (e.g., APPROVED or REJECTED)."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Company updated"),
            @ApiResponse(responseCode = "404", description = "Company not found"),
            @ApiResponse(responseCode = "400", description = "Invalid review data")
    })
    @PatchMapping("/{id}")
    public ResponseEntity<CompanyResponseDto> updateCompanyStatus(
            @PathVariable Long id,
            @Valid @RequestBody ReviewCompanyRequestDto request
    ) {
        return ResponseEntity.ok(service.reviewCompany(id, request));
    }

}
