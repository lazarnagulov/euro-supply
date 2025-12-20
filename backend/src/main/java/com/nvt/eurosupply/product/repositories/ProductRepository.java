package com.nvt.eurosupply.product.repositories;

import com.nvt.eurosupply.product.models.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {

}
