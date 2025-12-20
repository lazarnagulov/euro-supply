package com.nvt.eurosupply.product.dtos;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateProductRequestDto {
    private String name;
    private String description;

    private Double price;
    private Double weight;

    private Boolean onSale;

    private Long categoryId;
}
