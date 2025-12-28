package com.nvt.eurosupply.factory.specifications;

import com.nvt.eurosupply.factory.dtos.FactorySearchRequestDto;
import com.nvt.eurosupply.factory.models.Factory;
import org.springframework.data.jpa.domain.Specification;

public class FactorySpecification {

    private FactorySpecification() {}

    public static Specification<Factory> search(FactorySearchRequestDto request) {
        return Specification
                .where(nameContains(request.getName()))
                .and(addressContains(request.getAddress()))
                .and(byCountry(request.getCountryId()))
                .and(byCity(request.getCityId()));
    }

    private static Specification<Factory> nameContains(String name) {
        return (root, query, cb) ->
                name == null || name.isBlank()
                        ? cb.conjunction()
                        : cb.like(
                        cb.lower(root.get("name")),
                        "%" + name.toLowerCase() + "%"
                );
    }

    private static Specification<Factory> addressContains(String address) {
        return (root, query, cb) ->
                address == null || address.isBlank()
                        ? cb.conjunction()
                        : cb.like(
                        cb.lower(root.get("address")),
                        "%" + address.toLowerCase() + "%"
                );
    }

    private static Specification<Factory> byCountry(Long countryId) {
        return (root, query, cb) ->
                countryId == null
                        ? cb.conjunction()
                        : cb.equal(root.get("country").get("id"), countryId);
    }

    private static Specification<Factory> byCity(Long cityId) {
        return (root, query, cb) ->
                cityId == null
                        ? cb.conjunction()
                        : cb.equal(root.get("city").get("id"), cityId);
    }
}
