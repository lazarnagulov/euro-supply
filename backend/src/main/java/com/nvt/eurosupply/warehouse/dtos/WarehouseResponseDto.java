package com.nvt.eurosupply.warehouse.dtos;

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
public class WarehouseResponseDto {
    private Long id;
    private String name;
    private String address;
    private CountryDto country;
    private CityDto city;
    private Double latitude;
    private Double longitude;
    private List<FileResponseDto> imageUrls;
}