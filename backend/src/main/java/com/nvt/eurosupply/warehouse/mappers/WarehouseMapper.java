package com.nvt.eurosupply.warehouse.mappers;

import com.nvt.eurosupply.company.dtos.RegisterCompanyRequestDto;
import com.nvt.eurosupply.company.enums.RequestStatus;
import com.nvt.eurosupply.company.models.Company;
import com.nvt.eurosupply.shared.enums.FileFolder;
import com.nvt.eurosupply.shared.mappers.FileMapper;
import com.nvt.eurosupply.shared.models.PagedResponse;
import com.nvt.eurosupply.vehicle.dtos.VehicleResponseDto;
import com.nvt.eurosupply.vehicle.models.Vehicle;
import com.nvt.eurosupply.warehouse.dtos.CreateWarehouseRequestDto;
import com.nvt.eurosupply.warehouse.dtos.WarehouseResponseDto;
import com.nvt.eurosupply.warehouse.models.Warehouse;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class WarehouseMapper {

    private final ModelMapper modelMapper;
    private final FileMapper fileMapper;

    public Warehouse fromRequest(CreateWarehouseRequestDto request) {
        return Warehouse.builder()
                .name(request.getName())
                .address(request.getAddress())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .build();
    }

    public WarehouseResponseDto toResponse(Warehouse warehouse) {
        WarehouseResponseDto response = modelMapper.map(warehouse, WarehouseResponseDto.class);

        response.setImageUrls(
                Optional.ofNullable(warehouse.getImages())
                        .orElseGet(List::of)
                        .stream()
                        .map(f -> fileMapper.toResponse(
                                FileFolder.WAREHOUSE, warehouse.getId(), f))
                        .toList()
        );

        return response;
    }

    public PagedResponse<WarehouseResponseDto> toPagedResponse(Page<Warehouse> page) {
        return new PagedResponse<>(
                page.getContent().stream().map(this::toResponse).toList(),
                page.getTotalPages(),
                page.getTotalElements()
        );
    }
}