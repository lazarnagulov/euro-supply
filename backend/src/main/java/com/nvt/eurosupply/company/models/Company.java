package com.nvt.eurosupply.company.models;

import com.nvt.eurosupply.shared.models.StoredFile;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@NoArgsConstructor
@Entity
@Table(name = "companies")
public class Company {
    // TODO: Add images, pdfs and owner
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 50, nullable = false)
    private String name;

    @Column(length = 50, nullable = false)
    private String address;

    @Column(length = 50, nullable = false)
    private String city;

    @Column(length = 50, nullable = false)
    private String country;

    private Double latitude;
    private Double longitude;

    @OneToMany
    private List<StoredFile> files;

    @Enumerated(EnumType.STRING)
    private RequestStatus status;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    public void onCreate() {
        this.createdAt = Instant.now();
    }
}
