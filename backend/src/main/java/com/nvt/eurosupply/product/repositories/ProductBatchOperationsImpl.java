package com.nvt.eurosupply.product.repositories;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class ProductBatchOperationsImpl implements ProductBatchOperations {

    private final JdbcTemplate jdbcTemplate;

    @Override
    public int[] batchIncrementQuantity(Map<Long, Integer> updates) {
        String sql = "UPDATE product_inventory SET quantity = quantity + ? WHERE product_id = ?";

        List<Map.Entry<Long, Integer>> entries = new ArrayList<>(updates.entrySet());

        return jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                Map.Entry<Long, Integer> entry = entries.get(i);
                ps.setInt(1, entry.getValue());
                ps.setLong(2, entry.getKey());
            }

            @Override
            public int getBatchSize() {
                return entries.size();
            }
        });
    }
}