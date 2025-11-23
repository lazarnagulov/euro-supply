package com.nvt.eurosupply.product.mappers;

import com.nvt.eurosupply.product.dtos.CategoryRequestDto;
import com.nvt.eurosupply.product.dtos.CategoryResponseDto;
import com.nvt.eurosupply.product.models.Category;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CategoryMapper {
    private final ModelMapper modelMapper;

    public CategoryResponseDto toResponse(Category category) {
        return modelMapper.map(category, CategoryResponseDto.class);
    }

    public Category toCategory(CategoryRequestDto request) {
        return modelMapper.map(request, Category.class);
    }
}
