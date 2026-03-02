package com.nvt.eurosupply.user.services;

import com.nvt.eurosupply.email.models.EmailRequest;
import com.nvt.eurosupply.email.models.EmailTemplate;
import com.nvt.eurosupply.email.services.EmailService;
import com.nvt.eurosupply.user.dtos.AccountVerificationRequestDto;
import com.nvt.eurosupply.user.models.User;
import com.nvt.eurosupply.user.repositories.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AccountVerificationService {

    @Value("${app.frontend-url}")
    private String baseUrl;

    private final EmailService emailService;
    private final UserRepository repository;

    @Async
    public void sendActivationEmail(User user) {

        Map<String, Object> variables = new HashMap<>();
        variables.put("username", user.getUsername());
        variables.put("verificationUrl", String.format("%s/account-verification/%s", baseUrl, user.getHash()));
        variables.put("baseUrl", baseUrl);

        EmailRequest request = EmailRequest.builder()
                .to(user.getEmail())
                .subject(EmailTemplate.ACCOUNT_VERIFICATION.getDefaultSubject())
                .templateName(EmailTemplate.ACCOUNT_VERIFICATION.getTemplatePath())
                .templateVariables(variables)
                .build();

        emailService.sendEmail(request);
    }

    public void verifyAccount(AccountVerificationRequestDto request) {
        User user = repository.findByHash(request.getHash()).orElseThrow(() -> new EntityNotFoundException("User not found"));
        user.setIsVerified(true);
        repository.save(user);
    }
}
