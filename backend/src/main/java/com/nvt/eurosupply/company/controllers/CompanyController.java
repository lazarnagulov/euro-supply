package com.nvt.eurosupply.company.controllers;

import com.nvt.eurosupply.company.dtos.CompanyResponseDto;
import com.nvt.eurosupply.company.dtos.CompanySummaryResponseDto;
import com.nvt.eurosupply.company.dtos.RegisterCompanyRequestDto;
import com.nvt.eurosupply.company.dtos.ReviewCompanyRequestDto;
import com.nvt.eurosupply.company.services.CompanyService;
import com.nvt.eurosupply.shared.dtos.FileResponseDto;
import com.nvt.eurosupply.shared.models.PagedResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
            description = "Creates a new company record without files. Files should be uploaded separately.",
            security = { @SecurityRequirement(name="bearerAuth") }
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Company created successfully"),
            @ApiResponse(responseCode = "400", description = "Validation error"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Country or City does not exist"),
    })
    @PostMapping
    @PreAuthorize("hasRole('ROLE_CUSTOMER')")
    public ResponseEntity<CompanyResponseDto> registerCompany(@Valid @RequestBody RegisterCompanyRequestDto request) {
        return new ResponseEntity<>(service.registerCompany(request), HttpStatus.CREATED);
    }

    @Operation(
            summary = "Upload files for a company",
            description = "Uploads one or more files (images, PDFs) for an existing company.",
            security = { @SecurityRequirement(name="bearerAuth") }
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Files uploaded successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid file data"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Company not found"),
    })
    @PostMapping("/{id}/files")
    @PreAuthorize("hasRole('ROLE_CUSTOMER')")
    public ResponseEntity<List<FileResponseDto>> uploadFiles(@PathVariable Long id, @Valid @RequestBody List<MultipartFile> files) {
        return ResponseEntity.ok(service.uploadFiles(id, files));
    }

    @Operation(
            summary = "Get company details",
            description = "Returns the company by ID along with its files.",
            security = { @SecurityRequirement(name="bearerAuth") }
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Company retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Company not found")
    })
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_CUSTOMER')")
    public ResponseEntity<CompanyResponseDto> getCompany(@Valid @PathVariable Long id) {
        return ResponseEntity.ok(service.getCompany(id));
    }

    @Operation(
            summary = "Get pending companies",
            description = "Returns the list of pending companies.",
            security = { @SecurityRequirement(name="bearerAuth") }
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Pending Companies retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
    })
    @GetMapping("/pending")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_MANAGER')")
    public ResponseEntity<PagedResponse<CompanyResponseDto>> getPendingCompanies(Pageable pageable) {
        return ResponseEntity.ok(service.getPendingCompanies(pageable));
    }

    @Operation(
            summary = "Review a company",
            description = "Updates the status of a company (e.g., APPROVED or REJECTED).",
            security = { @SecurityRequirement(name="bearerAuth") }
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Company updated"),
            @ApiResponse(responseCode = "400", description = "Invalid review data"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Company not found"),
    })
    @PatchMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_MANAGER')")
    public ResponseEntity<CompanyResponseDto> updateCompanyStatus(
            @PathVariable Long id,
            @Valid @RequestBody ReviewCompanyRequestDto request
    ) {
        return ResponseEntity.ok(service.reviewCompany(id, request));
    }

    @Operation(
            summary = "Get my companies",
            description = """ 
                    Returns a list of companies owned by the currently authenticated user.
                    The response contains only basic company information (id and name).""",
            security = { @SecurityRequirement(name="bearerAuth") }
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Companies successfully retrieved"),
            @ApiResponse(responseCode = "401", description = "User is not authenticated"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
    })
    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('ROLE_CUSTOMER')")
    public ResponseEntity<List<CompanySummaryResponseDto>> getMyCompanies() {
        List<CompanySummaryResponseDto> companies = service.getCompaniesForCurrentUser();
        return ResponseEntity.ok(companies);
    }
}
