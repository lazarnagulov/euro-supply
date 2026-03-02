package com.nvt.eurosupply.realtime.dtos.factory;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FactoryProductionDto {
    private Instant time;
    private Long productId;
    private Integer quantity;
}
