package com.nvt.eurosupply.vehicle.services;

import com.nvt.eurosupply.shared.dtos.FileResponseDto;
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
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository repository;
    private final VehicleBrandService brandService;
    private final FileService fileService;

    private final VehicleMapper mapper;

    private static final String FOLDER_NAME = "vehicle";

    public VehicleResponseDto createVehicle(CreateVehicleRequestDto request) {
        Vehicle vehicle = mapper.fromCreateRequest(request);
        VehicleBrand brand = brandService.findBrand(request.getBrandId());
        VehicleModel model = brandService.findModel(request.getModelId());
        vehicle.setBrand(brand);
        vehicle.setModel(model);
        return mapper.toResponse(repository.save(vehicle));
    }

    public List<FileResponseDto> uploadImages(Long id, List<MultipartFile> images) {
        Vehicle vehicle = find(id);
        List<StoredFile> stored = fileService.uploadFiles(FOLDER_NAME, id, images);
        vehicle.setImages(stored);
        repository.save(vehicle);

        return stored.stream()
                .map(file -> fileService.toResponse(FOLDER_NAME, id, file))
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

    public void deleteVehicle(Long id) {
        repository.delete(find(id));
    }

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

        // TODO: Update images once they are served with enginx
        return mapper.toResponse(repository.save(vehicle));
    }

    public void updateLocation(Long id, Location location) {
        Vehicle vehicle = find(id);
        vehicle.setLastLocation(location);
        repository.save(vehicle);
    }

    public PagedResponse<VehicleResponseDto> searchVehicles(VehicleSearchRequestDto request, Pageable pageable) {
        Specification<Vehicle> specification = VehicleSpecification.search(request);
        return mapper.toPagedResponse(repository.findAll(specification, pageable));
    }
}
