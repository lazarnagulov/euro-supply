package com.nvt.eurosupply.vehicle.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VehicleSearchRequestDto {
    private String registration;
    private Long brandId;
    private Long modelId;
    private Double minLoad;
    private Double maxLoad;
    private String search;
}
