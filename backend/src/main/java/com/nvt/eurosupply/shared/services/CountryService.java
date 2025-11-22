package com.nvt.eurosupply.shared.services;

import com.nvt.eurosupply.shared.dtos.CityDto;
import com.nvt.eurosupply.shared.dtos.CountryDto;
import com.nvt.eurosupply.shared.mappers.CityMapper;
import com.nvt.eurosupply.shared.mappers.CountryMapper;
import com.nvt.eurosupply.shared.models.Country;
import com.nvt.eurosupply.shared.repositories.CountryRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CountryService {

    private final CountryRepository repository;

    private final CountryMapper mapper;
    private final CityMapper cityMapper;

    public List<CountryDto> getAll() {
        return repository.findAll().stream()
                .map(mapper::toResponse).toList();
    }

    public List<CityDto> getCountryCities(Long id) {
        return find(id).getCities().stream().map(cityMapper::toResponse).toList();
    }

    public Country find(Long id) {
        return repository.findById(id).orElseThrow(() -> new EntityNotFoundException("Country not found"));
    }

}
