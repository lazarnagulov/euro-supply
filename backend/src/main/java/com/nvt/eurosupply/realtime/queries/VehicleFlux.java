package com.nvt.eurosupply.realtime.queries;

import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Component
public class VehicleFlux {

    public String getAggregatedAvailability(Long vehicleId, Instant start, Instant end, String window) {
        Instant lookBackStart = start.minus(7, ChronoUnit.DAYS);

        return String.format(
                """
                lastState = from(bucket: "vehicle")
                  |> range(start: %s, stop: %s)
                  |> filter(fn: (r) => r["_measurement"] == "vehicle_availability")
                  |> filter(fn: (r) => r["vehicle_id"] == "%d")
                  |> filter(fn: (r) => r["_field"] == "is_online")
                  |> last()
                  |> map(fn: (r) => ({r with _time: %s}))
            
                currentStates = from(bucket: "vehicle")
                  |> range(start: %s, stop: %s)
                  |> filter(fn: (r) => r["_measurement"] == "vehicle_availability")
                  |> filter(fn: (r) => r["vehicle_id"] == "%d")
                  |> filter(fn: (r) => r["_field"] == "is_online")
            
                union(tables: [lastState, currentStates])
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
                  |> filter(fn: (r) => r._time < now())
                  |> filter(fn: (r) => r.online_minutes + r.offline_minutes > 0)
                  |> drop(columns: ["_start"])
                  |> yield(name: "availability")
                """,
                lookBackStart, start, vehicleId, start, start, end, vehicleId, window
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
