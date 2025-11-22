package com.nvt.eurosupply.shared.controllers;


import com.nvt.eurosupply.shared.dtos.CityResponseDto;
import com.nvt.eurosupply.shared.dtos.CountryResponseDto;
import com.nvt.eurosupply.shared.services.CityService;
import com.nvt.eurosupply.shared.services.CountryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/cities")
@RequiredArgsConstructor
public class CityController {

    private final CityService service;

    @GetMapping
    public ResponseEntity<List<CityResponseDto>> getCountries() {
        return ResponseEntity.ok(service.getAll());
    }

}
