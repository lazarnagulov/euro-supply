package com.nvt.eurosupply.user.controllers;

import com.nvt.eurosupply.user.dtos.AccountVerificationRequestDto;
import com.nvt.eurosupply.user.dtos.AuthRequestDto;
import com.nvt.eurosupply.user.dtos.AuthResponseDto;
import com.nvt.eurosupply.user.services.AccountVerificationService;
import com.nvt.eurosupply.user.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/users")
@RequiredArgsConstructor
@CrossOrigin
@Tag(name = "Users", description = "User management API")
public class UserController {

    private final UserService service;
    private final AccountVerificationService accountVerificationService;

    @Operation(
            summary = "User registration",
            description = "Registers a new user and sends an account verification email."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "User registered successfully"),
            @ApiResponse(responseCode = "400", description = "Validation error"),
            @ApiResponse(responseCode = "409", description = "User with this username or email already exists"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping(value = "/registration", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<AuthResponseDto> register(@Valid @RequestBody AuthRequestDto request) {
        return new ResponseEntity<>(service.register(request), HttpStatus.CREATED);
    }


    @Operation(
            summary = "Verifies user account",
            description = "Verifies a user account using the hash sent via email. The account will be activated upon successful verification."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Account verified successfully"),
            @ApiResponse(responseCode = "404", description = "User not found or hash is invalid"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PatchMapping("/verification")
    public ResponseEntity<String> verifyAccount(@RequestBody @Valid AccountVerificationRequestDto request) {
        accountVerificationService.verifyAccount(request);
        return ResponseEntity.ok("Account successfully activated!");
    }
}
