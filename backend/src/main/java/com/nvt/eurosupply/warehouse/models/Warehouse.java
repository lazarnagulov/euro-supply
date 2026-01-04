package com.nvt.eurosupply.warehouse.models;

import com.nvt.eurosupply.shared.models.City;
import com.nvt.eurosupply.shared.models.Country;
import com.nvt.eurosupply.shared.models.StoredFile;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "warehouses")
@Builder
public class Warehouse {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 50, nullable = false)
    private String name;

    @Column(length = 50, nullable = false)
    private String address;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    private City city;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    private Country country;

    @OneToMany
    private List<StoredFile> images;

    private Double latitude;
    
    private Double longitude;
}