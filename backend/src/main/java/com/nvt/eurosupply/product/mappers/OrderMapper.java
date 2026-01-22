package com.nvt.eurosupply.product.mappers;

import com.nvt.eurosupply.company.models.Company;
import com.nvt.eurosupply.product.models.Order;
import com.nvt.eurosupply.product.models.Product;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class OrderMapper {
    private final ModelMapper modelMapper;

    public Order fromRequest(Product product, Company company, Integer quantity) {
        return Order.builder()
                .product(product)
                .company(company)
                .quantity(quantity)
                .build();
    }
}