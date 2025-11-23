package com.nvt.eurosupply.company.services;

import com.nvt.eurosupply.company.dtos.CompanyResponseDto;
import com.nvt.eurosupply.company.dtos.RegisterCompanyRequestDto;
import com.nvt.eurosupply.company.dtos.ReviewCompanyRequestDto;
import com.nvt.eurosupply.company.enums.RequestStatus;
import com.nvt.eurosupply.company.mappers.CompanyMapper;
import com.nvt.eurosupply.company.models.Company;
import com.nvt.eurosupply.company.repositories.CompanyRepository;
import com.nvt.eurosupply.email.services.CompanyEmailService;
import com.nvt.eurosupply.shared.dtos.FileResponseDto;
import com.nvt.eurosupply.shared.models.City;
import com.nvt.eurosupply.shared.models.Country;
import com.nvt.eurosupply.shared.models.PagedResponse;
import com.nvt.eurosupply.shared.models.StoredFile;
import com.nvt.eurosupply.shared.services.CityService;
import com.nvt.eurosupply.shared.services.CountryService;
import com.nvt.eurosupply.shared.services.FileService;
import com.nvt.eurosupply.user.models.User;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CityService cityService;
    private final CountryService countryService;
    private final FileService fileService;
    private final CompanyEmailService emailService;

    private final CompanyRepository repository;

    private final CompanyMapper mapper;

    private static final String FOLDER_NAME = "company";

    public CompanyResponseDto registerCompany(RegisterCompanyRequestDto request) {
        Company company = mapper.fromRequest(request);
        City city = cityService.find(request.getCityId());
        Country country = countryService.find(request.getCountryId());
        company.setCity(city);
        company.setCountry(country);
        // TODO: set owner (logged in user)
        User mockUser = new User();
        mockUser.setId(1L);
        company.setOwner(mockUser);

        return mapper.toResponse(repository.save(company));
    }

    public CompanyResponseDto getCompany(Long id) {
        Company company = find(id);
        CompanyResponseDto response = mapper.toResponse(company);
        response.setFiles(company.getFiles()
                .stream()
                .map(file -> fileService.toResponse(FOLDER_NAME, id, file))
                .toList());
        return response;
    }

    public CompanyResponseDto reviewCompany(Long id, ReviewCompanyRequestDto request) {
        Company company = find(id);
        company.setStatus(request.getStatus());
        Company saved = repository.save(company);
        User customer = company.getOwner();

        sendReviewEmail(company, customer, request.getStatus(), request.getRejectionReason());
        return mapper.toResponse(saved);
    }

    public List<FileResponseDto> uploadFiles(Long id, List<MultipartFile> files) {
        Company company = find(id);
        List<StoredFile> stored = fileService.uploadFiles(FOLDER_NAME, id, files);
        company.setFiles(stored);
        repository.save(company);

        return stored.stream()
                .map(file -> fileService.toResponse(FOLDER_NAME, id, file))
                .toList();
    }

    public Company find(Long id) {
        return repository.findById(id).orElseThrow(() -> new EntityNotFoundException("Company not found"));
    }

    private void sendReviewEmail(Company company, User customer, RequestStatus status, String rejectionReason) {
        if (status == RequestStatus.APPROVED) {
            emailService.sendApprovalEmail(company, customer.getEmail(), customer.getUsername());
        } else if (status == RequestStatus.REJECTED) {
            emailService.sendRejectionEmail(
                    company,
                    customer.getEmail(),
                    customer.getUsername(),
                    rejectionReason
            );
        }
    }

    public PagedResponse<CompanyResponseDto> getPendingCompanies(Pageable pageable) {
        return null;
    }
}
