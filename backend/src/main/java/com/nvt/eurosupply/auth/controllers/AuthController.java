package com.nvt.eurosupply.auth.controllers;

import com.nvt.eurosupply.auth.dtos.LoginRequestDto;
import com.nvt.eurosupply.auth.dtos.UserTokenState;
import com.nvt.eurosupply.auth.services.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService service;

    @PostMapping(value = "/login", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UserTokenState> createAuthenticationToken(@RequestBody LoginRequestDto request) {
        return ResponseEntity.ok(service.login(request));
    }

    @GetMapping("/authorize-file")
    public ResponseEntity<Void> authorize() {
        //TODO: Authorize file
        return ResponseEntity.ok().build();
    }
}