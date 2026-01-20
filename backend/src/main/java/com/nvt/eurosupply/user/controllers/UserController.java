package com.nvt.eurosupply.user.controllers;

import com.nvt.eurosupply.user.dtos.AccountVerificationRequestDto;
import com.nvt.eurosupply.user.dtos.AuthRequestDto;
import com.nvt.eurosupply.user.dtos.AuthResponseDto;
import com.nvt.eurosupply.user.services.AccountVerificationService;
import com.nvt.eurosupply.user.services.UserService;
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

    @PostMapping(value = "/registration", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<AuthResponseDto> register(@Valid @RequestBody AuthRequestDto request) {
        return new ResponseEntity<>(service.register(request), HttpStatus.CREATED);
    }

    @PatchMapping("/verification")
    public ResponseEntity<String> verifyAccount(@RequestBody @Valid AccountVerificationRequestDto request) {
        accountVerificationService.verifyAccount(request);
        return ResponseEntity.ok("Account successfully activated!");
    }
}
