package com.nvt.eurosupply.warehouse.services;

import com.nvt.eurosupply.shared.models.City;
import com.nvt.eurosupply.shared.models.Country;
import com.nvt.eurosupply.shared.services.CityService;
import com.nvt.eurosupply.shared.services.CountryService;
import com.nvt.eurosupply.warehouse.dtos.CreateWarehouseRequestDto;
import com.nvt.eurosupply.warehouse.dtos.WarehouseResponseDto;
import com.nvt.eurosupply.warehouse.mappers.WarehouseMapper;
import com.nvt.eurosupply.warehouse.models.Warehouse;
import com.nvt.eurosupply.warehouse.repositories.WarehouseRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WarehouseService {

    private final CityService cityService;
    private final CountryService countryService;

    private final WarehouseRepository repository;
    private final WarehouseMapper mapper;

    public WarehouseResponseDto createWarehouse(@Valid CreateWarehouseRequestDto request) {
        Warehouse warehouse = mapper.fromRequest(request);
        City city = cityService.find(request.getCityId());
        Country country = countryService.find(request.getCountryId());
        warehouse.setCity(city);
        warehouse.setCountry(country);
        return mapper.toResponse(repository.save(warehouse));
    }
}