package com.nvt.eurosupply.shared.dtos;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FileResponseDto {
    private Long id;
    private String filename;
    private String storedName;
    private String contentType;
    private String url;
}
