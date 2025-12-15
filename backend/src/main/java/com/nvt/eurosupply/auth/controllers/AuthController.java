package com.nvt.eurosupply.auth.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @GetMapping("/authorize-file")
    public ResponseEntity<Void> authorize() {
        //TODO: Authorize file
        return ResponseEntity.ok().build();
    }

}
