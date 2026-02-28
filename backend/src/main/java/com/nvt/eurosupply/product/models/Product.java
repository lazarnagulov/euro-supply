package com.nvt.eurosupply.product.models;

import com.nvt.eurosupply.factory.models.Factory;
import com.nvt.eurosupply.shared.models.StoredFile;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "products")
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;
    @Column(nullable = false)
    private String description;

    @OneToOne(cascade = CascadeType.ALL)
    private StoredFile image;

    @Column(nullable = false)
    private Double price;
    @Column(nullable = false)
    private Double weight;

    @Column(nullable = false)
    private Boolean onSale;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id")
    private Category category;

    @OneToOne(mappedBy = "product", fetch = FetchType.LAZY)
    private ProductInventory inventory;

    @ManyToMany
    @JoinTable(
            name = "product_factory",
            joinColumns = @JoinColumn(name = "product_id"),
            inverseJoinColumns = @JoinColumn(name = "factory_id")
    )
    private List<Factory> producingFactories;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;
    @Column(nullable = false)
    private Instant updatedAt;

    @PrePersist
    public void onCreate() {
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }
}
