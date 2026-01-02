package com.nvt.eurosupply.realtime.dtos;

import com.nvt.eurosupply.realtime.validators.DateRangeRequest;
import com.nvt.eurosupply.realtime.validators.ValidDateRange;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.Instant;

@ValidDateRange
@Data
@AllArgsConstructor
@NoArgsConstructor
public class FactoryProductionRequestDto implements DateRangeRequest {

    @NotNull
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private Instant start;

    @NotNull
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private Instant end;
}
