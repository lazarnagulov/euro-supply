package com.nvt.eurosupply.user.services;

import com.nvt.eurosupply.shared.dtos.FileResponseDto;
import com.nvt.eurosupply.shared.enums.FileFolder;
import com.nvt.eurosupply.shared.mappers.FileMapper;
import com.nvt.eurosupply.shared.models.PagedResponse;
import com.nvt.eurosupply.shared.models.StoredFile;
import com.nvt.eurosupply.shared.services.FileService;
import com.nvt.eurosupply.user.dtos.AuthRequestDto;
import com.nvt.eurosupply.user.dtos.AuthResponseDto;
import com.nvt.eurosupply.user.dtos.ChangePasswordRequest;
import com.nvt.eurosupply.user.dtos.ManagerResponseDto;
import com.nvt.eurosupply.user.enums.Role;
import com.nvt.eurosupply.user.exceptions.InvalidOldPasswordException;
import com.nvt.eurosupply.user.exceptions.PasswordConfirmationMismatchException;
import com.nvt.eurosupply.user.exceptions.PasswordNotChangedException;
import com.nvt.eurosupply.user.exceptions.UserAlreadyExistsException;
import com.nvt.eurosupply.user.mappers.UserMapper;
import com.nvt.eurosupply.user.models.User;
import com.nvt.eurosupply.user.repositories.UserRepository;
import com.nvt.eurosupply.user.utils.HashUtils;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository repository;
    private final UserMapper mapper;
    private final PasswordEncoder passwordEncoder;
    private final AccountVerificationService accountActivationService;
    private final FileService fileService;
    private final FileMapper fileMapper;

    public AuthResponseDto register(AuthRequestDto request) {
        validateUniqueUserData(request);
        User user = mapper.fromRequest(request);
        user.setHash(HashUtils.generateHash());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.CUSTOMER);
        User createdUser = repository.save(user);
        accountActivationService.sendActivationEmail(createdUser);
        return AuthResponseDto.builder().id(createdUser.getId()).build();
    }

    public AuthResponseDto registerManager(AuthRequestDto request) {
        validateUniqueUserData(request);
        User manager = mapper.fromRequest(request);
        manager.setPassword(passwordEncoder.encode(request.getPassword()));
        manager.setRole(Role.MANAGER);
        manager.setMustChangePassword(true);
        manager.setIsSuspended(false);
        manager.setIsVerified(true);
        User created = repository.save(manager);
        return new AuthResponseDto(created.getId());
    }

    private void validateUniqueUserData(AuthRequestDto request) {
        if (repository.existsByUsername(request.getUsername()))
            throw new UserAlreadyExistsException("User with this username already exists");

        if (repository.existsByEmail(request.getEmail()))
            throw new UserAlreadyExistsException("User with this email already exists");
    }

    @Transactional
    @CacheEvict(value = "user", key = "#id")
    public FileResponseDto uploadImage(Long id, @Valid MultipartFile image) {
        User user = find(id);
        StoredFile file = fileService.saveFile(FileFolder.USER, id, image);
        user.setImage(file);
        repository.save(user);
        return fileMapper.toResponse(FileFolder.USER, id, file);
    }

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.isAuthenticated()) {
            Object principal = authentication.getPrincipal();

            if (principal instanceof UserDetails details) {
                return repository.findByUsername(details.getUsername()).orElse(null);
            }
        }
        return null;
    }

    private User find(Long id) {
        return repository.findById(id).orElseThrow(() -> new EntityNotFoundException("User not found"));
    }

    public PagedResponse<ManagerResponseDto> searchManagers(Pageable pageable, String keyword) {
        return mapper.toPagedResponse(repository.searchManagers(keyword, pageable));
    }

    public void suspendUser(Long id) {
        User user = find(id);
        user.setIsSuspended(true);
        repository.save(user);
    }

    @Transactional
    public void changePassword(ChangePasswordRequest request) {
        User user = find(request.getUserId());

        if (!request.getNewPassword().equals(request.getPasswordConfirmation()))
            throw new PasswordConfirmationMismatchException();

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword()))
            throw new InvalidOldPasswordException();

        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword()))
            throw new PasswordNotChangedException();

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setMustChangePassword(false);

        repository.save(user);
    }

}