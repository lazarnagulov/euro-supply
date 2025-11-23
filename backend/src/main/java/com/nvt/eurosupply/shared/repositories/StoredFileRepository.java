package com.nvt.eurosupply.shared.repositories;

import com.nvt.eurosupply.shared.models.StoredFile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StoredFileRepository extends JpaRepository<StoredFile, Long> {
}
