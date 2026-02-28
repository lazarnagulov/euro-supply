package com.nvt.eurosupply.realtime.messages;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.nvt.eurosupply.realtime.enums.ConnectionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WarehouseHeartbeatMessage {
    @JsonProperty("warehouse_id")
    private Long warehouseId;

    private String type;

    private Instant timestamp;

    @JsonFormat(with = JsonFormat.Feature.ACCEPT_CASE_INSENSITIVE_PROPERTIES)
    private ConnectionStatus status;
}