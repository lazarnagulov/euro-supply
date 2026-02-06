package com.nvt.eurosupply.company.repositories;

import com.nvt.eurosupply.company.dtos.CompanyResponseDto;
import com.nvt.eurosupply.company.enums.RequestStatus;
import com.nvt.eurosupply.company.models.Company;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CompanyRepository extends JpaRepository<Company, Long> {
    @Query("""
        SELECT new com.nvt.eurosupply.company.dtos.CompanyResponseDto(
            c.id,
            c.name,
            c.address,
            city.name,
            country.name,
            null,
            c.owner,
            c.latitude,
            c.longitude
        )
        FROM Company c
        JOIN c.city city
        JOIN c.country country
        WHERE c.status = :status
        """)
    Page<CompanyResponseDto> findByStatus(@Param("status") RequestStatus status, Pageable pageable);

    @Query("""
        SELECT c.id, f
        FROM Company c
        JOIN c.files f
        WHERE c.id IN :companyIds
    """)
    List<Object[]> findFilesForCompanies(@Param("companyIds") List<Long> companyIds);
    List<Company> findByOwnerIdAndStatus(Long ownerId, RequestStatus status);
}