package com.nvt.eurosupply.realtime.controllers;

import com.nvt.eurosupply.realtime.dtos.VehicleDistanceDto;
import com.nvt.eurosupply.realtime.dtos.VehicleDistanceRequestDto;
import com.nvt.eurosupply.realtime.services.VehicleRealTimeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/vehicles")
@RequiredArgsConstructor
@CrossOrigin
public class VehicleRealtimeController {

    private final VehicleRealTimeService service;

    @GetMapping("/{id}/distances")
    public ResponseEntity<List<VehicleDistanceDto>> getLocations(
            @PathVariable Long id,
            @Valid @ModelAttribute VehicleDistanceRequestDto request
    ) {
        return ResponseEntity.ok(service.getDistances(id, request));
    }


}
