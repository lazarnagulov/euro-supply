package com.nvt.eurosupply.company.models;

import com.nvt.eurosupply.company.enums.RequestStatus;
import com.nvt.eurosupply.shared.models.City;
import com.nvt.eurosupply.shared.models.Country;
import com.nvt.eurosupply.shared.models.StoredFile;
import com.nvt.eurosupply.user.models.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "companies", indexes = { @Index(name = "idx_company_status", columnList = "status") })
@Builder
public class Company {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 50, nullable = false)
    private String name;

    @Column(length = 50, nullable = false)
    private String address;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private City city;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Country country;

    private Double latitude;
    private Double longitude;

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.MERGE)
    private List<StoredFile> files;

    @Enumerated(EnumType.STRING)
    private RequestStatus status;

    @Column(length = 200)
    private String rejectionReason;

    @ManyToOne(fetch = FetchType.LAZY)
    private User reviewedBy;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    private User owner;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Version
    private Long version;

    @PrePersist
    public void onCreate() {
        this.createdAt = Instant.now();
    }
}
