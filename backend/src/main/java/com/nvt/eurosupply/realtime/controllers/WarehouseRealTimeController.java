package com.nvt.eurosupply.realtime.controllers;

import com.nvt.eurosupply.realtime.dtos.TimeRangeRequestDto;
import com.nvt.eurosupply.realtime.dtos.warehouse.SectorTemperatureChartDto;
import com.nvt.eurosupply.realtime.services.WarehouseRealTimeService;
import com.nvt.eurosupply.shared.records.TimeRange;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import com.nvt.eurosupply.shared.components.TimeRangeResolver;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/warehouses")
@RequiredArgsConstructor
@CrossOrigin
@Slf4j
@Tag(name = "Warehouse Real-time", description = "Retrieve real-time production data for a warehouse's sectors.")
public class WarehouseRealTimeController {

    private final TimeRangeResolver timeRangeResolver;
    private final WarehouseRealTimeService service;

    @Operation(
            summary = "Get production data for a sector",
            description = "Retrieves real-time production statistics for a specific sector in a specific warehouse. " +
                    "Supports optional filtering by date range and aggregation period.",
            parameters = {
                    @Parameter(
                            name = "id",
                            description = "Unique identifier of the warehouse",
                            required = true,
                            example = "1"
                    ),
                    @Parameter(
                            name = "sectorId",
                            description = "Unique identifier of the sector",
                            required = true,
                            example = "10"
                    )
            }
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved data"),
            @ApiResponse(responseCode = "400", description = "Invalid request parameters (e.g., invalid date range)"),
            @ApiResponse(responseCode = "404", description = "Warehouse or sector not found")
    })
    @GetMapping("/{id}/sector/{sectorId}")
    public ResponseEntity<List<SectorTemperatureChartDto>> getSectorTemperatureChart(@PathVariable Long id, @PathVariable Long sectorId, @ModelAttribute TimeRangeRequestDto request) {
        TimeRange timeRange = timeRangeResolver.resolve(request.getPeriod(), request.getStart(), request.getEnd());
        return ResponseEntity.ok(service.getSectorTemperatureChart(id, sectorId, timeRange.from(), timeRange.to()));
    }
}