package com.nvt.eurosupply.vehicle.repositories;

import com.nvt.eurosupply.vehicle.models.VehicleStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;

public interface VehicleStatusRepository extends JpaRepository<VehicleStatus, Long> {

    @Modifying(clearAutomatically = true)
    @Query("""
        UPDATE VehicleStatus vs
        SET vs.lastHeartbeatAt = :timestamp,
            vs.isOnline = true
        WHERE vs.vehicleId = :vehicleId
    """)
    int applyHeartbeat(
            @Param("vehicleId") Long vehicleId,
            @Param("timestamp") Instant timestamp
    );

    @Modifying
    @Query("""
        UPDATE VehicleStatus vs
        SET vs.isOnline = false
        WHERE vs.isOnline = true
          AND vs.lastHeartbeatAt < :cutoff
    """)
    int markOffline(@Param("cutoff") Instant cutoff);
}
