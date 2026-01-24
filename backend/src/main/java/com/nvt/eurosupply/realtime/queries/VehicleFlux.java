package com.nvt.eurosupply.realtime.queries;

import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
public class VehicleFlux {

    public String getAggregatedAvailability(
            Long vehicleId, Instant start, Instant end, String window
    ) {
        return String.format(
                """
                from(bucket: "vehicle")
                  |> range(start: %s, stop: %s)
                  |> filter(fn: (r) => r["_measurement"] == "vehicle_availability")
                  |> filter(fn: (r) => r["vehicle_id"] == "%d")
                  |> filter(fn: (r) => r["_field"] == "is_online")
                  |> sort(columns: ["_time"])
                  |> elapsed(unit: 1m)
                  |> window(every: %s, createEmpty: false)
                  |> map(fn: (r) => ({
                      r with
                      online_minutes: if r._value == true then r.elapsed else 0,
                      offline_minutes: if r._value == false then r.elapsed else 0
                  }))
                  |> reduce(
                      identity: {online_minutes: 0, offline_minutes: 0},
                      fn: (r, accumulator) => ({
                          online_minutes: accumulator.online_minutes + r.online_minutes,
                          offline_minutes: accumulator.offline_minutes + r.offline_minutes
                      })
                  )
                  |> duplicate(column: "_stop", as: "_time")
                  |> drop(columns: ["_start"])
                  |> yield(name: "availability")
                """,
                start, end, vehicleId, window
        );
    }

    public String getDistances(Long id, Instant start, Instant end, String window) {
        return String.format(
                """
                from(bucket: "vehicle")
                |> range(start: %s, stop: %s)
                |> filter(fn: (r) => r["vehicle_id"] == "%d")
                |> filter(fn: (r) => r["_measurement"] == "vehicle_location")
                |> filter(fn: (r) => r["_field"] == "distance_traveled")
                |> aggregateWindow(every: %s, fn: sum, createEmpty: false)
                |> yield()
                """,
                start, end, id, window
        );
    }
}
