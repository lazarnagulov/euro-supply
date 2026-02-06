package com.nvt.eurosupply.vehicle.events;

import java.time.Instant;

public record StatusChangeEvent(
    Long vehicleId,
    boolean isOnline,
    Instant timestamp
) { }
