package com.nvt.eurosupply.warehouse.services;

import com.nvt.eurosupply.warehouse.dtos.CreateSectorDto;
import com.nvt.eurosupply.warehouse.models.Sector;
import com.nvt.eurosupply.warehouse.models.SectorTemperature;
import com.nvt.eurosupply.warehouse.models.Warehouse;
import com.nvt.eurosupply.warehouse.repositories.SectorRepository;
import com.nvt.eurosupply.warehouse.repositories.SectorTemperatureRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SectorService {

    private final SectorRepository repository;
    private final SectorTemperatureRepository temperatureRepository;

    public void createSectors(List<CreateSectorDto> dtos, Warehouse warehouse) {
        List<Sector> sectors = dtos.stream().map(dto -> Sector.builder()
                        .name(dto.getName())
                        .warehouse(warehouse)
                        .build()).toList();

        List<Sector> saved = repository.saveAll(sectors);

        List<SectorTemperature> temperatures = saved.stream().map(sector -> SectorTemperature.builder()
                        .sector(sector)
                        .temperature(null)
                        .build()).toList();

        temperatureRepository.saveAll(temperatures);
    }
}
