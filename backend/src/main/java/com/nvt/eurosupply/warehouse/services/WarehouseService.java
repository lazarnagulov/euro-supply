package com.nvt.eurosupply.warehouse.services;

import com.nvt.eurosupply.factory.models.FactoryStatus;
import com.nvt.eurosupply.realtime.messages.SectorTemperatureMessage;
import com.nvt.eurosupply.realtime.messages.WarehouseReportMessage;
import com.nvt.eurosupply.shared.dtos.FileResponseDto;
import com.nvt.eurosupply.shared.enums.FileFolder;
import com.nvt.eurosupply.shared.mappers.FileMapper;
import com.nvt.eurosupply.shared.models.City;
import com.nvt.eurosupply.shared.models.Country;
import com.nvt.eurosupply.shared.models.PagedResponse;
import com.nvt.eurosupply.shared.models.StoredFile;
import com.nvt.eurosupply.shared.services.CityService;
import com.nvt.eurosupply.shared.services.CountryService;
import com.nvt.eurosupply.shared.services.FileService;
import com.nvt.eurosupply.warehouse.dtos.CreateWarehouseRequestDto;
import com.nvt.eurosupply.warehouse.dtos.UpdateWarehouseRequestDto;
import com.nvt.eurosupply.warehouse.dtos.WarehouseResponseDto;
import com.nvt.eurosupply.warehouse.dtos.WarehouseSearchRequestDto;
import com.nvt.eurosupply.warehouse.mappers.WarehouseMapper;
import com.nvt.eurosupply.warehouse.models.Warehouse;
import com.nvt.eurosupply.warehouse.models.WarehouseStatus;
import com.nvt.eurosupply.warehouse.repositories.SectorTemperatureRepository;
import com.nvt.eurosupply.warehouse.repositories.WarehouseRepository;
import com.nvt.eurosupply.warehouse.repositories.WarehouseStatusRepository;
import com.nvt.eurosupply.warehouse.specifications.WarehouseSpecification;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class WarehouseService {

    private final CityService cityService;
    private final CountryService countryService;
    private final FileService fileService;
    private final SectorService sectorService;

    private final WarehouseRepository repository;
    private final FileMapper fileMapper;
    private final WarehouseMapper mapper;
    private final SectorTemperatureRepository sectorTemperatureRepository;
    private final WarehouseStatusRepository statusRepository;

    public Warehouse find (Long id) {
        return repository.findById(id).orElseThrow(() -> new EntityNotFoundException("Warehouse not found"));
    }

    public WarehouseResponseDto createWarehouse(CreateWarehouseRequestDto request) {
        Warehouse warehouse = mapper.fromRequest(request);
        City city = cityService.find(request.getCityId());
        Country country = countryService.find(request.getCountryId());
        warehouse.setCity(city);
        warehouse.setCountry(country);
        Warehouse saved = repository.save(warehouse);
        sectorService.createSectors(request.getSectors(), warehouse);
        saveWarehouseInitialStatus(warehouse);
        return mapper.toResponse(saved);
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

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void deleteWarehouse(Long id) {
        Warehouse warehouse = find(id);

        List<Long> imageIds = warehouse.getImages().stream()
                .map(StoredFile::getId)
                .toList();

        deleteImagesInternal(warehouse, imageIds);
        repository.delete(warehouse);
    }

    public PagedResponse<WarehouseResponseDto> getWarehouses(Pageable pageable) {
        return mapper.toPagedResponse(repository.findAll(pageable));
    }

    public PagedResponse<WarehouseResponseDto> searchWarehouses(WarehouseSearchRequestDto request, Pageable pageable) {
        Specification<Warehouse> specification = WarehouseSpecification.search(request);
        return mapper.toPagedResponse(repository.findAll(specification, pageable));
    }

    public List<FileResponseDto> uploadImages(Long id, List<MultipartFile> images) {
        Warehouse warehouse = find(id);
        List<StoredFile> stored = fileService.uploadFiles(FileFolder.WAREHOUSE, id, images);
        warehouse.setImages(stored);
        repository.save(warehouse);

        return stored.stream()
                .map(file -> fileMapper.toResponse(FileFolder.WAREHOUSE, id, file))
                .toList();
    }

    private void deleteImagesInternal(Warehouse warehouse, List<Long> imageIds) {
        warehouse.getImages().clear();
        repository.saveAndFlush(warehouse);
        fileService.deleteFiles(imageIds);
    }

    @Transactional
    public void applyReport(WarehouseReportMessage report) {
        if (report.getTemperatures() == null || report.getTemperatures().isEmpty())
            return;

        Map<Long, Double> updates = report.getTemperatures().stream()
                .collect(Collectors.toMap(
                        SectorTemperatureMessage::getSectorId,
                        SectorTemperatureMessage::getTemperature
                ));

        int[] results = sectorTemperatureRepository.batchUpdateTemperature(updates, report.getTimestamp());

        int i = 0;
        for (Long sectorId : updates.keySet()) {
            if (results[i++] == 0) {
                throw new EntityNotFoundException("Sector not found: " + sectorId);
            }
        }
    }

    @Transactional
    @CacheEvict(value = "warehouseStatus", key = "#warehouseId")
    public void applyHeartbeat(Long warehouseId, Instant timestamp) {
        int updated = statusRepository.applyHeartbeat(warehouseId, timestamp);

        if (updated == 0)
            throw new EntityNotFoundException("Warehosue not found: " + warehouseId);
    }

    @Scheduled(fixedRate = 5 * 60 * 1000)
    @Transactional
    @CacheEvict(value = "warehouseStatus", allEntries = true)
    public void markFactoriesOffline() {
        Instant cutoff = Instant.now().minus(6, ChronoUnit.MINUTES);

        int updated = statusRepository.markOffline(cutoff);

        if (updated > 0)
            log.info("Marked {} factories as offline", updated);
    }

    private void saveWarehouseInitialStatus(Warehouse warehouse) {
        WarehouseStatus status = new WarehouseStatus();
        status.setWarehouseId(warehouse.getId());
        status.setWarehouse(warehouse);
        status.setIsOnline(false);
        statusRepository.save(status);
    }
}