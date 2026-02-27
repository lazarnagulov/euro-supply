package com.nvt.eurosupply.factory.repositories;

import com.nvt.eurosupply.factory.models.Factory;
import jakarta.persistence.LockModeType;
import jakarta.persistence.QueryHint;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

public interface FactoryRepository extends JpaRepository<Factory, Long>, JpaSpecificationExecutor<Factory> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select f from Factory f where f.id = :id")
    @QueryHints({@QueryHint(name = "javax.persistence.lock.timeout", value ="0")})
    public Factory findOneById(@Param("id") Long id);
}
