package com.nvt.eurosupply.warehouse.specifications;

import com.nvt.eurosupply.warehouse.dtos.WarehouseSearchRequestDto;
import com.nvt.eurosupply.warehouse.models.Warehouse;
import org.springframework.data.jpa.domain.Specification;

public class WarehouseSpecification {

    private WarehouseSpecification() {}

    public static Specification<Warehouse> search(WarehouseSearchRequestDto request) {
        return Specification.where(containsName(request.getName()))
                .and(containsAddress(request.getAddress()))
                .and(byCountry(request.getCountryId()))
                .and(byCity(request.getCityId()));
    }

    private static Specification<Warehouse> containsName(String name) {
        return (root, query, cb) ->
                name == null ? cb.conjunction() :
                        cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%");
    }

    private static Specification<Warehouse> containsAddress(String address) {
        return (root, query, cb) ->
                address == null ? cb.conjunction() :
                        cb.like(cb.lower(root.get("address")), "%" + address.toLowerCase() + "%");
    }

    private static Specification<Warehouse> byCountry(Long countryId) {
        return (root, query, cb) ->
                countryId == null ? cb.conjunction() :
                        cb.equal(root.get("country").get("id"), countryId);
    }

    private static Specification<Warehouse> byCity(Long cityId) {
        return (root, query, cb) ->
                cityId == null ? cb.conjunction() :
                        cb.equal(root.get("city").get("id"), cityId);
    }
}