package com.nvt.eurosupply.vehicle.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateVehicleRequestDto {
    private String registrationNumber;
    private Double maxLoadKg;
    private Long brandId;
    private Long modelId;
}
