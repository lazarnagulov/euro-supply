package com.nvt.eurosupply.product.repositories;

import org.springframework.stereotype.Repository;

import java.util.Map;

@Repository
public interface ProductBatchOperations {
    int[] batchIncrementQuantity(Map<Long, Integer> updates);
}
