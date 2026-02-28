package com.nvt.eurosupply.realtime.messages;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SectorTemperatureMessage {
    @JsonProperty("sector_id")
    private Long sectorId;

    private Double temperature;
}