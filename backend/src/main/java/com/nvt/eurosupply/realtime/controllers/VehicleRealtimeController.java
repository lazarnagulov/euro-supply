package com.nvt.eurosupply.realtime.controllers;

import com.nvt.eurosupply.realtime.dtos.VehicleDistanceDto;
import com.nvt.eurosupply.realtime.dtos.VehicleDistanceRequestDto;
import com.nvt.eurosupply.realtime.services.VehicleRealTimeService;
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
@RequestMapping("/api/v1/vehicles")
@RequiredArgsConstructor
@CrossOrigin
@Tag(name = "Vehicle Real-time", description = "Real-time vehicle tracking and distance data endpoints")
public class VehicleRealtimeController {

    private final VehicleRealTimeService service;

    @Operation(
            summary = "Get vehicle distance data for a time range",
            description = "Retrieves aggregated distance traveled data for a specific vehicle within a given time range. " +
                    "The data is automatically aggregated into appropriate time windows based on the date range provided. " +
                    "Supports time ranges up to 1 year.",
            parameters = {
                    @Parameter(
                            name = "id",
                            description = "Unique identifier of the vehicle",
                            required = true,
                            example = "1"
                    )
            }
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Successfully retrieved distance data",
                    content = @Content(
                            mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = VehicleDistanceDto.class)),
                            examples = @ExampleObject(
                                    name = "Distance data example",
                                    value = """
                        [
                            {
                                "time": "2025-12-08T16:00:00Z",
                                "distanceTraveled": 2.4542137021847363
                            },
                            {
                                "time": "2025-12-09T20:00:00Z",
                                "distanceTraveled": 3.166384944557774
                            },
                            {
                                "time": "2025-12-11T17:00:00Z",
                                "distanceTraveled": 2.1377206658573646
                            }
                        ]
                        """
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid request parameters (missing start/end date or invalid date range)"
            ),
            @ApiResponse(responseCode = "404", description = "Vehicle not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error or database connection issue")
    })
    @GetMapping("/{id}/distances")
    public ResponseEntity<List<VehicleDistanceDto>> getLocations(
            @PathVariable Long id,
            @Valid @ModelAttribute VehicleDistanceRequestDto request
    ) {
        return ResponseEntity.ok(service.getDistances(id, request));
    }


}
