package com.nvt.eurosupply.warehouse.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateSectorsRequestDto {

    @NotNull
    private List<AddedSectorDto> added = new ArrayList<>();

    @NotNull
    private List<UpdatedSectorDto> updated = new ArrayList<>();

    @NotNull
    private List<Long> deleted = new ArrayList<>();

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AddedSectorDto {
        @NotBlank
        @Size(max = 50)
        private String name;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdatedSectorDto {
        @NotNull
        private Long id;

        @NotBlank
        @Size(max = 50)
        private String name;
    }
}