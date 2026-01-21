package com.nvt.eurosupply.vehicle.models;

import com.nvt.eurosupply.shared.models.Location;
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
        name = "vehicle_locations",
        indexes = @Index(name = "idx_vehicle_location_vehicle", columnList = "vehicle_id")
)
public class VehicleLocation {
    @Id
    private Long vehicleId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;

    @Embedded
    private Location location;

    private Instant updatedAt;
}
