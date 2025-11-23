package com.nvt.eurosupply.vehicle.services;

import com.nvt.eurosupply.shared.dtos.FileResponseDto;
import com.nvt.eurosupply.shared.models.PagedResponse;
import com.nvt.eurosupply.shared.models.StoredFile;
import com.nvt.eurosupply.shared.services.FileService;
import com.nvt.eurosupply.vehicle.dtos.CreateVehicleRequestDto;
import com.nvt.eurosupply.vehicle.dtos.VehicleBrandDto;
import com.nvt.eurosupply.vehicle.dtos.VehicleResponseDto;
import com.nvt.eurosupply.vehicle.mappers.VehicleMapper;
import com.nvt.eurosupply.vehicle.models.Vehicle;
import com.nvt.eurosupply.vehicle.repositories.VehicleRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository repository;
    private final FileService fileService;

    private final VehicleMapper mapper;

    private static final String FOLDER_NAME = "vehicle";

    public VehicleResponseDto createVehicle(CreateVehicleRequestDto request) {
        Vehicle vehicle = mapper.fromCreateRequest(request);
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
}
