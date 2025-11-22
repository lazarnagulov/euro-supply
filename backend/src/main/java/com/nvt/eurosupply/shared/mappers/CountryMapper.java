package com.nvt.eurosupply.shared.mappers;

import com.nvt.eurosupply.shared.dtos.CountryResponseDto;
import com.nvt.eurosupply.shared.models.Country;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CountryMapper {
    private final ModelMapper modelMapper;

    public CountryResponseDto toResponse(Country country) {
        return modelMapper.map(country, CountryResponseDto.class);
    }
}
