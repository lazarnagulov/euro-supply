package com.nvt.eurosupply.company.repositories;

import com.nvt.eurosupply.company.enums.RequestStatus;
import com.nvt.eurosupply.company.models.Company;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CompanyRepository extends JpaRepository<Company, Long> {

    Page<Company> findByStatus(RequestStatus status, Pageable pageable);
    List<Company> findByOwnerId(Long ownerId);
}