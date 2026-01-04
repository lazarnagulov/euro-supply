package com.nvt.eurosupply.factory.dtos;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FactoryProductListItemDto {
    private Long productId;
    private String productName;
    private String categoryName;
}
