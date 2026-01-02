package com.nvt.eurosupply.warehouse.repositories;

import com.nvt.eurosupply.warehouse.models.Warehouse;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WarehouseRepository extends JpaRepository<Warehouse, Long> { }