package com.nvt.eurosupply.product.repositories;

import com.nvt.eurosupply.product.models.ProductInventory;
import jakarta.persistence.LockModeType;
import jakarta.persistence.QueryHint;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

public interface ProductInventoryRepository extends JpaRepository<ProductInventory, Long>, ProductBatchOperations {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT i FROM ProductInventory i WHERE i.product.id = :productId")
    @QueryHints({@QueryHint(name = "javax.persistence.lock.timeout", value = "3000")})
    ProductInventory findByProductIdForUpdate(@Param("productId") Long productId);

    @Modifying
    @Query("UPDATE ProductInventory i SET i.quantity = i.quantity - :delta WHERE i.product.id = :productId AND i.quantity >= :delta")
    int decrementQuantity(@Param("productId") Long productId, @Param("delta") int delta);
}