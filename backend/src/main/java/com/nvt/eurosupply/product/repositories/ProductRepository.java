package com.nvt.eurosupply.product.repositories;

import com.nvt.eurosupply.product.models.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.*;

import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    Page<Product> findAllByProducingFactories_Id(Long factoryId, Pageable pageable);
    Page<Product> findAllByOnSaleTrue(Pageable pageable);
    Page<Product> findAllByOnSaleTrueAndNameContaining(String keyword, Pageable pageable);

    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.inventory WHERE p.id = :id")
    Optional<Product> findByIdWithInventory(@Param("id") Long id);

    @Query(value = "SELECT p FROM Product p LEFT JOIN FETCH p.inventory",
            countQuery = "SELECT COUNT(p) FROM Product p")
    Page<Product> findAllWithInventory(Pageable pageable);

    @Query(value = "SELECT p FROM Product p LEFT JOIN FETCH p.inventory WHERE p.onSale = true",
            countQuery = "SELECT COUNT(p) FROM Product p WHERE p.onSale = true")
    Page<Product> findAllByOnSaleTrueWithInventory(Pageable pageable);
}