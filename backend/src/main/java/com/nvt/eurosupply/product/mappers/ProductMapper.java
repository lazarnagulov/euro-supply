package com.nvt.eurosupply.product.mappers;

import com.nvt.eurosupply.factory.dtos.FactoryProductListItemDto;
import com.nvt.eurosupply.factory.models.Factory;
import com.nvt.eurosupply.product.dtos.CreateProductRequestDto;
import com.nvt.eurosupply.product.dtos.ProductResponseDto;
import com.nvt.eurosupply.product.models.Product;
import com.nvt.eurosupply.shared.enums.FileFolder;
import com.nvt.eurosupply.shared.mappers.FileMapper;
import com.nvt.eurosupply.shared.models.PagedResponse;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
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

    public ProductResponseDto toResponse(Product product, Integer quantity) {
        ProductResponseDto response = modelMapper.map(product, ProductResponseDto.class);

        if (product.getImage() != null) {
            response.setImageUrl(
                    fileMapper.toResponse(FileFolder.PRODUCT, product.getId(), product.getImage()));
        }
        response.setFactoryIds(
                product.getProducingFactories().stream().map(Factory::getId).toList());
        response.setFactoryNames(
                product.getProducingFactories().stream().map(Factory::getName).toList());
        response.setQuantity(quantity);

        return response;
    }

    public ProductResponseDto toResponse(Product product) {
        return toResponse(product, null);
    }

    public PagedResponse<ProductResponseDto> toPagedResponse(Page<Product> page) {
        return new PagedResponse<>(
                page.getContent().stream().map(this::toResponse).toList(),
                page.getTotalPages(),
                page.getTotalElements()
        );
    }

    public PagedResponse<ProductResponseDto> toPagedResponseWithInventory(Page<Product> page) {
        return new PagedResponse<>(
                page.getContent().stream()
                        .map(p -> toResponse(p, p.getInventory() != null ? p.getInventory().getQuantity() : 0))
                        .toList(),
                page.getTotalPages(),
                page.getTotalElements()
        );
    }

    public FactoryProductListItemDto toFactoryProductListItemDto(Product product) {
        return FactoryProductListItemDto.builder()
                .productId(product.getId())
                .productName(product.getName())
                .categoryName(product.getCategory().getName())
                .build();
    }

    public PagedResponse<FactoryProductListItemDto> toFactoryProductListItemPagedResponse(Page<Product> page) {
        return new PagedResponse<>(
                page.getContent().stream().map(this::toFactoryProductListItemDto).toList(),
                page.getTotalPages(),
                page.getTotalElements()
        );
    }
}
