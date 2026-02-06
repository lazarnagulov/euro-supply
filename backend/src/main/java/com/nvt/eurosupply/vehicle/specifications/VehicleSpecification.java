package com.nvt.eurosupply.vehicle.specifications;

import com.nvt.eurosupply.vehicle.dtos.VehicleSearchRequestDto;
import com.nvt.eurosupply.vehicle.models.Vehicle;
import org.springframework.data.jpa.domain.Specification;

public class VehicleSpecification {

    private VehicleSpecification() {}

    public static Specification<Vehicle> search(VehicleSearchRequestDto request) {
        return Specification
                .where(registrationContains(request.getRegistration()))
                .and(byBrandId(request.getBrandId()))
                .and(byModelId(request.getModelId()))
                .and(byMinLoad(request.getMinLoad()))
                .and(byMaxLoad(request.getMaxLoad()));
    }

    private static Specification<Vehicle> registrationContains(String term) {
        return (root, query, cb) -> {
            if (term == null || term.isBlank())
                return cb.conjunction();

            return cb.like(root.get("registrationNumber"), "%" + term + "%");
        };
    }

    private static Specification<Vehicle> byBrandId(Long brandId) {
        return (root, query, cb) ->
                brandId == null
                        ? cb.conjunction()
                        : cb.equal(root.join("brand").get("id"), brandId);
    }

    private static Specification<Vehicle> byModelId(Long modelId) {
        return (root, query, cb) ->
                modelId == null
                        ? cb.conjunction()
                        : cb.equal(root.join("model").get("id"), modelId);
    }

    private static Specification<Vehicle> byMinLoad(Double minLoad) {
        return (root, query, cb) ->
                minLoad == null
                        ? cb.conjunction()
                        : cb.greaterThanOrEqualTo(root.get("maxLoadKg"), minLoad);
    }

    private static Specification<Vehicle> byMaxLoad(Double maxLoad) {
        return (root, query, cb) ->
                maxLoad == null
                        ? cb.conjunction()
                        : cb.lessThanOrEqualTo(root.get("maxLoadKg"), maxLoad);
    }
}
