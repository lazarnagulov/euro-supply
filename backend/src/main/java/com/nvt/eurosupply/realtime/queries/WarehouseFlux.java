package com.nvt.eurosupply.realtime.queries;

import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
public class WarehouseFlux {
    public String getAverageTemperature(Long warehouseId, Long sectorId, Instant start, Instant end, String window) {
        return String.format(
                """
                from(bucket: "warehouse")
                |> range(start: %s, stop: %s)
                |> filter(fn: (r) => r["warehouse_id"] == "%d")
                |> filter(fn: (r) => r["sector_id"] == "%d")
                |> filter(fn: (r) => r["_measurement"] == "sector_temperature")
                |> filter(fn: (r) => r["_field"] == "temperature")
                |> aggregateWindow(every: %s, fn: mean, createEmpty: false)
                |> yield()
                """,
                start.toString(), end.toString(), warehouseId, sectorId, window
        );
    }
}