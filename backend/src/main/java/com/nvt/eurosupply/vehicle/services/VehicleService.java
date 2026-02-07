package com.nvt.eurosupply.vehicle.services;

import com.nvt.eurosupply.shared.dtos.ConnectionStatusDto;
import com.nvt.eurosupply.shared.dtos.FileResponseDto;
import com.nvt.eurosupply.shared.dtos.LocationResponseDto;
import com.nvt.eurosupply.shared.enums.FileFolder;
import com.nvt.eurosupply.shared.mappers.FileMapper;
import com.nvt.eurosupply.shared.mappers.LocationMapper;
import com.nvt.eurosupply.shared.models.Location;
import com.nvt.eurosupply.shared.models.PagedResponse;
import com.nvt.eurosupply.shared.models.StoredFile;
import com.nvt.eurosupply.shared.services.FileService;
import com.nvt.eurosupply.vehicle.dtos.CreateVehicleRequestDto;
import com.nvt.eurosupply.vehicle.dtos.UpdateVehicleRequestDto;
import com.nvt.eurosupply.vehicle.dtos.VehicleResponseDto;
import com.nvt.eurosupply.vehicle.dtos.VehicleSearchRequestDto;
import com.nvt.eurosupply.vehicle.events.StatusChangeEvent;
import com.nvt.eurosupply.vehicle.mappers.VehicleMapper;
import com.nvt.eurosupply.vehicle.models.*;
import com.nvt.eurosupply.vehicle.repositories.VehicleLocationRepository;
import com.nvt.eurosupply.vehicle.repositories.VehicleRepository;
import com.nvt.eurosupply.vehicle.repositories.VehicleStatusRepository;
import com.nvt.eurosupply.vehicle.specifications.VehicleSpecification;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
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
import java.util.Objects;
import java.util.function.Consumer;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class VehicleService {

    private final VehicleRepository repository;
    private final VehicleLocationRepository locationRepository;
    private final VehicleStatusRepository statusRepository;
    private final VehicleBrandService brandService;
    private final FileService fileService;

    private final VehicleMapper mapper;
    private final FileMapper fileMapper;
    private final LocationMapper locationMapper;

    @Setter
    private Consumer<StatusChangeEvent> statusChangeListener;
    @Setter
    private Consumer<List<StatusChangeEvent>> batchStatusChangeListener;

    @Transactional
    public VehicleResponseDto createVehicle(CreateVehicleRequestDto request) {
        Vehicle vehicle = mapper.fromCreateRequest(request);
        VehicleBrand brand = brandService.findBrand(request.getBrandId());
        VehicleModel model = brandService.findModel(request.getModelId());
        vehicle.setBrand(brand);
        vehicle.setModel(model);

        Vehicle createdVehicle = repository.save(vehicle);

        VehicleLocation location = new VehicleLocation();
        location.setVehicle(createdVehicle);
        locationRepository.save(location);

        VehicleStatus status = new VehicleStatus();
        status.setVehicle(createdVehicle);
        status.setIsOnline(false);
        statusRepository.save(status);

        return mapper.toResponse(createdVehicle, location, status);
    }

    @Transactional
    @CacheEvict(value = "vehicle", key = "#id")
    public List<FileResponseDto> uploadImages(Long id, List<MultipartFile> images) {
        Vehicle vehicle = find(id);
        List<StoredFile> stored = fileService.uploadFiles(FileFolder.VEHICLE, id, images);
        vehicle.getImages().addAll(stored);
        repository.save(vehicle);

        return stored.stream()
                .map(file -> fileMapper.toResponse(FileFolder.VEHICLE, id, file))
                .toList();
    }

    @Cacheable(value = "vehicle", key = "#id")
    public VehicleResponseDto getVehicle(Long id) {
        Vehicle vehicle = find(id);
        VehicleLocation location = locationRepository.findById(id).orElse(null);
        VehicleStatus status = statusRepository.findById(id).orElse(null);
        return mapper.toResponse(vehicle, location, status);
    }

    public PagedResponse<VehicleResponseDto> getVehicles(Pageable pageable) {
        return mapper.toPagedResponse(repository.findAll(pageable));
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @Caching(evict = {
            @CacheEvict(value = "vehicle", key = "#id"),
            @CacheEvict(value = "vehicleExists", key = "#id"),
    })
    public void deleteVehicle(Long id) {
        Vehicle vehicle = find(id);

        List<Long> imageIds = vehicle.getImages().stream()
                .map(StoredFile::getId)
                .toList();
        deleteImagesInternal(vehicle, imageIds);
        locationRepository.deleteById(id);
        statusRepository.deleteById(id);
        repository.delete(vehicle);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @CacheEvict(value = "vehicle", key = "#id")
    public VehicleResponseDto updateVehicle(Long id, UpdateVehicleRequestDto request) {
        Vehicle vehicle = find(id);

        if(!Objects.equals(vehicle.getBrand().getId(), request.getBrandId())) {
            VehicleBrand brand = brandService.findBrand(request.getBrandId());
            vehicle.setBrand(brand);
        }

        if(!Objects.equals(vehicle.getModel().getId(), request.getModelId())) {
            VehicleModel model = brandService.findModel(request.getModelId());
            vehicle.setModel(model);
        }

        vehicle.setMaxLoadKg(request.getMaxLoadKg());
        vehicle.setRegistrationNumber(request.getRegistrationNumber());
        vehicle.setUpdatedAt(Instant.now());

        return mapper.toResponse(repository.save(vehicle));
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void updateLocation(Long id, Location location) {
        VehicleLocation vehicleLocation = locationRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Vehicle location not found"));
        vehicleLocation.setLocation(location);
        vehicleLocation.setUpdatedAt(Instant.now());
        locationRepository.save(vehicleLocation);
    }

    public PagedResponse<VehicleResponseDto> searchVehicles(VehicleSearchRequestDto request, Pageable pageable) {
        Specification<Vehicle> specification = VehicleSpecification.search(request);
        return mapper.toPagedResponse(repository.findAll(specification, pageable));
    }

    @Transactional
    @CacheEvict(value = "vehicle", key = "#id")
    public void deleteImages(Long id, List<Long> imageIds) {
        Vehicle vehicle = find(id);
        vehicle.getImages().removeIf(img -> imageIds.contains(img.getId()));
        repository.saveAndFlush(vehicle);
        fileService.deleteFiles(imageIds);
    }

    private void deleteImagesInternal(Vehicle vehicle, List<Long> imageIds) {
        vehicle.getImages().clear();
        repository.saveAndFlush(vehicle);
        fileService.deleteFiles(imageIds);
    }

    public LocationResponseDto getVehicleLocation(Long id) {
        VehicleLocation vehicleLocation = locationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Vehicle location not found"));
        return locationMapper.toResponse(vehicleLocation.getLocation());
    }

    public ConnectionStatusDto getVehicleStatus(Long id) {
        VehicleStatus status = statusRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Vehicle status not found"));
        return new ConnectionStatusDto(status.getIsOnline());
    }

    @Scheduled(fixedRate = 5 * 60 * 1000)
    @Transactional
    public void markVehiclesOffline() {
        log.info("Updating vehicle status");
        Instant cutoff = Instant.now().minus(6, ChronoUnit.MINUTES);
        List<VehicleStatus> vehiclesToMarkOffline = statusRepository.findOnlineVehiclesOlderThan(cutoff);

        int updated = statusRepository.markOffline(cutoff);
        log.info("Marked {} vehicles as offline", updated);
        if (updated > 0 && batchStatusChangeListener != null && !vehiclesToMarkOffline.isEmpty()) {
            Instant now = Instant.now();
            List<StatusChangeEvent> events = vehiclesToMarkOffline.stream()
                    .map(status -> new StatusChangeEvent(status.getVehicleId(), false, now))
                    .toList();
            batchStatusChangeListener.accept(events);
        }
    }

    @Transactional
    public void applyHeartbeat(Long vehicleId, Instant timestamp) {
        VehicleStatus status = statusRepository.findById(vehicleId)
                .orElseThrow(() -> new EntityNotFoundException("Vehicle status not found: " + vehicleId));

        boolean wasOffline = !status.getIsOnline();
        statusRepository.applyHeartbeat(vehicleId, timestamp);

        if (wasOffline && statusChangeListener != null) {
            statusChangeListener.accept(new StatusChangeEvent(vehicleId, true, timestamp));
        }
    }

    @Cacheable(value = "vehicleExists", key = "#id")
    public boolean vehicleExists(Long id) {
        return repository.existsById(id);
    }

    public Vehicle find(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Vehicle not found"));
    }
}