package com.nvt.eurosupply.realtime.dtos.factory;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FactoryAvailabilitySummaryDto {
    private List<FactoryAvailabilityDataPointDto> dataPoints;
    private double onlinePercentage;
    private double offlinePercentage;
    private long totalOnlineMinutes;
    private long totalOfflineMinutes;
}