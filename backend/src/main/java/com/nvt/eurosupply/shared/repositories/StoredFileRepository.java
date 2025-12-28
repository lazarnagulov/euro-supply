package com.nvt.eurosupply.shared.repositories;

import com.nvt.eurosupply.shared.models.StoredFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface StoredFileRepository extends JpaRepository<StoredFile, Long> {
    @Modifying
    @Query("DELETE FROM StoredFile f WHERE f.id IN :ids")
    void deleteAllByIdIn(@Param("ids") List<Long> ids);
}
