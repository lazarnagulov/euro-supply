package com.nvt.eurosupply.product.repositories;

import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Repository
public class ProductBatchOperationsImpl implements ProductBatchOperations {

    private final JdbcTemplate jdbcTemplate;

    public ProductBatchOperationsImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public int[] batchIncrementQuantity(Map<Long, Integer> updates) {
        String sql = "UPDATE products SET quantity = quantity + ? WHERE id = ?";

        List<Map.Entry<Long, Integer>> entries = new ArrayList<>(updates.entrySet());

        return jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {

            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                Map.Entry<Long, Integer> entry = entries.get(i);
                ps.setInt(1, entry.getValue());  // delta
                ps.setLong(2, entry.getKey());   // id
            }

            @Override
            public int getBatchSize() {
                return entries.size();
            }
        });
    }
}