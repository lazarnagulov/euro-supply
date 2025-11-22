package com.nvt.eurosupply.user.services;

import com.nvt.eurosupply.user.mappers.UserMapper;
import com.nvt.eurosupply.user.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository repository;
    private final UserMapper mapper;
    private final PasswordEncoder passwordEncoder;


}
