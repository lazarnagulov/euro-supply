package com.nvt.eurosupply.vehicle.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateVehicleRequestDto {

    @NotBlank(message = "Registration Plate is required")
    private String registrationPlate;

    @NotNull(message = "Max Load in kg is required")
    private Double maxLoadKg;

    @NotNull(message = "Brand Id in kg is required")
    private Long brandId;

    @NotNull(message = "Model Id in kg is required")
    private Long modelId;
}
