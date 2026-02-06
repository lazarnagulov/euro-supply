package com.nvt.eurosupply.warehouse.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WarehouseSearchRequestDto {
    private String name;
    private String address;
    private Long countryId;
    private Long cityId;
}
