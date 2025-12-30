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
public class ProductionReportMessage {
    @JsonProperty("factory_id")
    private Long factoryId;
    @JsonProperty("produced_at")
    private Instant producedAt;
    private List<ProductionItemMessage> items;
}
