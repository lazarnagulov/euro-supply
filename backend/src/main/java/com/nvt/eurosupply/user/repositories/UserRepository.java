package com.nvt.eurosupply.user.repositories;

import com.nvt.eurosupply.user.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
}
