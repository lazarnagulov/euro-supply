package com.nvt.eurosupply.vehicle.services;

import com.nvt.eurosupply.vehicle.dtos.VehicleBrandDto;
import com.nvt.eurosupply.vehicle.dtos.VehicleModelDto;
import com.nvt.eurosupply.vehicle.mappers.VehicleMapper;
import com.nvt.eurosupply.vehicle.models.VehicleBrand;
import com.nvt.eurosupply.vehicle.repositories.VehicleBrandRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VehicleBrandService {

    private final VehicleBrandRepository repository;

    private final VehicleMapper mapper;

    public List<VehicleBrandDto> getBrands() {
        return repository.findAll().stream().map(mapper::toResponse).toList();
    }

    public List<VehicleModelDto> getBrandModels(Long id) {
        return find(id).getModels().stream().map(mapper::toResponse).toList();
    }

    public VehicleBrand find(Long id) {
        return repository.findById(id).orElseThrow(() -> new EntityNotFoundException("Brand not found"));
    }
}
