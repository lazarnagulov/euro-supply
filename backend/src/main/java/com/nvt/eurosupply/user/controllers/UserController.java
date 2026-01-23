package com.nvt.eurosupply.user.controllers;

import com.nvt.eurosupply.auth.services.AuthService;
import com.nvt.eurosupply.shared.dtos.FileResponseDto;
import com.nvt.eurosupply.shared.models.PagedResponse;
import com.nvt.eurosupply.user.dtos.*;
import com.nvt.eurosupply.user.services.AccountVerificationService;
import com.nvt.eurosupply.user.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URI;

@RestController
@RequestMapping("api/v1/users")
@RequiredArgsConstructor
@CrossOrigin
@Tag(name = "Users", description = "User management API")
public class UserController {

    private final UserService service;
    private final AccountVerificationService accountVerificationService;
    private final AuthService authService;

    @Operation(
            summary = "User registration",
            description = "Registers a new user and sends an account verification email."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "User registered successfully"),
            @ApiResponse(responseCode = "400", description = "Validation error"),
            @ApiResponse(responseCode = "409", description = "User with this username or email already exists"),
    })
    @PostMapping(value = "/registration", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<AuthResponseDto> register(@Valid @RequestBody AuthRequestDto request) {
        AuthResponseDto response = service.register(request);
        return ResponseEntity.created(URI.create("/api/v1/users" + response.getId())).body(response);
    }

    @Operation(
            summary = "Verifies user account",
            description = "Verifies a user account using the hash sent via email. The account will be activated upon successful verification."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Account verified successfully"),
            @ApiResponse(responseCode = "404", description = "User not found or hash is invalid"),
    })
    @PatchMapping("/verification")
    public ResponseEntity<String> verifyAccount(@RequestBody @Valid AccountVerificationRequestDto request) {
        accountVerificationService.verifyAccount(request);
        return ResponseEntity.ok("Account successfully activated!");
    }

    @Operation(
            summary = "Create manager (admin only)",
            description = "Creates a new manager account by admin. " +
                    "Manager must change password on first login. " +
                    "Email activation is skipped."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Manager created successfully"),
            @ApiResponse(responseCode = "400", description = "Validation error"),
            @ApiResponse(responseCode = "409", description = "Manager with this username or email already exists"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping(value = "/managers")
    public ResponseEntity<AuthResponseDto> createManager(
            @Valid @RequestBody AuthRequestDto request
    ) {
        AuthResponseDto response = service.registerManager(request);

        return ResponseEntity
                .created(URI.create("/api/v1/users/managers/" + response.getId()))
                .body(response);
    }

    @Operation(
            summary = "Upload users image",
            description = "Uploads one image for registered user."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Image uploaded successfully"),
            @ApiResponse(responseCode = "404", description = "User not found"),
            @ApiResponse(responseCode = "400", description = "Invalid image data"),
    })
    @PostMapping("/{id}/image")
    public ResponseEntity<FileResponseDto> uploadImage(@PathVariable Long id, @Valid @RequestBody MultipartFile image) {
        return ResponseEntity.ok(service.uploadImage(id, image));
    }

    @Operation(
            summary = "Suspend user",
            description = "Suspends a user by their ID."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "User suspended successfully"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PatchMapping("/{userId}/suspension")
    public ResponseEntity<Void> suspendUser(@PathVariable Long userId) {
        service.suspendUser(userId);
        return ResponseEntity.ok().build();
    }

    @Operation(
            summary = "Change user password",
            description = "Changes the password for a user." +
                    " Validates old password, password confirmation," +
                    " and ensures the new password is different from the old one."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Password changed successfully"),
            @ApiResponse(responseCode = "404", description = "User not found or password validation failed")
    })
    @PatchMapping("/password")
    public ResponseEntity<Void> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        service.changePassword(request);
        return ResponseEntity.ok().build();
    }

        @Operation(
                summary = "Search managers",
                description = "Searches managers using an optional keyword and returns a paginated list of matching results."
        )
        @ApiResponses({
                @ApiResponse(responseCode = "200", description = "Managers retrieved successfully")
        })
        @PreAuthorize("hasRole('ROLE_ADMIN')")
        @GetMapping("/managers")
        public ResponseEntity<PagedResponse<ManagerResponseDto>> getManagers(
                Pageable pageable,
                @RequestParam(required = false) String keyword
        ) {
            return ResponseEntity.ok(service.searchManagers(pageable, keyword));
        }


}
