package com.nvt.eurosupply.factory.repositories;

import com.nvt.eurosupply.factory.models.Production;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductionRepository extends JpaRepository<Production, Long> {
    List<Production> findByProduct_IdOrderByQuantityDesc(Long productId);
}
