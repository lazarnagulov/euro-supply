package com.nvt.eurosupply.vehicle.services;

import com.nvt.eurosupply.vehicle.repositories.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository repository;
}
