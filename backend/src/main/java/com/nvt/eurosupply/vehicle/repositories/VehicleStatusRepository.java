package com.nvt.eurosupply.vehicle.repositories;

import com.nvt.eurosupply.vehicle.models.VehicleStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;

public interface VehicleStatusRepository extends JpaRepository<VehicleStatus, Long> {

    @Modifying(clearAutomatically = true)
    @Query("""
        UPDATE VehicleStatus vs
        SET vs.lastHeartbeat = :timestamp,
            vs.isOnline = true
        WHERE vs.vehicleId = :vehicleId
    """)
    void applyHeartbeat(
            @Param("vehicleId") Long vehicleId,
            @Param("timestamp") Instant timestamp
    );

    @Query("""
        SELECT vs
        FROM VehicleStatus vs
        WHERE vs.isOnline = true
          AND vs.lastHeartbeat < :cutoff
    """)
    List<VehicleStatus> findOnlineVehiclesOlderThan(@Param("cutoff") Instant cutoff);

    @Modifying
    @Query("""
        UPDATE VehicleStatus vs
        SET vs.isOnline = false
        WHERE vs.isOnline = true
          AND vs.lastHeartbeat < :cutoff
    """)
    int markOffline(@Param("cutoff") Instant cutoff);
}
