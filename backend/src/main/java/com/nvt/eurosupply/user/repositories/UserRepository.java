package com.nvt.eurosupply.user.repositories;

import com.nvt.eurosupply.user.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByHash(String hash);
    Boolean existsByEmail(String email);
    Boolean existsByUsername(String username);

    @Query(
            value = """
    SELECT *
    FROM users
    WHERE role = 'MANAGER'
      AND is_suspended = false
      AND (
        :search IS NULL OR :search = ''
        OR to_tsvector('simple',
            COALESCE(firstname, '') || ' ' ||
            COALESCE(lastname, '') || ' ' ||
            COALESCE(username, '') || ' ' ||
            COALESCE(email, '')
        ) @@ to_tsquery('simple', :search || ':*')
      )
    """,
            countQuery = """
    SELECT COUNT(*)
    FROM users
    WHERE role = 'MANAGER'
      AND is_suspended = false
      AND (
        :search IS NULL OR :search = ''
        OR to_tsvector('simple',
            COALESCE(firstname, '') || ' ' ||
            COALESCE(lastname, '') || ' ' ||
            COALESCE(username, '') || ' ' ||
            COALESCE(email, '')
        ) @@ to_tsquery('simple', :search || ':*')
      )
    """,
            nativeQuery = true
    )
    Page<User> searchManagers(
            @Param("search") String search,
            Pageable pageable
    );


}
