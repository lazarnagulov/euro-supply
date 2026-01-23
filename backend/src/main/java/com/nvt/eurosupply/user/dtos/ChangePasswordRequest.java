package com.nvt.eurosupply.user.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ChangePasswordRequest {
    private Long userId;

    @NotBlank(message = "Old password is required")
    private String oldPassword;

    @NotBlank(message = "New password is required")
    private String newPassword;

    @NotBlank(message = "New password confirmation is required")
    private String passwordConfirmation;
}