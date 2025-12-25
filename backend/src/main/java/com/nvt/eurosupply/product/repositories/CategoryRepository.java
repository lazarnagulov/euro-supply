package com.nvt.eurosupply.product.repositories;

import com.nvt.eurosupply.product.models.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
