package com.nvt.eurosupply.shared.services;

import com.nvt.eurosupply.shared.dtos.CityResponseDto;
import com.nvt.eurosupply.shared.mappers.CityMapper;
import com.nvt.eurosupply.shared.repositories.CityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CityService {

    private final CityRepository repository;

    private final CityMapper mapper;

    public List<CityResponseDto> getAll() {
        return repository.findAll().stream()
                .map(mapper::toResponse).toList();
    }
}
