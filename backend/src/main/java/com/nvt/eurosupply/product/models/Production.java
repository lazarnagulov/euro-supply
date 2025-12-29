package com.nvt.eurosupply.product.models;

import com.nvt.eurosupply.factory.models.Factory;
import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(
        name = "productions",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"factory_id", "product_id", "produced_at"})
        }
)
public class Production {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "factory_id")
    private Factory factory;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private Instant producedAt;
}
