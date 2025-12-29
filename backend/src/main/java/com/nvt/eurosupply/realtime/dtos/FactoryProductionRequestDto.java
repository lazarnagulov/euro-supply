package com.nvt.eurosupply.realtime.dtos;

import com.nvt.eurosupply.realtime.validators.ValidFactoryProductionRange;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.Instant;

@ValidFactoryProductionRange
@Data
@AllArgsConstructor
@NoArgsConstructor
public class FactoryProductionRequestDto {

    @NotNull
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private Instant start;

    @NotNull
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private Instant end;
}
