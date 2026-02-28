package com.nvt.eurosupply.warehouse.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateSectorDto {
    @NotBlank(message = "Sector name cannot be blank")
    @Size(max = 50, message = "Sector name must not exceed 50 characters")
    private String name;
}