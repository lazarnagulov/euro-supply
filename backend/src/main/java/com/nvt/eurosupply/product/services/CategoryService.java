package com.nvt.eurosupply.product.services;

import com.nvt.eurosupply.product.dtos.CategoryDto;
import com.nvt.eurosupply.product.mappers.CategoryMapper;
import com.nvt.eurosupply.product.models.Category;
import com.nvt.eurosupply.product.repositories.CategoryRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository repository;
    private final CategoryMapper mapper;

    public Category find(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Category not found"));
    }

    public List<CategoryDto> getCategories() {
        return repository.findAll().stream().map(mapper::toDto).toList();
    }
}
