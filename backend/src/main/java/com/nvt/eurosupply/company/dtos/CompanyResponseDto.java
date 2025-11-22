package com.nvt.eurosupply.company.dtos;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CompanyResponseDto {
    private Long id;
    private String name;
    private String address;
    private String city;
    private String country;
}
