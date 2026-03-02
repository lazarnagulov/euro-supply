package com.nvt.eurosupply.realtime.dtos.factory;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FactoryAvailabilityDataPointDto {
    private String timeLabel;
    private boolean online;
}