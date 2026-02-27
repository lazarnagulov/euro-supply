package com.nvt.eurosupply.warehouse.repositories;

import com.nvt.eurosupply.warehouse.models.Sector;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SectorRepository extends JpaRepository<Sector, Long> { }