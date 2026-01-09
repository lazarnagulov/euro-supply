package com.nvt.eurosupply.factory.repositories;

import com.nvt.eurosupply.factory.models.Factory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;

public interface FactoryRepository extends JpaRepository<Factory, Long>, JpaSpecificationExecutor<Factory> {
    @Modifying(clearAutomatically = true)
    @Query("""
        UPDATE Factory f
        SET f.lastHeartbeat = :timestamp,
            f.isOnline = true
        WHERE f.id = :factoryId
    """)
    int applyHeartbeat(
            @Param("factoryId") Long factoryId,
            @Param("timestamp") Instant timestamp
    );

    @Modifying
    @Query("""
        UPDATE Factory f
        SET f.isOnline = false
        WHERE f.isOnline = true
          AND f.lastHeartbeat < :cutoff
    """)
    int markOffline(@Param("cutoff") Instant cutoff);

}
