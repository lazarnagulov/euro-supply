package com.nvt.eurosupply.warehouse.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "sector_temperatures")
public class SectorTemperature {
    @Id
    private Long sectorId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "sector_id")
    private Sector sector;

    private Double temperature;

    @UpdateTimestamp
    private Instant updatedAt;
}
