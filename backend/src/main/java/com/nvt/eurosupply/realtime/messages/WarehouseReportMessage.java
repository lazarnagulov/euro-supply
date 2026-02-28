package com.nvt.eurosupply.realtime.messages;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WarehouseReportMessage {
    @JsonProperty("warehouse_id")
    private Long warehouseId;

    @JsonProperty("timestamp")
    private Instant timestamp;

    private List<SectorTemperatureMessage> temperatures;
}