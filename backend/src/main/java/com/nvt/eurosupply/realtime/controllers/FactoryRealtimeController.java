package com.nvt.eurosupply.realtime.controllers;

import com.nvt.eurosupply.realtime.dtos.FactoryProductionDto;
import com.nvt.eurosupply.realtime.dtos.FactoryProductionRequestDto;
import com.nvt.eurosupply.realtime.services.FactoryRealTimeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/factories")
@RequiredArgsConstructor
@CrossOrigin
@Tag(
        name = "Factory Real-time",
        description = "Real-time factory production tracking and analytics"
)
public class FactoryRealtimeController {

    private final FactoryRealTimeService service;

    @Operation(
            summary = "Get factory production data for a time range",
            description = "Retrieves aggregated production quantities for a specific factory " +
                    "within a given time range. Data is grouped by time window and product."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Successfully retrieved production data",
                    content = @Content(
                            mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = FactoryProductionDto.class)),
                            examples = @ExampleObject(
                                    name = "Production data example",
                                    value = """
                        [
                            {
                                "time": "2025-12-08T00:00:00Z",
                                "productId": 1,
                                "quantity": 320
                            },
                            {
                                "time": "2025-12-08T00:00:00Z",
                                "productId": 2,
                                "quantity": 180
                            },
                            {
                                "time": "2025-12-09T12:00:00Z",
                                "productId": 1,
                                "quantity": 410
                            }
                        ]
                        """
                            )
                    )
            ),
            @ApiResponse(responseCode = "400", description = "Invalid request parameters"),
            @ApiResponse(responseCode = "404", description = "Factory not found")
    })
    @GetMapping("/{id}/production")
    public ResponseEntity<List<FactoryProductionDto>> getProduction(
            @Parameter(
                    name = "id",
                    description = "Unique identifier of the factory",
                    required = true,
                    example = "3"
            )
            @PathVariable Long id,

            @Valid @ModelAttribute FactoryProductionRequestDto request
    ) {
        return ResponseEntity.ok(service.getProduction(id, request));
    }
}
