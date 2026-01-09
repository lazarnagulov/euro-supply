package com.nvt.eurosupply.vehicle.models;

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
        name = "vehicle_status",
        indexes = @Index(name = "idx_vehicle_status_vehicle", columnList = "vehicle_id")
)
public class VehicleStatus {
    @Id
    private Long vehicleId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;

    private Boolean isOnline;
    private Instant lastHeartbeatAt;
}
