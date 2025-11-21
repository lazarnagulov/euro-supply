package com.nvt.eurosupply.company.controller;

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

    @PostMapping
    public ResponseEntity<CompanyResponseDto> registerCompany(@Valid @RequestBody RegisterCompanyRequestDto request) {
        return new ResponseEntity<>(service.registerCompany(request), HttpStatus.CREATED);
    }

    @PostMapping("/{id}/files")
    public ResponseEntity<Void> uploadFiles(@PathVariable Long id, @Valid @RequestBody List<MultipartFile> files) {
        return null;
    }

    @GetMapping("/{id}")
    public ResponseEntity<CompanyResponseDto> getCompany(@Valid @PathVariable Long id) {
        return ResponseEntity.ok(service.getCompany(id));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<CompanyResponseDto> updateCompanyStatus(
            @PathVariable Long id,
            @Valid @RequestBody ReviewCompanyRequestDto request
    ) {
        return ResponseEntity.ok(service.reviewCompany(id, request));
    }

}
