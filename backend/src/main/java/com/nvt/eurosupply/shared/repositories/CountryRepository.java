package com.nvt.eurosupply.shared.repositories;

import com.nvt.eurosupply.shared.models.Country;
import org.springframework.data.jpa.repository.JpaRepository;


public interface CountryRepository extends JpaRepository<Country, Long> {
}
