package com.nvt.eurosupply.realtime.dtos.vehicle;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VehicleAvailabilityDto {
    private String label;
    private Instant timestamp;
    private Long onlineMinutes;
    private Long offlineMinutes;
    private Double onlinePercentage;
}
