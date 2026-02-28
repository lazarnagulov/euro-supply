package com.nvt.eurosupply.warehouse.services;

import com.nvt.eurosupply.warehouse.dtos.CreateSectorDto;
import com.nvt.eurosupply.warehouse.dtos.WarehouseSectorResponse;
import com.nvt.eurosupply.warehouse.models.Sector;
import com.nvt.eurosupply.warehouse.models.SectorTemperature;
import com.nvt.eurosupply.warehouse.models.Warehouse;
import com.nvt.eurosupply.warehouse.repositories.SectorRepository;
import com.nvt.eurosupply.warehouse.repositories.SectorTemperatureRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
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

    public Page<WarehouseSectorResponse> findSectorsWithTemperatureByWarehouseId(Long warehouseId, int page, int size) {
        return repository.findSectorsWithTemperatureByWarehouseId(warehouseId, PageRequest.of(page, size));
    }

    @Transactional
    public void deleteSectorAndTemperatures(Long warehouseId) {
        List<Sector> sectors = repository.findByWarehouseId(warehouseId);

        // for every sector delete temperatures
        List<SectorTemperature> temperatures = temperatureRepository.findBySectorIn(sectors);
        temperatureRepository.deleteAll(temperatures);

        // delete sectors
        temperatureRepository.deleteAll(temperatures);
        repository.deleteAll(sectors);

        // then statuses will be deleted, and at the end warehouse
    }
}