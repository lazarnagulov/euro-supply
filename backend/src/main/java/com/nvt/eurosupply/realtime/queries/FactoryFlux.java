package com.nvt.eurosupply.realtime.queries;

import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
public class FactoryFlux {

    public String getProduction(Long factoryId, Long productId, Instant start, Instant end, String window) {
        return String.format(
                """
                from(bucket: "factory")
                |> range(start: %s, stop: %s)
                |> filter(fn: (r) => r["factory_id"] == "%d")
                |> filter(fn: (r) => r["product_id"] == "%d")
                |> filter(fn: (r) => r["_measurement"] == "factory_production")
                |> filter(fn: (r) => r["_field"] == "quantity")
                |> aggregateWindow(every: %s, fn: sum, createEmpty: false)
                |> yield()
                """,
                start, end, factoryId, productId, window
        );
    }
}
