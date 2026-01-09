package com.nvt.eurosupply.factory.models;

import com.nvt.eurosupply.product.models.Product;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "productions")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
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
}
