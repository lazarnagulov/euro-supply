package com.nvt.eurosupply.vehicle.mappers;

import com.nvt.eurosupply.company.dtos.CompanyResponseDto;
import com.nvt.eurosupply.shared.models.PagedResponse;
import com.nvt.eurosupply.vehicle.dtos.CreateVehicleRequestDto;
import com.nvt.eurosupply.vehicle.dtos.VehicleResponseDto;
import com.nvt.eurosupply.vehicle.models.Vehicle;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class VehicleMapper {

    private final ModelMapper modelMapper;

    public Vehicle fromCreateRequest(CreateVehicleRequestDto request) {
        return modelMapper.map(request, Vehicle.class);
    }

    public VehicleResponseDto toResponse(Vehicle vehicle) {
        VehicleResponseDto response = modelMapper.map(vehicle, VehicleResponseDto.class);
        response.setBrand(vehicle.getBrand().getName());
        response.setModel(vehicle.getModel().getName());
        return response;
    }

    public PagedResponse<VehicleResponseDto> toPagedResponse(Page<Vehicle> page) {
        return new PagedResponse<>(
                page.getContent().stream().map(this::toResponse).toList(),
                page.getTotalPages(),
                page.getTotalElements()
        );
    }
}
