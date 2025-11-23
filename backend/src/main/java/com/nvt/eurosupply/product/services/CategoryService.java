package com.nvt.eurosupply.product.services;

import com.nvt.eurosupply.product.dtos.CategoryRequestDto;
import com.nvt.eurosupply.product.dtos.CategoryResponseDto;
import com.nvt.eurosupply.product.mappers.CategoryMapper;
import com.nvt.eurosupply.product.models.Category;
import com.nvt.eurosupply.product.repositories.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository repository;
    private final CategoryMapper mapper;

    public CategoryResponseDto create(CategoryRequestDto request) {
        Category category = repository.save(mapper.toCategory(request));
        return mapper.toResponse(category);
    }

    public List<CategoryResponseDto> getAll() {
        return repository.findAll().stream().map(mapper::toResponse).toList();
    }
}
