package com.nvt.eurosupply.shared.controllers;

import com.nvt.eurosupply.shared.dtos.CityResponseDto;
import com.nvt.eurosupply.shared.dtos.CountryResponseDto;
import com.nvt.eurosupply.shared.services.CountryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/countries")
@RequiredArgsConstructor
@Tag(name = "Countries", description = "Country management API")
public class CountryController {

    private final CountryService service;

    @Operation(
            summary = "Get all countries",
            description = "Fetches a list of all countries in the system."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved list of countries"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping
    public ResponseEntity<List<CountryResponseDto>> getCountries() {
        return ResponseEntity.ok(service.getAll());
    }

    @Operation(
            summary = "Get all cities of a country",
            description = "Returns all cities that belong to the given country ID."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cities retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Country not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/{id}/cities")
    public ResponseEntity<List<CityResponseDto>> getCountryCities(@PathVariable Long id) {
        return ResponseEntity.ok(service.getCountryCities(id));
    }

}
