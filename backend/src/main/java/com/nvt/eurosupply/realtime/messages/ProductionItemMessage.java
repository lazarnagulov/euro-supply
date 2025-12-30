package com.nvt.eurosupply.realtime.messages;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductionItemMessage {
    @JsonProperty("product_id")
    private Long productId;
    private Integer quantity;
}