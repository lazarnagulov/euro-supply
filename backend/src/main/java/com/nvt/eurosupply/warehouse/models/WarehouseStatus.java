package com.nvt.eurosupply.warehouse.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(
        name = "warehouse_status",
        indexes = @Index(name = "idx_warehouse_status_warehouse", columnList = "warehouse_id")
)
public class WarehouseStatus {

    @Id
    private Long warehouseId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "warehouse_id")
    private Warehouse warehouse;

    private Boolean isOnline;
    private Instant lastHeartbeatAt;
}