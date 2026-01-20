package com.nvt.eurosupply.user.services;

import com.nvt.eurosupply.user.dtos.AuthRequestDto;
import com.nvt.eurosupply.user.dtos.AuthResponseDto;
import com.nvt.eurosupply.user.enums.Role;
import com.nvt.eurosupply.user.mappers.UserMapper;
import com.nvt.eurosupply.user.models.User;
import com.nvt.eurosupply.user.repositories.UserRepository;
import com.nvt.eurosupply.user.utils.HashUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository repository;
    private final UserMapper mapper;
    private final PasswordEncoder passwordEncoder;
    private final AccountVerificationService accountActivationService;

    public AuthResponseDto register(@Valid AuthRequestDto request) {
        User user = mapper.fromRequest(request);
        user.setHash(HashUtils.generateHash());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.CUSTOMER);
        User createdUser = repository.save(user);
        accountActivationService.sendActivationEmail(createdUser);
        return AuthResponseDto.builder().id(createdUser.getId()).build();
    }
}