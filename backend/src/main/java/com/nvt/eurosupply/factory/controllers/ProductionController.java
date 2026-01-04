package com.nvt.eurosupply.factory.controllers;

import com.nvt.eurosupply.factory.dtos.ProductionChartDto;
import com.nvt.eurosupply.factory.services.ProductionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@RestController
@RequestMapping("/api/v1/factories/{factoryId}/production")
@RequiredArgsConstructor
@Tag(
        name = "Factory Production",
        description = "Endpoints for retrieving production data for a specific factory"
)
@CrossOrigin
public class ProductionController {

    private final ProductionService service;

    @Operation(
            summary = "Get production data for a product in a specific factory",
            description = """
                    Returns aggregated production data for a given product
                    within a specific factory and time range.
                    
                    The time range can be defined either by:
                    - a predefined period (7d, 30d, 90d, 180d, 365d)
                    - or a custom date range using 'from' and 'to' ISO-8601 timestamps.
                    """
    )
    @GetMapping
    public List<ProductionChartDto> getFactoryProductionForProduct(
            @Parameter(description = "ID of the factory", required = true)
            @PathVariable Long factoryId,

            @Parameter(description = "ID of the product", required = true)
            @RequestParam Long productId,

            @Parameter(description = "Predefined period (7d, 30d, 90d, 180d, 365d)")
            @RequestParam(required = false) String period,

            @Parameter(description = "Custom start date (ISO-8601)")
            @RequestParam(required = false) String from,

            @Parameter(description = "Custom end date (ISO-8601)")
            @RequestParam(required = false) String to
    ) {
        Instant now = Instant.now();
        Instant fromInstant;
        Instant toInstant = now;

        if (from != null && to != null) {
            fromInstant = Instant.parse(from);
            toInstant = Instant.parse(to);
        } else {
            switch (period) {
                case "7d" -> fromInstant = now.minus(7, ChronoUnit.DAYS);
                case "30d" -> fromInstant = now.minus(30, ChronoUnit.DAYS);
                case "90d" -> fromInstant = now.minus(90, ChronoUnit.DAYS);
                case "180d" -> fromInstant = now.minus(180, ChronoUnit.DAYS);
                default -> fromInstant = now.minus(365, ChronoUnit.DAYS);
            }
        }

        return service.getProduction(factoryId, productId, fromInstant, toInstant);
    }
}
