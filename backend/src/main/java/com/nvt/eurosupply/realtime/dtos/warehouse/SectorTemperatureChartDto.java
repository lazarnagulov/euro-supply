package com.nvt.eurosupply.realtime.dtos.warehouse;

public record SectorTemperatureChartDto (
    String time,
    Double averageTemperature
) {}