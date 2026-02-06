package com.nvt.eurosupply.product.repositories;

import com.nvt.eurosupply.product.models.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product>, ProductBatchOperations{
    Page<Product> findAllByProducingFactories_Id(Long factoryId, Pageable pageable);
    Page<Product> findAllByOnSaleTrue(Pageable pageable);
    Page<Product> findAllByOnSaleTrueAndNameContaining(String keyword, Pageable pageable);

    @Modifying
    @Query("UPDATE Product p SET p.quantity = p.quantity - :delta WHERE p.id = :id AND p.quantity >= :delta")
    int decrementQuantity(@Param("id") Long id, @Param("delta") int delta);
}