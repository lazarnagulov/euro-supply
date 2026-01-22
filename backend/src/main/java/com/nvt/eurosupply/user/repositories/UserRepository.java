package com.nvt.eurosupply.user.repositories;

import com.nvt.eurosupply.user.enums.Role;
import com.nvt.eurosupply.user.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByHash(String hash);
    Boolean existsByEmail(String email);
    Boolean existsByUsername(String username);

    Page<User> findAllByRoleAndIsSuspendedFalse(Pageable pageable, Role role);
}
