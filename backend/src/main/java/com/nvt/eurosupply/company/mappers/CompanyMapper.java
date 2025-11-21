package com.nvt.eurosupply.company.mappers;

import com.nvt.eurosupply.company.dtos.CompanyResponseDto;
import com.nvt.eurosupply.company.dtos.RegisterCompanyRequestDto;
import com.nvt.eurosupply.company.models.Company;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CompanyMapper {

    private final ModelMapper modelMapper;

    public Company fromRequest(RegisterCompanyRequestDto request) {
        return modelMapper.map(request, Company.class);
    }

    public CompanyResponseDto toResponse(Company company) {
        return modelMapper.map(company, CompanyResponseDto.class);
    }
}
