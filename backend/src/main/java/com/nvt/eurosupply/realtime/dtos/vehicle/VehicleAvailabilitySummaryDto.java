package com.nvt.eurosupply.realtime.dtos.vehicle;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VehicleAvailabilitySummaryDto {
    private Long totalOnlineMinutes;
    private Long totalOfflineMinutes;
    private Double onlinePercentage;
    private Double offlinePercentage;
    private List<VehicleAvailabilityDto> dataPoints;
}
