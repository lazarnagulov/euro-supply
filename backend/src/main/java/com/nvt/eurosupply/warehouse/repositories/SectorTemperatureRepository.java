package com.nvt.eurosupply.warehouse.repositories;

import com.nvt.eurosupply.warehouse.models.SectorTemperature;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.Map;

public interface SectorTemperatureRepository extends JpaRepository<SectorTemperature, Long> { }