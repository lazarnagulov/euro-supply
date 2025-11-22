package com.nvt.eurosupply.company.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
@Builder
public class RegisterCompanyRequestDto {

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 50, message = "Name must be between 2 and 50 characters")
    private String name;

    @NotBlank(message = "Address is required")
    @Size(min = 2, max = 50, message = "Address must be between 2 and 50 characters")
    private String address;

    @NotNull(message = "City ID is required")
    private Long cityId;

    @NotNull(message = "Country ID is required")
    private Long countryId;


    @NotNull(message = "Latitude is required")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    private Double longitude;
}
