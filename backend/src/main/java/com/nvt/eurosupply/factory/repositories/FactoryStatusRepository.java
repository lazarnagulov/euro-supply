package com.nvt.eurosupply.factory.repositories;

import com.nvt.eurosupply.factory.models.FactoryStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;

public interface FactoryStatusRepository extends JpaRepository<FactoryStatus, Long> {
    @Modifying(clearAutomatically = true)
    @Query("""
        UPDATE FactoryStatus fs
        SET fs.lastHeartbeatAt = :timestamp,
            fs.isOnline = true
        WHERE fs.factoryId = :factoryId
    """)
    int applyHeartbeat(
            @Param("factoryId") Long factoryId,
            @Param("timestamp") Instant timestamp
    );

    @Modifying
    @Query("""
        UPDATE FactoryStatus fs
        SET fs.isOnline = false
        WHERE fs.isOnline = true
          AND fs.lastHeartbeatAt < :cutoff
    """)
    int markOffline(@Param("cutoff") Instant cutoff);

}
