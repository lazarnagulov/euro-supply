package com.nvt.eurosupply.auth.controllers;

import com.nvt.eurosupply.auth.dtos.LoginRequestDto;
import com.nvt.eurosupply.auth.dtos.UserTokenState;
import com.nvt.eurosupply.auth.services.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication and Authorization", description = "Authentication and Authorization API")
public class AuthController {

    private final AuthService service;

    @Operation(
            summary = "User login",
            description = "Authenticates a user using username and password, and returns an access token and expiration info."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Login successful"),
            @ApiResponse(responseCode = "400", description = "Validation error"),
            @ApiResponse(responseCode = "401", description = "Invalid username or password"),
            @ApiResponse(responseCode = "403", description = "Account is not verified"),
            @ApiResponse(responseCode = "423", description = "Account is suspended"),
    })
    @PostMapping(value = "/login", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UserTokenState> createAuthenticationToken(@Valid @RequestBody LoginRequestDto request) {
        return ResponseEntity.ok(service.login(request));
    }

    @Operation(
            summary = "Authorize file access",
            description = "Checks whether the currently authenticated user is authorized to access a protected file."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "User is authorized to access the file"),
            @ApiResponse(responseCode = "401", description = "User is not authenticated"),
            @ApiResponse(responseCode = "403", description = "User is not authorized to access the file"),
    })
    @GetMapping("/authorize-file")
    public ResponseEntity<Void> authorizeFile(@RequestHeader("X-Original-URI") String originalUri) {
        service.authorizeFile(originalUri);
        return ResponseEntity.ok().build();
    }
}