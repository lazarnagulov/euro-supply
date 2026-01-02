package com.nvt.eurosupply.realtime.dtos;

import com.nvt.eurosupply.realtime.validators.DateRangeRequest;
import com.nvt.eurosupply.realtime.validators.ValidDateRange;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@ValidDateRange
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VehicleDistanceRequestDto implements DateRangeRequest {

    @NotNull(message = "Start is required")
    private Instant start;

    @NotNull(message = "End is required")
    private Instant end;
}

