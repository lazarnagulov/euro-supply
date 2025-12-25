package com.nvt.eurosupply.product.specifications;

import com.nvt.eurosupply.product.dtos.ProductSearchRequestDto;
import com.nvt.eurosupply.product.models.Product;
import org.springframework.data.jpa.domain.Specification;

public class ProductSpecification {
    private ProductSpecification() {}

    public static Specification<Product> search(ProductSearchRequestDto request) {
        return Specification.where(nameContains(request.getName()))
                .and(descriptionContains(request.getDescription()))
                .and(byMinPrice(request.getMinPrice()))
                .and(byMaxPrice(request.getMaxPrice()))
                .and(byMinWeight(request.getMinWeight()))
                .and(byMaxWeight(request.getMaxWeight()))
                .and(isOnSale(request.getOnSale()))
                .and(byCategory(request.getCategoryId()));
    }

    private static Specification<Product> nameContains(String name) {
        return (root, query, cb) ->
                name == null || name.isEmpty() ? cb.conjunction() :
                        cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%");
    }

    private static Specification<Product> descriptionContains(String description) {
        return (root, query, cb) ->
                description == null || description.isEmpty() ? cb.conjunction() :
                        cb.like(cb.lower(root.get("description")), "%" + description.toLowerCase() + "%");
    }

    private static Specification<Product> byMinPrice(Double minPrice) {
        return (root, query, cb) ->
                minPrice == null ? cb.conjunction() :
                        cb.greaterThanOrEqualTo(root.get("price"), minPrice);
    }

    private static Specification<Product> byMaxPrice(Double maxPrice) {
        return (root, query, cb) ->
                maxPrice == null ? cb.conjunction() :
                        cb.lessThanOrEqualTo(root.get("price"), maxPrice);
    }

    private static Specification<Product> byMinWeight(Double minWeight) {
        return (root, query, cb) ->
                minWeight == null ? cb.conjunction() :
                        cb.greaterThanOrEqualTo(root.get("weight"), minWeight);
    }

    private static Specification<Product> byMaxWeight(Double maxWeight) {
        return (root, query, cb) ->
                maxWeight == null ? cb.conjunction() :
                        cb.lessThanOrEqualTo(root.get("weight"), maxWeight);
    }

    private static Specification<Product> isOnSale(Boolean onSale) {
        return (root, query, cb) ->
                onSale == null ? cb.conjunction() :
                        cb.equal(root.get("onSale"), onSale);
    }

    private static Specification<Product> byCategory(Long categoryId) {
        return (root, query, cb) ->
                categoryId == null ? cb.conjunction() :
                        cb.equal(root.get("category").get("id"), categoryId);
    }
}
