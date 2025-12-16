package com.nvt.eurosupply.company.mappers;

import com.nvt.eurosupply.company.dtos.CompanyResponseDto;
import com.nvt.eurosupply.company.dtos.RegisterCompanyRequestDto;
import com.nvt.eurosupply.company.models.Company;
import com.nvt.eurosupply.company.enums.RequestStatus;
import com.nvt.eurosupply.shared.dtos.FileResponseDto;
import com.nvt.eurosupply.shared.enums.FileFolder;
import com.nvt.eurosupply.shared.mappers.FileMapper;
import com.nvt.eurosupply.shared.models.PagedResponse;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class CompanyMapper {

    private final ModelMapper modelMapper;
    private final FileMapper fileMapper;

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
        CompanyResponseDto response =
                modelMapper.map(company, CompanyResponseDto.class);

        response.setFiles(
                Optional.ofNullable(company.getFiles())
                        .orElseGet(List::of)
                        .stream()
                        .map(f -> fileMapper.toResponse(
                                FileFolder.COMPANY, company.getId(), f))
                        .toList()
        );

        response.setCity(company.getCity().getName());
        response.setCountry(company.getCountry().getName());

        return response;
    }


    public PagedResponse<CompanyResponseDto> toPagedResponse(Page<Company> page) {
        return new PagedResponse<>(
                page.getContent().stream().map(this::toResponse).toList(),
                page.getTotalPages(),
                page.getTotalElements()
        );
    }
}
