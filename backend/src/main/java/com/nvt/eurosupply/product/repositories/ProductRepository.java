package com.nvt.eurosupply.product.repositories;

import com.nvt.eurosupply.product.models.Product;
import jakarta.persistence.LockModeType;
import jakarta.persistence.QueryHint;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.*;

import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product>, ProductBatchOperations{
    Page<Product> findAllByProducingFactories_Id(Long factoryId, Pageable pageable);
    Page<Product> findAllByOnSaleTrue(Pageable pageable);
    Page<Product> findAllByOnSaleTrueAndNameContaining(String keyword, Pageable pageable);

    @Modifying
    @Query("UPDATE Product p SET p.quantity = p.quantity - :delta WHERE p.id = :id AND p.quantity >= :delta")
    int decrementQuantity(@Param("id") Long id, @Param("delta") int delta);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select p from Product p where p.id = :id")
    @QueryHints({@QueryHint(name = "javax.persistence.lock.timeout", value ="0")})
    public Product findOneById(@Param("id") Long id);
}