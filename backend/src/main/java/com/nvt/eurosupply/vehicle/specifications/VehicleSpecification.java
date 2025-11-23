package com.nvt.eurosupply.vehicle.specifications;

import com.nvt.eurosupply.vehicle.models.Vehicle;
import org.springframework.data.jpa.domain.Specification;

public class VehicleSpecification {

    private VehicleSpecification() {}

    public static Specification<Vehicle> registrationContains(String term) {
        return (root, query, cb) ->
                cb.like(cb.lower(root.get("registrationPlate")), "%" + term.toLowerCase() + "%");
    }

    public static Specification<Vehicle> byBrand(Long brandId) {
        return (root, query, cb) ->
                cb.equal(root.get("brand").get("id"), brandId);
    }

    public static Specification<Vehicle> byModel(Long modelId) {
        return (root, query, cb) ->
                cb.equal(root.get("model").get("id"), modelId);
    }
}
