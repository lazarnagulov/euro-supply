package com.nvt.eurosupply.config;

import com.nvt.eurosupply.user.enums.Role;
import com.nvt.eurosupply.user.models.User;
import com.nvt.eurosupply.user.repositories.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Slf4j
@Configuration
public class SuperAdminInitConfig {

    @Bean
    public CommandLineRunner createSuperManager(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {
            User existingAdmin = userRepository.findByUsername("admin");

            if (existingAdmin != null) {
                if (existingAdmin.getRole() != Role.ADMIN) {
                    log.error("User 'admin' already exists but is NOT a super admin! " +
                            "Please fix manually before starting the application.");
                    throw new IllegalStateException("User 'admin' exists but is not a super admin!");
                }

                log.info("Super admin already exists, skipping creation.");
                return;
            }

            String rawPassword = UUID.randomUUID().toString();
            Path filePath = Paths.get("first-password.txt");
            Files.writeString(filePath, rawPassword);

            User admin = User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode(rawPassword))
                    .role(Role.ADMIN)
                    .mustChangePassword(true)
                    .build();

            userRepository.save(admin);

            log.info("Super admin created.");
        };
    }
}
