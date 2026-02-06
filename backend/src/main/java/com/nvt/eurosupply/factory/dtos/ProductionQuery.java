package com.nvt.eurosupply.factory.dtos;

import java.time.Instant;

public record ProductionQuery(
        Long productId,
        String period,
        Instant from,
        Instant to
) {}
