package com.nvt.eurosupply.realtime.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductionItem {
    @JsonProperty("product_id")
    private Long productId;
    private Integer quantity;
}