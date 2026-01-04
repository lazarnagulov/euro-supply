package com.nvt.eurosupply.factory.repositories;

import com.nvt.eurosupply.factory.models.Production;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductionRepository extends JpaRepository<Production, Long> {
}
