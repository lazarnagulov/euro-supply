package com.nvt.eurosupply.warehouse.services;

import com.nvt.eurosupply.product.models.Category;
import com.nvt.eurosupply.shared.models.City;
import com.nvt.eurosupply.shared.models.Country;
import com.nvt.eurosupply.shared.services.CityService;
import com.nvt.eurosupply.shared.services.CountryService;
import com.nvt.eurosupply.warehouse.dtos.CreateWarehouseRequestDto;
import com.nvt.eurosupply.warehouse.dtos.UpdateWarehouseRequestDto;
import com.nvt.eurosupply.warehouse.dtos.WarehouseResponseDto;
import com.nvt.eurosupply.warehouse.mappers.WarehouseMapper;
import com.nvt.eurosupply.warehouse.models.Warehouse;
import com.nvt.eurosupply.warehouse.repositories.WarehouseRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
@RequiredArgsConstructor
public class WarehouseService {

    private final CityService cityService;
    private final CountryService countryService;

    private final WarehouseRepository repository;
    private final WarehouseMapper mapper;

    public Warehouse find (Long id) {
        return repository.findById(id).orElseThrow(() -> new EntityNotFoundException("Warehouse not found"));
    }

    public WarehouseResponseDto createWarehouse(CreateWarehouseRequestDto request) {
        Warehouse warehouse = mapper.fromRequest(request);
        City city = cityService.find(request.getCityId());
        Country country = countryService.find(request.getCountryId());
        warehouse.setCity(city);
        warehouse.setCountry(country);
        return mapper.toResponse(repository.save(warehouse));
    }

    public WarehouseResponseDto updateWarehouse(Long id, UpdateWarehouseRequestDto request) {
        Warehouse warehouse = find(id);

        warehouse.setName(request.getName());
        warehouse.setAddress(request.getAddress());
        warehouse.setLatitude(request.getLatitude());
        warehouse.setLongitude(request.getLongitude());

        if (!Objects.equals(warehouse.getCity().getId(), request.getCityId())) {
            City city = cityService.find(request.getCityId());
            warehouse.setCity(city);
        }

        if (!Objects.equals(warehouse.getCountry().getId(), request.getCountryId())) {
            Country country = countryService.find(request.getCountryId());
            warehouse.setCountry(country);
        }

        return mapper.toResponse(repository.save(warehouse));
    }

    public void deleteWarehouse(Long id) {
        repository.delete(find(id));
    }
}