package com.nvt.eurosupply.realtime.messages;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.nvt.eurosupply.realtime.enums.OfflineStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VehicleHeartbeatMessage {
    @JsonProperty("vehicle_id")
    private Long vehicleId;
    private String type;
    private Instant timestamp;
    @JsonFormat(with = JsonFormat.Feature.ACCEPT_CASE_INSENSITIVE_PROPERTIES)
    private OfflineStatus status;
}
