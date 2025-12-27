package com.nvt.eurosupply.shared.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeleteImagesRequestDto {
    private List<Long> imageIds;
}
