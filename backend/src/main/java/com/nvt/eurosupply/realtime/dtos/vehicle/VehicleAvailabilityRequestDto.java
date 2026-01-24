package com.nvt.eurosupply.realtime.dtos.vehicle;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VehicleAvailabilityRequestDto {
    private Instant start;
    private Instant end;
}
