package com.nvt.eurosupply.shared.repositories;

import com.nvt.eurosupply.shared.models.City;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CityRepository extends JpaRepository<City, Long> {
}
