package com.nvt.eurosupply.factory.models;

import com.nvt.eurosupply.product.models.Production;
import com.nvt.eurosupply.shared.models.City;
import com.nvt.eurosupply.shared.models.Country;
import com.nvt.eurosupply.shared.models.StoredFile;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "factories")
@Builder
public class Factory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 50, nullable = false)
    private String address;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    private City city;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    private Country country;

    @Column(nullable = false)
    private Double latitude;
    @Column(nullable = false)
    private Double longitude;

    @Column(nullable = false)
    private Boolean isOnline = false;

    private Instant lastHeartbeat;

    @OneToMany
    private List<StoredFile> images;

    @OneToMany(mappedBy = "factory", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Production> productions = new ArrayList<>();

    @Column(nullable = false, updatable = false)
    private Instant createdAt;
    @Column(nullable = false)
    private Instant updatedAt;

    @Version
    private Long version;

    @PrePersist
    public void onCreate() {
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }
}
