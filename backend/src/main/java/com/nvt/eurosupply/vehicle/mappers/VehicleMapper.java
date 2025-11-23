package com.nvt.eurosupply.vehicle.mappers;

import com.nvt.eurosupply.company.dtos.CompanyResponseDto;
import com.nvt.eurosupply.shared.models.PagedResponse;
import com.nvt.eurosupply.vehicle.dtos.CreateVehicleRequestDto;
import com.nvt.eurosupply.vehicle.dtos.VehicleBrandDto;
import com.nvt.eurosupply.vehicle.dtos.VehicleModelDto;
import com.nvt.eurosupply.vehicle.dtos.VehicleResponseDto;
import com.nvt.eurosupply.vehicle.models.Vehicle;
import com.nvt.eurosupply.vehicle.models.VehicleBrand;
import com.nvt.eurosupply.vehicle.models.VehicleModel;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class VehicleMapper {

    private final ModelMapper modelMapper;

    public Vehicle fromCreateRequest(CreateVehicleRequestDto request) {
        return Vehicle.builder()
                .maxLoadKg(request.getMaxLoadKg())
                .registrationNumber(request.getRegistrationPlate())
                .build();
    }

    public VehicleResponseDto toResponse(Vehicle vehicle) {
        return modelMapper.map(vehicle, VehicleResponseDto.class);
    }

    public VehicleBrandDto toResponse(VehicleBrand brand) {
        return modelMapper.map(brand, VehicleBrandDto.class);
    }

    public VehicleModelDto toResponse(VehicleModel model) {
        return modelMapper.map(model, VehicleModelDto.class);
    }

    public PagedResponse<VehicleResponseDto> toPagedResponse(Page<Vehicle> page) {
        return new PagedResponse<>(
                page.getContent().stream().map(this::toResponse).toList(),
                page.getTotalPages(),
                page.getTotalElements()
        );
    }
}
