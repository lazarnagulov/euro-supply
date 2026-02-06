package com.nvt.eurosupply.factory.dtos;

import com.nvt.eurosupply.shared.dtos.CityDto;
import com.nvt.eurosupply.shared.dtos.CountryDto;
import com.nvt.eurosupply.shared.dtos.FileResponseDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FactoryResponseDto {
    private Long id;
    private String name;
    private String address;
    private CityDto city;
    private CountryDto country;
    private List<FileResponseDto> imageUrls;
    private Double latitude;
    private Double longitude;
    private Boolean online;
}
