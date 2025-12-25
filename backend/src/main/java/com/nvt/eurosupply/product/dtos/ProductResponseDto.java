package com.nvt.eurosupply.product.dtos;

import com.nvt.eurosupply.shared.dtos.FileResponseDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponseDto {
    private Long id;
    private String name;
    private String description;
    private Boolean onSale;
    private Double price;
    private Double weight;
    private FileResponseDto imageUrl;
    private CategoryDto category;
}
