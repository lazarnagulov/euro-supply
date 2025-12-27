package com.nvt.eurosupply.vehicle.dtos;

import com.nvt.eurosupply.shared.dtos.FileResponseDto;
import com.nvt.eurosupply.shared.dtos.LocationResponseDto;
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
    private String registrationNumber;
    private Double maxLoadKg;
    private VehicleBrandDto brand;
    private VehicleModelDto model;
    private LocationResponseDto lastLocation;
    private List<FileResponseDto> imageUrls;
}
