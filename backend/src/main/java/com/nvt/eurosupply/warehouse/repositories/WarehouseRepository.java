package com.nvt.eurosupply.warehouse.repositories;

import com.nvt.eurosupply.warehouse.models.Warehouse;
import jakarta.persistence.LockModeType;
import jakarta.persistence.QueryHint;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

public interface WarehouseRepository extends JpaRepository<Warehouse, Long>, JpaSpecificationExecutor<Warehouse> {
        @Lock(LockModeType.PESSIMISTIC_WRITE)
        @Query("select w from Warehouse w where w.id = :id")
        @QueryHints({@QueryHint(name = "javax.persistence.lock.timeout", value ="0")})
        Warehouse findOneById(@Param("id") Long id);
}