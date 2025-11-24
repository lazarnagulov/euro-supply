package com.nvt.eurosupply.realtime.messages;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VehicleLocationMessage {
    @JsonProperty("vehicle_id")
    private Long vehicleId;
    private String type;
    private Instant timestamp;
    private double latitude;
    private double longitude;
    @JsonProperty("distance_traveled")
    private double distanceTraveled;
}
