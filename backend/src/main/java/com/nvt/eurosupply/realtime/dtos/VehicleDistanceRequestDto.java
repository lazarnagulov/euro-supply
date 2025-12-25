package com.nvt.eurosupply.realtime.dtos;

import com.nvt.eurosupply.realtime.validators.ValidVehicleLocationRange;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@ValidVehicleLocationRange
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VehicleDistanceRequestDto {

    @NotNull(message = "Start is required")
    private Instant start;

    @NotNull(message = "End is required")
    private Instant end;
}

