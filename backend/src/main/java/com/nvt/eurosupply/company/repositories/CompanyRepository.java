package com.nvt.eurosupply.company.repositories;

import com.nvt.eurosupply.company.models.Company;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanyRepository extends JpaRepository<Company, Long> {
}
