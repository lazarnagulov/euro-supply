package com.nvt.eurosupply.product.mappers;

import com.nvt.eurosupply.product.dtos.CategoryDto;
import com.nvt.eurosupply.product.models.Category;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CategoryMapper {
    private final ModelMapper modelMapper;

    public CategoryDto toDto(Category category) {
        return modelMapper.map(category, CategoryDto.class);
    }
}
