package com.nvt.eurosupply.realtime.controllers;

import com.nvt.eurosupply.realtime.dtos.ProductionChartDto;
import com.nvt.eurosupply.realtime.dtos.TimeRangeRequestDto;
import com.nvt.eurosupply.realtime.dtos.factory.FactoryAvailabilitySummaryDto;
import com.nvt.eurosupply.realtime.services.FactoryRealTimeService;
import com.nvt.eurosupply.shared.components.TimeRangeResolver;
import com.nvt.eurosupply.shared.records.TimeRange;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/v1/factories")
@RequiredArgsConstructor
@CrossOrigin
@Slf4j
@Tag(name = "Factory Real-time", description = "Retrieve real-time production data for a factory's products.")
public class FactoryRealTimeController {

    private final FactoryRealTimeService service;
    private final TimeRangeResolver timeRangeResolver;

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
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_MANAGER')")
    public ResponseEntity<List<ProductionChartDto>> getProductions(
            @PathVariable Long id,
            @PathVariable Long productId,
            @ModelAttribute TimeRangeRequestDto request
            ) {
        TimeRange timeRange = timeRangeResolver.resolve(request.getPeriod(), request.getStart(), request.getEnd());
        return ResponseEntity.ok(service.getProduction(id, productId, timeRange.from(), timeRange.to()));
    }

    @Operation(
            summary = "Get factory availability"
    )
    @GetMapping("/{factoryId}/availability")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_MANAGER')")
    public ResponseEntity<FactoryAvailabilitySummaryDto> getAvailability(
            @PathVariable Long factoryId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant end) {

        if (Duration.between(start, end).toDays() > 365) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(service.getAvailabilitySummary(factoryId, start, end));
    }
}
