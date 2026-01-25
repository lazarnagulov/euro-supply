package com.nvt.eurosupply.user.dtos;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponseDto {
    private Long id; // only id since profile needs to be activated
}