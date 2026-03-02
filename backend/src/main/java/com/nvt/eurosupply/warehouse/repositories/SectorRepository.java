package com.nvt.eurosupply.warehouse.repositories;

import com.nvt.eurosupply.warehouse.dtos.WarehouseSectorResponse;
import com.nvt.eurosupply.warehouse.models.Sector;
import jakarta.transaction.Transactional;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SectorRepository extends JpaRepository<Sector, Long> {

    @Query("""
        SELECT new com.nvt.eurosupply.warehouse.dtos.WarehouseSectorResponse(s.id, s.name, st.temperature)
        FROM Sector s
        LEFT JOIN SectorTemperature st ON st.sector = s
        WHERE s.warehouse.id = :warehouseId
    """)
    Page<WarehouseSectorResponse> findSectorsWithTemperatureByWarehouseId(@Param("warehouseId") Long warehouseId, Pageable pageable);

    List<Sector> findByWarehouseId(Long warehouseId);

    @Modifying
    @Query("UPDATE Sector s SET s.name = :name WHERE s.id = :id AND s.warehouse.id = :warehouseId")
    void updateName(@Param("id") Long id, @Param("name") String name, @Param("warehouseId") Long warehouseId);

    void deleteByIdInAndWarehouseId(@NotNull List<Long> deleted, Long warehouseId);
}