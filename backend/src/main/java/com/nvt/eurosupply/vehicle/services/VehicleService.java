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
import com.nvt.eurosupply.vehicle.mappers.VehicleMapper;
import com.nvt.eurosupply.vehicle.models.Vehicle;
import com.nvt.eurosupply.vehicle.models.VehicleBrand;
import com.nvt.eurosupply.vehicle.models.VehicleModel;
import com.nvt.eurosupply.vehicle.repositories.VehicleRepository;
import com.nvt.eurosupply.vehicle.specifications.VehicleSpecification;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class VehicleService {

    private final VehicleRepository repository;
    private final VehicleBrandService brandService;
    private final FileService fileService;

    private final VehicleMapper mapper;
    private final FileMapper fileMapper;
    private final LocationMapper locationMapper;

    @Transactional
    public VehicleResponseDto createVehicle(CreateVehicleRequestDto request) {
        Vehicle vehicle = mapper.fromCreateRequest(request);
        VehicleBrand brand = brandService.findBrand(request.getBrandId());
        VehicleModel model = brandService.findModel(request.getModelId());
        vehicle.setBrand(brand);
        vehicle.setModel(model);
        vehicle.setIsOnline(false);
        return mapper.toResponse(repository.save(vehicle));
    }

    @Transactional
    public List<FileResponseDto> uploadImages(Long id, List<MultipartFile> images) {
        Vehicle vehicle = find(id);
        List<StoredFile> stored = fileService.uploadFiles(FileFolder.VEHICLE, id, images);
        vehicle.getImages().addAll(stored);
        repository.save(vehicle);

        return stored.stream()
                .map(file -> fileMapper.toResponse(FileFolder.VEHICLE, id, file))
                .toList();
    }

    public Vehicle find(Long id) {
        return repository.findById(id).orElseThrow(() -> new EntityNotFoundException("Vehicle not found"));
    }

    public VehicleResponseDto getVehicle(Long id) {
        return mapper.toResponse(find(id));
    }

    public PagedResponse<VehicleResponseDto> getVehicles(Pageable pageable) {
        return mapper.toPagedResponse(repository.findAll(pageable));
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void deleteVehicle(Long id) {
        Vehicle vehicle = find(id);

        List<Long> imageIds = vehicle.getImages().stream()
                .map(StoredFile::getId)
                .toList();
        deleteImagesInternal(vehicle, imageIds);
        repository.delete(vehicle);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
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
        Vehicle vehicle = find(id);
        vehicle.setLastLocation(location);
        repository.save(vehicle);
    }

    public PagedResponse<VehicleResponseDto> searchVehicles(VehicleSearchRequestDto request, Pageable pageable) {
        Specification<Vehicle> specification = VehicleSpecification.search(request);
        return mapper.toPagedResponse(repository.findAll(specification, pageable));
    }

    @Transactional
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
        Vehicle vehicle = find(id);
        return locationMapper.toResponse(vehicle.getLastLocation());
    }

    public ConnectionStatusDto getVehicleStatus(Long id) {
        Vehicle vehicle = find(id);
        return new ConnectionStatusDto(vehicle.getIsOnline());
    }

    @Scheduled(fixedRate = 5 * 60 * 1000)
    @Transactional
    public void markVehiclesOffline() {
        log.info("Updating vehicle status");
        Instant cutoff = Instant.now().minus(6, ChronoUnit.MINUTES);

        int updated = repository.markOffline(cutoff);

        if (updated > 0) {
            log.info("Marked {} vehicles as offline", updated);
        }
    }

    @Transactional
    public void applyHeartbeat(Long vehicleId, Instant timestamp) {
        int updated = repository.applyHeartbeat(vehicleId, timestamp);

        if (updated == 0) {
            throw new EntityNotFoundException("Vehicle not found: " + vehicleId);
        }
    }
}
