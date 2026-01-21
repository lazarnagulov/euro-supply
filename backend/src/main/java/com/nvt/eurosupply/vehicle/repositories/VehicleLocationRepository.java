package com.nvt.eurosupply.vehicle.repositories;

import com.nvt.eurosupply.vehicle.models.VehicleLocation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VehicleLocationRepository extends JpaRepository<VehicleLocation, Long> {
}
