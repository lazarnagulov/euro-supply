package com.nvt.eurosupply.vehicle.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VehicleResponseDto {
    private Long id;
    private String registrationPlate;
    private Double maxLoadKg;
    private String brand;
    private String model;
    private List<String> imageUrls;
}
