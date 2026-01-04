package com.nvt.eurosupply.warehouse.dtos;

import com.nvt.eurosupply.shared.dtos.FileResponseDto;
import com.nvt.eurosupply.shared.models.City;
import com.nvt.eurosupply.shared.models.Country;
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
    private Country country;
    private City city;
    private Double latitude;
    private Double longitude;
    private List<FileResponseDto> imageUrls;
}