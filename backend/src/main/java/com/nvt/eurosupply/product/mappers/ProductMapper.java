package com.nvt.eurosupply.product.mappers;

import com.nvt.eurosupply.product.dtos.CreateProductRequestDto;
import com.nvt.eurosupply.product.dtos.ProductResponseDto;
import com.nvt.eurosupply.product.models.Product;
import com.nvt.eurosupply.shared.enums.FileFolder;
import com.nvt.eurosupply.shared.mappers.FileMapper;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ProductMapper {

    private final ModelMapper modelMapper;
    private final FileMapper fileMapper;

    public Product fromCreateRequest(CreateProductRequestDto request) {
        return Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .weight(request.getWeight())
                .onSale(request.getOnSale())
                .build();
    }

    public ProductResponseDto toResponse(Product product) {
        ProductResponseDto response = modelMapper.map(product, ProductResponseDto.class);
        if (product.getImage() != null) {
            response.setImageUrl(
                    fileMapper.toResponse(
                            FileFolder.PRODUCT,
                            product.getId(),
                            product.getImage()
                    ));
        }
        return response;
    }
}
