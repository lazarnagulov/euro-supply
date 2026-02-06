package com.nvt.eurosupply.company.dtos;

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
public class CompanyResponseDto {
    private Long id;
    private String name;
    private String address;
    private String city;
    private String country;
    private List<FileResponseDto> files;
    private String username;
    private String email;
    private Double latitude;
    private Double longitude;
}
