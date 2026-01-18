package com.nvt.eurosupply.factory.services;

import com.nvt.eurosupply.factory.dtos.CreateFactoryRequestDto;
import com.nvt.eurosupply.factory.dtos.FactoryResponseDto;
import com.nvt.eurosupply.factory.dtos.FactorySearchRequestDto;
import com.nvt.eurosupply.factory.dtos.UpdateFactoryRequestDto;
import com.nvt.eurosupply.factory.mappers.FactoryMapper;
import com.nvt.eurosupply.factory.models.Factory;
import com.nvt.eurosupply.factory.models.FactoryStatus;
import com.nvt.eurosupply.factory.models.Production;
import com.nvt.eurosupply.factory.repositories.FactoryRepository;
import com.nvt.eurosupply.factory.repositories.FactoryStatusRepository;
import com.nvt.eurosupply.factory.repositories.ProductionRepository;
import com.nvt.eurosupply.factory.specifications.FactorySpecification;
import com.nvt.eurosupply.product.models.Product;
import com.nvt.eurosupply.product.services.ProductService;
import com.nvt.eurosupply.realtime.messages.ProductionItemMessage;
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
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
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
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class FactoryService {

    private final FactoryRepository repository;
    private final ProductionRepository productionRepository;
    private final FactoryStatusRepository statusRepository;

    private final CityService cityService;
    private final CountryService countryService;
    private final FileService fileService;
    private final ProductService productService;
    private final ProductFactoryCleanupService cleanupService;

    private final FactoryMapper mapper;
    private final FileMapper fileMapper;

    public Factory find(Long id) {
        return repository.findById(id).orElseThrow(() -> new EntityNotFoundException("Factory not found"));
    }

    @Transactional
    public FactoryResponseDto createFactory(CreateFactoryRequestDto request) {
        Factory factory = mapper.fromRequest(request);

        City city = cityService.find(request.getCityId());
        Country country = countryService.find(request.getCountryId());
        factory.setCity(city);
        factory.setCountry(country);

        factory = repository.save(factory);

        FactoryStatus status = new FactoryStatus();
        status.setFactoryId(factory.getId());
        status.setFactory(factory);
        status.setIsOnline(false);
        statusRepository.save(status);

        return mapper.toResponse(factory, status);
    }

    @Transactional
    @CacheEvict(value = "factory", key = "#id")
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
    @CacheEvict(value = "factory", key = "#id")
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

    @Cacheable(value = "factory", key = "#id")
    public FactoryResponseDto getFactory(Long id) {
        return mapper.toResponse(find(id));
    }

    public PagedResponse<FactoryResponseDto> getFactories(Pageable pageable) {
        return mapper.toPagedResponse(repository.findAll(pageable));
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @CacheEvict(value = "factory", key = "#factoryId")
    public void deleteImages(Long factoryId, List<Long> imageIds) {
        Factory factory = find(factoryId);

        factory.getImages().removeIf(img -> imageIds.contains(img.getId()));
        repository.saveAndFlush(factory);

        fileService.deleteFiles(imageIds);
    }

    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "factory", key = "#id"),
            @CacheEvict(value = "factoryStatus", key = "#id"),
    })
    public void deleteFactory(Long id) {
        Factory factory = find(id);

        List<Long> imageIds = factory.getImages().stream()
                .map(StoredFile::getId)
                .toList();
        repository.saveAndFlush(factory);

        deleteImagesInternal(factory, imageIds);

        statusRepository.deleteById(id);
        cleanupService.deleteByFactoryId(id);
        repository.delete(factory);
    }

    private void deleteImagesInternal(Factory factory, List<Long> imageIds) {
        factory.getImages().clear();
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

    @Transactional
    public void saveProductions(ProductionReportMessage report) {
        Factory factory = find(report.getFactoryId());

        List<Long> productIds = report.getItems().stream()
                .map(ProductionItemMessage::getProductId)
                .distinct()
                .toList();

        Map<Long, Product> productsById =
                productService.findAllByIds(productIds).stream()
                        .collect(Collectors.toMap(Product::getId, p -> p));

        List<Production> productions = report.getItems().stream()
                .map(item -> Production.builder()
                        .factory(factory)
                        .product(productsById.get(item.getProductId()))
                        .quantity(item.getQuantity())
                        .build())
                .toList();

        productionRepository.saveAll(productions);
    }


    @Cacheable(value = "factoryStatus", key = "#id")
    public ConnectionStatusDto getFactoryStatus(Long id) {
        FactoryStatus status = statusRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Factory status not found"));
        return new ConnectionStatusDto(status.getIsOnline());
    }

    @Scheduled(fixedRate = 5 * 60 * 1000)
    @Transactional
    @CacheEvict(value = "factoryStatus", allEntries = true)
    public void markFactoriesOffline() {
        Instant cutoff = Instant.now().minus(6, ChronoUnit.MINUTES);

        int updated = statusRepository.markOffline(cutoff);

        if (updated > 0)
            log.info("Marked {} factories as offline", updated);
    }

    @Transactional
    @CacheEvict(value = "factoryStatus", key = "#factoryId")
    public void applyHeartbeat(Long factoryId, Instant timestamp) {
        int updated = statusRepository.applyHeartbeat(factoryId, timestamp);

        if (updated == 0)
            throw new EntityNotFoundException("Factory not found: " + factoryId);
    }
}
