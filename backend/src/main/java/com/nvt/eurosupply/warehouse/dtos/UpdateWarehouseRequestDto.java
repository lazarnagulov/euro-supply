package com.nvt.eurosupply.warehouse.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateWarehouseRequestDto {
    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 50, message = "Name must be between 2 and 50 characters")
    private String name;

    @NotBlank(message = "Address is required")
    @Size(min = 2, max = 50, message = "Address must be between 2 and 50 characters")
    private String address;

    @NotNull(message = "CityId is required")
    private Long cityId;

    @NotNull(message = "CountryId is required")
    private Long countryId;

    @NotNull(message = "Latitude is required")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    private Double longitude;
}