package com.nvt.eurosupply.realtime.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VehicleDistanceDto {
    private Instant time;
    private Double distanceTraveled;
}
