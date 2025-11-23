package com.nvt.eurosupply.company.services;

import com.nvt.eurosupply.company.dtos.CompanyResponseDto;
import com.nvt.eurosupply.company.dtos.RegisterCompanyRequestDto;
import com.nvt.eurosupply.company.dtos.ReviewCompanyRequestDto;
import com.nvt.eurosupply.company.mappers.CompanyMapper;
import com.nvt.eurosupply.company.models.Company;
import com.nvt.eurosupply.company.repositories.CompanyRepository;
import com.nvt.eurosupply.shared.dtos.FileResponseDto;
import com.nvt.eurosupply.shared.models.City;
import com.nvt.eurosupply.shared.models.Country;
import com.nvt.eurosupply.shared.models.StoredFile;
import com.nvt.eurosupply.shared.services.CityService;
import com.nvt.eurosupply.shared.services.CountryService;
import com.nvt.eurosupply.shared.services.FileService;
import com.nvt.eurosupply.user.models.User;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CityService cityService;
    private final CountryService countryService;
    private final FileService fileService;

    private final CompanyRepository repository;

    private final CompanyMapper mapper;

    public CompanyResponseDto registerCompany(RegisterCompanyRequestDto request) {
        Company company = mapper.fromRequest(request);
        City city = cityService.find(request.getCityId());
        Country country = countryService.find(request.getCountryId());
        company.setCity(city);
        company.setCountry(country);
        // TODO: set owner (logged in user)
        company.setOwner(new User());

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

    public List<FileResponseDto> uploadFiles(Long id, List<MultipartFile> files) {
        List<StoredFile> stored = fileService.uploadFiles("company", id, files);

        return stored.stream()
                .map(file -> fileService.toResponse("company", id, file))
                .toList();
    }

    public Company find(Long id) {
        return repository.findById(id).orElseThrow(() -> new EntityNotFoundException("Company not found"));
    }
}
