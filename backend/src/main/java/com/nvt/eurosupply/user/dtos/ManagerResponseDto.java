package com.nvt.eurosupply.user.dtos;

import com.nvt.eurosupply.shared.dtos.FileResponseDto;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ManagerResponseDto {
    private Long id;
    private String username;
    private String email;

    private String firstname;
    private String lastname;
    private String phoneNumber;
    private FileResponseDto imageUrl;

    private Boolean suspended;
}
