package com.nvt.eurosupply.product.services;

import com.nvt.eurosupply.company.models.Company;
import com.nvt.eurosupply.company.services.CompanyService;
import com.nvt.eurosupply.email.services.ProductEmailService;
import com.nvt.eurosupply.factory.dtos.FactoryProductListItemDto;
import com.nvt.eurosupply.factory.repositories.FactoryRepository;
import com.nvt.eurosupply.product.dtos.*;
import com.nvt.eurosupply.product.exceptions.InsufficientStockException;
import com.nvt.eurosupply.product.mappers.OrderMapper;
import com.nvt.eurosupply.product.mappers.ProductMapper;
import com.nvt.eurosupply.product.models.Category;
import com.nvt.eurosupply.product.models.Order;
import com.nvt.eurosupply.product.models.Product;
import com.nvt.eurosupply.product.repositories.OrderRepository;
import com.nvt.eurosupply.product.repositories.ProductRepository;
import com.nvt.eurosupply.product.specifications.ProductSpecification;
import com.nvt.eurosupply.realtime.messages.ProductionItemMessage;
import com.nvt.eurosupply.realtime.messages.ProductionReportMessage;
import com.nvt.eurosupply.shared.dtos.FileResponseDto;
import com.nvt.eurosupply.shared.enums.FileFolder;
import com.nvt.eurosupply.shared.mappers.FileMapper;
import com.nvt.eurosupply.shared.models.PagedResponse;
import com.nvt.eurosupply.shared.models.StoredFile;
import com.nvt.eurosupply.shared.services.FileService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository repository;
    private final ProductMapper mapper;

    private final CategoryService categoryService;
    private final FileService fileService;
    private final FileMapper fileMapper;
    private final FactoryRepository factoryRepository;
    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final CompanyService companyService;
    private final ProductEmailService productEmailService;

    public Product find(Long id) {
        return repository.findById(id).orElseThrow(() -> new EntityNotFoundException("Product not found"));
    }

    @Transactional
    public ProductResponseDto createProduct(CreateProductRequestDto request) {
        Product product = mapper.fromCreateRequest(request);
        product.setCategory(categoryService.find(request.getCategoryId()));
        product.setProducingFactories(factoryRepository.findAllById(request.getFactoryIds()));
        return mapper.toResponse(repository.save(product));
    }

    @Transactional
    @CacheEvict(value = "product", key = "#id")
    public FileResponseDto uploadImage(Long id, MultipartFile image) {
        Product product = find(id);
        StoredFile file = fileService.saveFile(FileFolder.PRODUCT, id, image);
        product.setImage(file);
        repository.save(product);

        return fileMapper.toResponse(FileFolder.PRODUCT, id, file);
    }

    public PagedResponse<ProductResponseDto> getProducts(Pageable pageable) {
        return mapper.toPagedResponse(repository.findAll(pageable));
    }

    @Cacheable(value = "product", key = "#id")
    public ProductResponseDto getProduct(Long id) {
        return mapper.toResponse(find(id));
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @CacheEvict(value = "product", key = "#id")
    public ProductResponseDto updateProduct(Long id, UpdateProductRequestDto request) {
        Product product = repository.findOneById(id);

        if (!Objects.equals(product.getCategory().getId(), request.getCategoryId())) {
            Category category = categoryService.find(request.getCategoryId());
            product.setCategory(category);
        }

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setWeight(request.getWeight());
        product.setOnSale(request.getOnSale());
        product.setUpdatedAt(Instant.now());
        product.setProducingFactories(factoryRepository.findAllById(request.getFactoryIds()));

        return mapper.toResponse(repository.save(product));
    }

    public PagedResponse<ProductResponseDto> searchProducts(ProductSearchRequestDto request, Pageable pageable) {
        Specification<Product> specification = ProductSpecification.search(request);
        return mapper.toPagedResponse(repository.findAll(specification, pageable));
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @CacheEvict(value = "product", key = "#id")
    public void deleteProduct(Long id) {
        Product product = find(id);
        repository.delete(product);
        fileService.deleteFiles(List.of(product.getImage().getId()));
    }

    public PagedResponse<FactoryProductListItemDto> getProductsByFactoryId(Long factoryId, Pageable pageable) {
        Page<Product> page = repository.findAllByProducingFactories_Id(factoryId, pageable);
        return mapper.toFactoryProductListItemPagedResponse(page);
    }

    public PagedResponse<ProductResponseDto> getAvailableProducts(Pageable pageable) {
        Page<Product> page = repository.findAllByOnSaleTrue(pageable);
        return mapper.toPagedResponse(page);
    }

    public PagedResponse<ProductResponseDto> searchAvailableProducts(String keyword, Pageable pageable) {
        Page<Product> page = repository.findAllByOnSaleTrueAndNameContaining(keyword, pageable);
        return mapper.toPagedResponse(page);
    }

    @Transactional
    @CacheEvict(value = "product", key = "#request.productId")
    public OrderResponseDto orderProduct(OrderRequestDto request) {
        Order order = fromRequest(request);

        int updated = repository.decrementQuantity(
                request.getProductId(),
                request.getQuantity()
        );

        if (updated == 0) {
            Product product = repository.findById(request.getProductId())
                    .orElseThrow(() -> new EntityNotFoundException(
                            "Product not found: " + request.getProductId()
                    ));

            throw new InsufficientStockException(
                    "Insufficient stock. Available quantity: %d".formatted(product.getQuantity())
            );
        }

        Order createdOrder = orderRepository.save(order);
        productEmailService.sendInvoice(createdOrder);

        return OrderResponseDto.builder()
                .id(createdOrder.getId())
                .build();
    }

    private Order fromRequest(OrderRequestDto request) {
        Company company = companyService.find(request.getCompanyId());
        Product product = find(request.getProductId());
        return orderMapper.fromRequest(product, company, request.getQuantity());
    }

    @Transactional
    @CacheEvict(value = "product", allEntries = true)
    public void applyProductionReport(ProductionReportMessage report) {
        if (report.getItems() == null || report.getItems().isEmpty())
            return;

        Map<Long, Integer> updates = report.getItems().stream()
                .collect(Collectors.groupingBy(
                        ProductionItemMessage::getProductId,
                        Collectors.summingInt(ProductionItemMessage::getQuantity)
                ));

        int[] results = repository.batchIncrementQuantity(updates);

        int i = 0;
        for (Long productId : updates.keySet()) {
            if (results[i++] == 0)
                throw new EntityNotFoundException("Product not found: " + productId);
        }
    }

}