package com.nvt.eurosupply.product.services;

import com.nvt.eurosupply.product.dtos.CreateProductRequestDto;
import com.nvt.eurosupply.product.dtos.ProductResponseDto;
import com.nvt.eurosupply.product.dtos.ProductSearchRequestDto;
import com.nvt.eurosupply.product.dtos.UpdateProductRequestDto;
import com.nvt.eurosupply.product.mappers.ProductMapper;
import com.nvt.eurosupply.product.models.Category;
import com.nvt.eurosupply.product.models.Product;
import com.nvt.eurosupply.product.repositories.ProductRepository;
import com.nvt.eurosupply.product.specifications.ProductSpecification;
import com.nvt.eurosupply.shared.dtos.FileResponseDto;
import com.nvt.eurosupply.shared.enums.FileFolder;
import com.nvt.eurosupply.shared.mappers.FileMapper;
import com.nvt.eurosupply.shared.models.PagedResponse;
import com.nvt.eurosupply.shared.models.StoredFile;
import com.nvt.eurosupply.shared.services.FileService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository repository;
    private final ProductMapper mapper;

    private final CategoryService categoryService;
    private final FileService fileService;
    private final FileMapper fileMapper;

    public Product find(Long id) {
        return repository.findById(id).orElseThrow(() -> new EntityNotFoundException("Product not found"));
    }

    @Transactional
    public ProductResponseDto createProduct(CreateProductRequestDto request) {
        Product product = mapper.fromCreateRequest(request);
        product.setCategory(categoryService.find(request.getCategoryId()));
        return mapper.toResponse(repository.save(product));
    }

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

    public ProductResponseDto updateProduct(Long id, UpdateProductRequestDto request) {
        Product product = find(id);

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

        return mapper.toResponse(repository.save(product));
    }

    public PagedResponse<ProductResponseDto> searchProducts(ProductSearchRequestDto request, Pageable pageable) {
        Specification<Product> specification = ProductSpecification.search(request);
        return mapper.toPagedResponse(repository.findAll(specification, pageable));
    }

    public void deleteProduct(Long id) {
        repository.delete(find(id));
    }
}
