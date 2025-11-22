package com.nvt.eurosupply.company.services;

import com.nvt.eurosupply.company.dtos.CompanyResponseDto;
import com.nvt.eurosupply.company.dtos.RegisterCompanyRequestDto;
import com.nvt.eurosupply.company.dtos.ReviewCompanyRequestDto;
import com.nvt.eurosupply.company.mappers.CompanyMapper;
import com.nvt.eurosupply.company.models.Company;
import com.nvt.eurosupply.company.repositories.CompanyRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository repository;

    private final CompanyMapper mapper;

    public CompanyResponseDto registerCompany(RegisterCompanyRequestDto request) {
        Company company = mapper.fromRequest(request);
        // TODO: set owner (logged in user)

        return mapper.toResponse(repository.save(company));
    }

    public CompanyResponseDto getCompany(Long id) {
        return mapper.toResponse(find(id));
    }

    public CompanyResponseDto reviewCompany(Long id, ReviewCompanyRequestDto request) {
        Company company = find(id);
        company.setStatus(request.getStatus());
        return mapper.toResponse(repository.save(company));
    }

    public Company find(Long id) {
        return repository.findById(id).orElseThrow(() -> new EntityNotFoundException("Company not found"));
    }
}
