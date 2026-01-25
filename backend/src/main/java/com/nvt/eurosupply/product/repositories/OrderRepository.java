package com.nvt.eurosupply.product.repositories;

import com.nvt.eurosupply.product.models.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> { }