package com.nvt.eurosupply.auth.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserTokenState {
    private Long userId;
    private String token;
    private Long expiresIn;
    private Boolean mustChangePassword;
}