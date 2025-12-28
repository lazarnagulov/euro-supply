package com.nvt.eurosupply.factory.mappers;

import com.nvt.eurosupply.factory.dtos.CreateFactoryRequestDto;
import com.nvt.eurosupply.factory.dtos.FactoryResponseDto;
import com.nvt.eurosupply.factory.models.Factory;
import com.nvt.eurosupply.shared.enums.FileFolder;
import com.nvt.eurosupply.shared.mappers.CityMapper;
import com.nvt.eurosupply.shared.mappers.CountryMapper;
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
public class FactoryMapper {

    private final ModelMapper modelMapper;
    private final FileMapper fileMapper;
    private final CityMapper cityMapper;
    private final CountryMapper countryMapper;

    public Factory fromRequest(CreateFactoryRequestDto request) {
        return Factory.builder()
                .name(request.getName())
                .address(request.getAddress())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .build();
    }

    public FactoryResponseDto toResponse(Factory factory) {
        FactoryResponseDto response =
                modelMapper.map(factory, FactoryResponseDto.class);

        response.setImageUrls(
                Optional.ofNullable(factory.getImages())
                        .orElseGet(List::of)
                        .stream()
                        .map(f -> fileMapper.toResponse(
                                FileFolder.FACTORY, factory.getId(), f))
                        .toList()
        );

        response.setCity(cityMapper.toResponse(factory.getCity()));
        response.setCountry(countryMapper.toResponse(factory.getCountry()));

        return response;
    }

    public PagedResponse<FactoryResponseDto> toPagedResponse(Page<Factory> page) {
        return new PagedResponse<>(
                page.getContent().stream().map(this::toResponse).toList(),
                page.getTotalPages(),
                page.getTotalElements()
        );
    }
}
