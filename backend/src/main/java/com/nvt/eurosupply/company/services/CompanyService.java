package com.nvt.eurosupply.company.services;

import com.nvt.eurosupply.company.dtos.CompanyResponseDto;
import com.nvt.eurosupply.company.dtos.CompanySummaryResponseDto;
import com.nvt.eurosupply.company.dtos.RegisterCompanyRequestDto;
import com.nvt.eurosupply.company.dtos.ReviewCompanyRequestDto;
import com.nvt.eurosupply.company.enums.RequestStatus;
import com.nvt.eurosupply.company.events.CompanyReviewedEvent;
import com.nvt.eurosupply.company.mappers.CompanyMapper;
import com.nvt.eurosupply.company.models.Company;
import com.nvt.eurosupply.company.repositories.CompanyRepository;
import com.nvt.eurosupply.email.services.CompanyEmailService;
import com.nvt.eurosupply.shared.dtos.FileResponseDto;
import com.nvt.eurosupply.shared.enums.FileFolder;
import com.nvt.eurosupply.shared.exceptions.BadRequestException;
import com.nvt.eurosupply.shared.mappers.FileMapper;
import com.nvt.eurosupply.shared.models.City;
import com.nvt.eurosupply.shared.models.Country;
import com.nvt.eurosupply.shared.models.PagedResponse;
import com.nvt.eurosupply.shared.models.StoredFile;
import com.nvt.eurosupply.shared.services.CityService;
import com.nvt.eurosupply.shared.services.CountryService;
import com.nvt.eurosupply.shared.services.FileService;
import com.nvt.eurosupply.user.models.User;
import com.nvt.eurosupply.user.services.UserService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CompanyService {

    private final CityService cityService;
    private final CountryService countryService;
    private final FileService fileService;
    private final CompanyEmailService emailService;

    private final CompanyRepository repository;

    private final CompanyMapper mapper;
    private final FileMapper fileMapper;
    private final UserService userService;

    private final ApplicationEventPublisher eventPublisher;

    public CompanyResponseDto registerCompany(RegisterCompanyRequestDto request) {
        Company company = mapper.fromRequest(request);
        City city = cityService.find(request.getCityId());
        Country country = countryService.find(request.getCountryId());
        company.setCity(city);
        company.setCountry(country);
        company.setOwner(userService.getCurrentUser());
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
                .map(file -> fileMapper.toResponse(FileFolder.COMPANY, id, file))
                .toList());

        return response;
    }

    @Transactional
    public CompanyResponseDto reviewCompany(Long id, ReviewCompanyRequestDto request) {
        Company company = find(id);

        if (company.getStatus() != RequestStatus.PENDING) {
            throw new BadRequestException("Company already reviewed");
        }

        company.setStatus(request.getStatus());
        company.setRejectionReason(request.getRejectionReason());
         company.setReviewedBy(userService.getCurrentUser());
        Company saved = repository.save(company);
        eventPublisher.publishEvent(
                new CompanyReviewedEvent(
                        saved,
                        saved.getOwner(),
                        request.getStatus(),
                        request.getRejectionReason()
                )
        );
        return mapper.toResponse(saved);
    }

    public List<FileResponseDto> uploadFiles(Long id, List<MultipartFile> files) {
        Company company = find(id);
        List<StoredFile> stored = fileService.uploadFiles(FileFolder.COMPANY, id, files);
        company.getFiles().addAll(stored);
        repository.save(company);

        return stored.stream()
                .map(file -> fileMapper.toResponse(FileFolder.COMPANY, id, file))
                .toList();
    }

    public Company find(Long id) {
        return repository.findById(id).orElseThrow(() -> new EntityNotFoundException("Company not found"));
    }

    public PagedResponse<CompanyResponseDto> getPendingCompanies(Pageable pageable) {
        return mapper.toPagedResponse(repository.findByStatus(RequestStatus.PENDING, pageable));
    }

    public List<CompanySummaryResponseDto> getCompaniesForCurrentUser() {
        User currentUser = userService.getCurrentUser();
        List<Company> companies = repository.findByOwnerId(currentUser.getId());
        return companies.stream().map(mapper::toSummaryResponse).toList();
    }
}
