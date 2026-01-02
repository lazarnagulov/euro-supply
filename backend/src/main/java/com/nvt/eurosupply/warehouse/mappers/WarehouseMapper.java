package com.nvt.eurosupply.warehouse.mappers;

import com.nvt.eurosupply.company.dtos.RegisterCompanyRequestDto;
import com.nvt.eurosupply.company.enums.RequestStatus;
import com.nvt.eurosupply.company.models.Company;
import com.nvt.eurosupply.warehouse.dtos.CreateWarehouseRequestDto;
import com.nvt.eurosupply.warehouse.dtos.WarehouseResponseDto;
import com.nvt.eurosupply.warehouse.models.Warehouse;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class WarehouseMapper {

    private final ModelMapper modelMapper;

    public Warehouse fromRequest(CreateWarehouseRequestDto request) {
        return Warehouse.builder()
                .name(request.getName())
                .address(request.getAddress())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .build();
    }

    public WarehouseResponseDto toResponse(Warehouse warehouse) {
        return WarehouseResponseDto.builder().id(warehouse.getId()).build();
    }
}