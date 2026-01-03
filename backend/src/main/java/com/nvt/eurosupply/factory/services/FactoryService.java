package com.nvt.eurosupply.factory.services;

import com.nvt.eurosupply.factory.dtos.CreateFactoryRequestDto;
import com.nvt.eurosupply.factory.dtos.FactoryResponseDto;
import com.nvt.eurosupply.factory.dtos.FactorySearchRequestDto;
import com.nvt.eurosupply.factory.dtos.UpdateFactoryRequestDto;
import com.nvt.eurosupply.factory.mappers.FactoryMapper;
import com.nvt.eurosupply.factory.models.Factory;
import com.nvt.eurosupply.factory.models.Production;
import com.nvt.eurosupply.factory.repositories.FactoryRepository;
import com.nvt.eurosupply.factory.repositories.ProductionRepository;
import com.nvt.eurosupply.factory.specifications.FactorySpecification;
import com.nvt.eurosupply.product.models.Product;
import com.nvt.eurosupply.product.services.ProductService;
import com.nvt.eurosupply.realtime.messages.ProductionReportMessage;
import com.nvt.eurosupply.shared.dtos.ConnectionStatusDto;
import com.nvt.eurosupply.shared.dtos.FileResponseDto;
import com.nvt.eurosupply.shared.enums.FileFolder;
import com.nvt.eurosupply.shared.mappers.FileMapper;
import com.nvt.eurosupply.shared.models.City;
import com.nvt.eurosupply.shared.models.Country;
import com.nvt.eurosupply.shared.models.PagedResponse;
import com.nvt.eurosupply.shared.models.StoredFile;
import com.nvt.eurosupply.shared.services.CityService;
import com.nvt.eurosupply.shared.services.CountryService;
import com.nvt.eurosupply.shared.services.FileService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class FactoryService {

    private final FactoryRepository repository;
    private final ProductionRepository productionRepository;

    private final CityService cityService;
    private final CountryService countryService;
    private final FileService fileService;
    private final ProductService productService;

    private final FactoryMapper mapper;
    private final FileMapper fileMapper;

    public Factory find(Long id) {
        return repository.findById(id).orElseThrow(() -> new EntityNotFoundException("Factory not found"));
    }

    @Transactional
    public FactoryResponseDto createFactory(CreateFactoryRequestDto request) {
        Factory factory = mapper.fromRequest(request);
        factory.setIsOnline(false);
        City city = cityService.find(request.getCityId());
        Country country = countryService.find(request.getCountryId());
        factory.setCity(city);
        factory.setCountry(country);

        return mapper.toResponse(repository.save(factory));
    }

    @Transactional
    public List<FileResponseDto> uploadFiles(Long id, List<MultipartFile> images) {
        Factory factory = find(id);
        List<StoredFile> stored = fileService.uploadFiles(FileFolder.FACTORY, id, images);
        factory.getImages().addAll(stored);
        repository.save(factory);

        return stored.stream()
                .map(file -> fileMapper.toResponse(FileFolder.FACTORY, id, file))
                .toList();
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public FactoryResponseDto updateFactory(Long id, UpdateFactoryRequestDto request) {
        Factory factory = find(id);

        if (!Objects.equals(factory.getCity().getId(), request.getCityId())) {
            City city = cityService.find(request.getCityId());
            factory.setCity(city);
        }

        if (!Objects.equals(factory.getCountry().getId(), request.getCountryId())) {
            Country country = countryService.find(request.getCountryId());
            factory.setCountry(country);
        }

        factory.setName(request.getName());
        factory.setAddress(request.getAddress());
        factory.setLatitude(request.getLatitude());
        factory.setLongitude(request.getLongitude());
        factory.setUpdatedAt(Instant.now());

        return mapper.toResponse(repository.save(factory));
    }

    public FactoryResponseDto getFactory(Long id) {
        return mapper.toResponse(find(id));
    }

    public PagedResponse<FactoryResponseDto> getFactories(Pageable pageable) {
        return mapper.toPagedResponse(repository.findAll(pageable));
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void deleteImages(Long factoryId, List<Long> imageIds) {
        Factory factory = find(factoryId);

        factory.getImages().removeIf(img -> imageIds.contains(img.getId()));
        repository.saveAndFlush(factory);

        fileService.deleteFiles(imageIds);
    }

    @Transactional
    public void deleteFactory(Long id) {
        Factory factory = find(id);

        List<Long> imageIds = factory.getImages().stream()
                .map(StoredFile::getId)
                .toList();
        repository.saveAndFlush(factory);

        deleteImagesInternal(factory, imageIds);
        repository.delete(factory);
    }

    private void deleteImagesInternal(Factory factory, List<Long> imageIds) {
        factory.getImages().clear();
        repository.saveAndFlush(factory);
        fileService.deleteFiles(imageIds);
    }

    public PagedResponse<FactoryResponseDto> searchFactories(FactorySearchRequestDto request, Pageable pageable) {
        Specification<Factory> specification = FactorySpecification.search(request);
        return mapper.toPagedResponse(repository.findAll(specification, pageable));
    }

    public List<FactoryResponseDto> getFactoriesByProductId(Long id) {
        Product product = productService.find(id);
        return product.getProducingFactories().stream()
                .map(mapper::toResponse)
                .toList();
    }

    public void saveProductions(ProductionReportMessage report) {
        Factory factory = find(report.getFactoryId());

        List<Production> productions = report.getItems().stream()
                .map(item -> Production.builder()
                        .factory(factory)
                        .product(productService.find(item.getProductId()))
                        .quantity(item.getQuantity())
                        .productionDate(report.getProducedAt())
                        .build())
                .toList();

        productionRepository.saveAll(productions);
    }

    public ConnectionStatusDto getFactoryStatus(Long id) {
        Factory factory = find(id);
        return new ConnectionStatusDto(factory.getIsOnline());
    }

    @Scheduled(fixedRate = 5 * 60 * 1000)
    @Transactional
    public void markFactoriesOffline() {
        Instant cutoff = Instant.now().minus(6, ChronoUnit.MINUTES);

        int updated = repository.markOffline(cutoff);

        if (updated > 0)
            log.info("Marked {} factories as offline", updated);
    }

    @Transactional
    public void applyHeartbeat(Long factoryId, Instant timestamp) {
        int updated = repository.applyHeartbeat(factoryId, timestamp);

        if (updated == 0)
            throw new EntityNotFoundException("Factory not found: " + factoryId);
    }
}
