package com.nvt.eurosupply.vehicle.specifications;

import com.nvt.eurosupply.vehicle.dtos.VehicleSearchRequestDto;
import com.nvt.eurosupply.vehicle.models.Vehicle;
import jakarta.persistence.criteria.Join;
import org.springframework.data.jpa.domain.Specification;

public class VehicleSpecification {

    private VehicleSpecification() {}

    public static Specification<Vehicle> search(VehicleSearchRequestDto request) {
        return Specification.where(registrationContains(request.getRegistration()))
                .and(byBrand(request.getBrandId()))
                .and(byModel(request.getModelId()))
                .and(byMinLoad(request.getMinLoad()))
                .and(byMaxLoad(request.getMaxLoad()));
    }

    private static Specification<Vehicle> registrationContains(String term) {
        return (root, query, cb) ->
                term == null ? cb.conjunction() :
                        cb.like(cb.lower(root.get("registrationNumber")), "%" + term.toLowerCase() + "%");
    }

    private static Specification<Vehicle> byBrand(Long brandId) {
        return (root, query, cb) ->
                brandId == null ? cb.conjunction() :
                        cb.equal(root.get("brand").get("id"), brandId);
    }

    private static Specification<Vehicle> byModel(Long modelId) {
        return (root, query, cb) ->
                modelId == null ? cb.conjunction() :
                        cb.equal(root.get("model").get("id"), modelId);
    }

    private static Specification<Vehicle> byMinLoad(Double minLoad) {
        return (root, query, cb) ->
                minLoad == null ? cb.conjunction() :
                    cb.greaterThanOrEqualTo(root.get("maxLoadKg"), minLoad);
    }

    private static Specification<Vehicle> byMaxLoad(Double maxLoad) {
        return (root, query, cb) ->
                maxLoad == null ? cb.conjunction() :
                            cb.lessThanOrEqualTo(root.get("maxLoadKg"), maxLoad);
    }
}
