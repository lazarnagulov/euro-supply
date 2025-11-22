package com.nvt.eurosupply.shared.controllers;

import com.nvt.eurosupply.shared.dtos.CityResponseDto;
import com.nvt.eurosupply.shared.dtos.CountryResponseDto;
import com.nvt.eurosupply.shared.services.CountryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/countries")
@RequiredArgsConstructor
public class CountryController {

    private final CountryService service;

    @GetMapping
    public ResponseEntity<List<CountryResponseDto>> getCountries() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}/cities")
    public ResponseEntity<List<CityResponseDto>> getCountryCities(@PathVariable Long id) {
        return ResponseEntity.ok(service.getCountryCities(id));
    }

}
