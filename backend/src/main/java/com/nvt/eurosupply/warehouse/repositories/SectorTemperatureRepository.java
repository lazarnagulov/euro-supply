package com.nvt.eurosupply.warehouse.repositories;

import com.nvt.eurosupply.warehouse.models.Sector;
import com.nvt.eurosupply.warehouse.models.SectorTemperature;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.Map;

public interface SectorTemperatureRepository extends JpaRepository<SectorTemperature, Long> { 

    default int[] batchUpdateTemperature(Map<Long, Double> updates, Instant measuredAt) {
        return updates.entrySet().stream()
                .mapToInt(entry -> updateSingleTemperature(entry.getKey(), entry.getValue(), measuredAt))
                .toArray();
    }

    @Modifying
    @Query("""
        UPDATE SectorTemperature st
        SET st.temperature = :temperature,
            st.updatedAt = :updatedAt
        WHERE st.sector.id = :sectorId
    """)
    int updateSingleTemperature(@Param("sectorId") Long sectorId,
                                @Param("temperature") Double temperature,
                                @Param("updatedAt") Instant updatedAt);

    List<SectorTemperature> findBySectorIn(List<Sector> sectors);

    @Modifying
    @Query("DELETE FROM SectorTemperature st WHERE st.sector.id IN :sectorIds")
    void deleteBySectorIdIn(@Param("sectorIds") List<Long> sectorIds);
}