package com.nvt.eurosupply.vehicle.repositories;

import com.nvt.eurosupply.vehicle.models.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;

public interface VehicleRepository extends JpaRepository<Vehicle, Long>, JpaSpecificationExecutor<Vehicle> {

    @Modifying(clearAutomatically = true)
    @Query("""
        UPDATE Vehicle v
        SET v.lastHeartbeat = :timestamp,
            v.isOnline = true
        WHERE v.id = :vehicleId
    """)
    int applyHeartbeat(
            @Param("vehicleId") Long vehicleId,
            @Param("timestamp") Instant timestamp
    );

    @Modifying
    @Query("""
        UPDATE Vehicle v
        SET v.isOnline = false
        WHERE v.isOnline = true
          AND v.lastHeartbeat < :cutoff
    """)
    int markOffline(@Param("cutoff") Instant cutoff);

}
