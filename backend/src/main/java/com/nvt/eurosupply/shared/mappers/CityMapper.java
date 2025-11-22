package com.nvt.eurosupply.shared.mappers;

import com.nvt.eurosupply.shared.dtos.CityDto;
import com.nvt.eurosupply.shared.models.City;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CityMapper {

    private final ModelMapper modelMapper;

    public CityDto toResponse(City city) {
        return modelMapper.map(city, CityDto.class);
    }
}
