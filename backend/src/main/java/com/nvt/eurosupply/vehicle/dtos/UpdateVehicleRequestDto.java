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
public class UpdateVehicleRequestDto {

    @NotBlank(message = "Registration Number is required")
    private String registrationNumber;

    @NotNull(message = "Max Load in kg is required")
    private Double maxLoadKg;

    @NotNull(message = "Brand is required")
    private Long brandId;

    @NotNull(message = "Model is required")
    private Long modelId;
}
