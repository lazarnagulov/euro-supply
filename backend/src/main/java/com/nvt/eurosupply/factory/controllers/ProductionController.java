package com.nvt.eurosupply.factory.controllers;

import com.nvt.eurosupply.factory.dtos.ProductionChartDto;
import com.nvt.eurosupply.factory.services.ProductionService;
import com.nvt.eurosupply.common.time.TimeRange;
import com.nvt.eurosupply.common.time.TimeRangeResolver;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/v1/factories/{factoryId}/production")
@RequiredArgsConstructor
@Tag( name = "Factory Production", description = "Endpoints for retrieving production data for a specific factory" )
public class ProductionController {

    private final ProductionService service;
    private final TimeRangeResolver timeRangeResolver;

    @GetMapping
    @Operation(summary = "Get production chart data for factory product")
    public List<ProductionChartDto> getProduction(
            @PathVariable Long factoryId,
            @RequestParam Long productId,
            @RequestParam(required = false) String period,
            @RequestParam(required = false) Instant from,
            @RequestParam(required = false) Instant to
    ) {
        TimeRange range = timeRangeResolver.resolve(period, from, to);

        return service.getProduction(
                factoryId,
                productId,
                range.from(),
                range.to()
        );
    }
}
