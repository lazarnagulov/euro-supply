package com.nvt.eurosupply.company.mappers;

import com.nvt.eurosupply.company.dtos.CompanyResponseDto;
import com.nvt.eurosupply.company.dtos.RegisterCompanyRequestDto;
import com.nvt.eurosupply.company.models.Company;
import com.nvt.eurosupply.company.enums.RequestStatus;
import com.nvt.eurosupply.shared.models.PagedResponse;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CompanyMapper {

    private final ModelMapper modelMapper;

    public Company fromRequest(RegisterCompanyRequestDto request) {
        return Company.builder()
                .name(request.getName())
                .address(request.getAddress())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .status(RequestStatus.PENDING)
                .build();
    }

    public CompanyResponseDto toResponse(Company company) {
        return modelMapper.map(company, CompanyResponseDto.class);
    }
}
