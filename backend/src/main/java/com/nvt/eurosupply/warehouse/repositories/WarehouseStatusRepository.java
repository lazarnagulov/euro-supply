package com.nvt.eurosupply.warehouse.repositories;

import com.nvt.eurosupply.warehouse.models.WarehouseStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;

public interface WarehouseStatusRepository extends JpaRepository<WarehouseStatus, Long> {

    @Modifying(clearAutomatically = true)
    @Query("""
        UPDATE WarehouseStatus fs
        SET fs.lastHeartbeatAt = :timestamp,
            fs.isOnline = true
        WHERE fs.warehouseId = :warehouseId
    """)
    int applyHeartbeat(
            @Param("warehouseId") Long warehouseId,
            @Param("timestamp") Instant timestamp
    );

    @Modifying
    @Query("""
        UPDATE WarehouseStatus fs
        SET fs.isOnline = false
        WHERE fs.isOnline = true
          AND fs.lastHeartbeatAt < :cutoff
    """)
    int markOffline(@Param("cutoff") Instant cutoff);

}
