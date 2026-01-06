package com.nvt.eurosupply.factory.services;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProductFactoryCleanupService {

    @PersistenceContext
    private EntityManager em;

    @Transactional
    public void deleteByFactoryId(Long factoryId) {
        Query query = em.createNativeQuery(
                "DELETE FROM product_factory WHERE factory_id = ?1"
        );
        query.setParameter(1, factoryId);
        query.executeUpdate();
    }
}
