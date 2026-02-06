package com.nvt.eurosupply.shared.services;

import com.nvt.eurosupply.shared.dtos.CityDto;
import com.nvt.eurosupply.shared.mappers.CityMapper;
import com.nvt.eurosupply.shared.models.City;
import com.nvt.eurosupply.shared.repositories.CityRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CityService {

    private final CityRepository repository;

    private final CityMapper mapper;

    @Cacheable(value = "cities")
    public List<CityDto> getAll() {
        return repository.findAll().stream()
                .map(mapper::toResponse).toList();
    }

    public City find(Long id) {
        return repository.findById(id).orElseThrow(() -> new EntityNotFoundException("City not found"));
    }
}
