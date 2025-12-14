package com.nvt.eurosupply.vehicle.models;

import com.nvt.eurosupply.shared.models.StoredFile;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "vehicles")
@Builder
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String registrationNumber;

    @Column(nullable = false)
    private Double maxLoadKg;

    @ManyToOne(optional = false)
    private VehicleBrand brand;

    @ManyToOne(optional = false)
    private VehicleModel model;

    @OneToMany
    private List<StoredFile> images;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;
    private Instant updatedAt;
    
    @Version
    private Long version;

    @PrePersist
    public void onCreate() {
        this.createdAt = Instant.now();
    }
}
