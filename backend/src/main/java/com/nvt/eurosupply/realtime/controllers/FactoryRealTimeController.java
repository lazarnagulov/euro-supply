package com.nvt.eurosupply.realtime.controllers;

import com.nvt.eurosupply.realtime.dtos.ProductionChartDto;
import com.nvt.eurosupply.realtime.dtos.FactoryProductionRequestDto;
import com.nvt.eurosupply.realtime.services.FactoryRealTimeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/factories")
@RequiredArgsConstructor
@CrossOrigin
@Slf4j
@Tag(name = "Factory Real-time", description = "Retrieve real-time production data for a factory's products.")
public class FactoryRealTimeController {

    private final FactoryRealTimeService service;

    @Operation(
            summary = "Get production data for a product",
            description = "Retrieves real-time production statistics for a specific product in a specific factory. " +
                    "Supports optional filtering by date range and aggregation period.",
            parameters = {
                    @Parameter(
                            name = "id",
                            description = "Unique identifier of the factory",
                            required = true,
                            example = "1"
                    ),
                    @Parameter(
                            name = "productId",
                            description = "Unique identifier of the product",
                            required = true,
                            example = "10"
                    )
            }
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved production data"),
            @ApiResponse(responseCode = "400", description = "Invalid request parameters (e.g., invalid date range)"),
            @ApiResponse(responseCode = "404", description = "Factory or product not found")
    })
    @GetMapping("/{id}/production/{productId}")
    public ResponseEntity<List<ProductionChartDto>> getProductions(
            @PathVariable Long id,
            @PathVariable Long productId,
            @Valid @ModelAttribute FactoryProductionRequestDto request
            ) {
        return ResponseEntity.ok(service.getProduction(id, productId, request));
    }
}
