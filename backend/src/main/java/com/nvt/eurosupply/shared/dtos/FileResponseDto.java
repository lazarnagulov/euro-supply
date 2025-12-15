package com.nvt.eurosupply.shared.dtos;

import com.nvt.eurosupply.shared.enums.FileType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FileResponseDto {
    private Long id;
    private String filename;
    private String contentType;
    private FileType type;
    private String url;
}
