package com.nvt.eurosupply.factory.models;

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
        name = "factory_status",
        indexes = @Index(name = "idx_factory_status_factory", columnList = "factory_id")
)
public class FactoryStatus {
    @Id
    private Long factoryId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "factory_id")
    private Factory factory;

    private Boolean isOnline;
    private Instant lastHeartbeatAt;
}
