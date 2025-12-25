package com.nvt.eurosupply.product.dtos;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Request object for filtering products")
public class ProductSearchRequestDto {

    private String name;
    private String description;
    private Double minPrice;
    private Double maxPrice;
    private Double minWeight;
    private Double maxWeight;
    private Boolean onSale;
    private Long categoryId;
}