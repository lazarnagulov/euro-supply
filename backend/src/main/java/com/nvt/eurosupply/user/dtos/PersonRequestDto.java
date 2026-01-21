package com.nvt.eurosupply.user.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PersonRequestDto {
    @NotBlank(message = "First name is required")
    private String firstname;

    @NotBlank(message = "Last name is required")
    private String lastname;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^(\\+)?\\d{9,15}$", message = "Invalid phone number format")
    private String phoneNumber;
}