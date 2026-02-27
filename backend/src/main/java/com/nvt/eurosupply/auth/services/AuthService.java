package com.nvt.eurosupply.auth.services;

import com.nvt.eurosupply.auth.dtos.LoginRequestDto;
import com.nvt.eurosupply.auth.dtos.UserTokenState;
import com.nvt.eurosupply.auth.exceptons.AccountAccessDeniedException;
import com.nvt.eurosupply.auth.exceptons.UserSuspendedException;
import com.nvt.eurosupply.company.repositories.CompanyRepository;
import com.nvt.eurosupply.security.utils.JwtTokenUtil;
import com.nvt.eurosupply.shared.exceptions.BadRequestException;
import com.nvt.eurosupply.shared.exceptions.FileAuthorizationException;
import com.nvt.eurosupply.user.enums.Role;
import com.nvt.eurosupply.user.models.User;
import com.nvt.eurosupply.user.repositories.UserRepository;
import com.nvt.eurosupply.user.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final JwtTokenUtil jwtTokenUtil;
    private final AuthenticationManager authenticationManager;
    private final UserService userService;

    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;

    public UserTokenState login(LoginRequestDto request) {
        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword());
        Authentication authentication = authenticationManager.authenticate(token);
        User user = (User) authentication.getPrincipal();

        if (!user.getIsVerified())
            throw new AccountAccessDeniedException("Account is not verified. Check your email.");

        if (user.getIsSuspended())
            throw new UserSuspendedException("Account is suspended.");

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtTokenUtil.generateAccessToken(user.getUsername(), String.format("ROLE_%s", user.getRole()), user.getId());
        Long expiresIn = jwtTokenUtil.accessTokenExpiration;
        return new UserTokenState(user.getId(), jwt, expiresIn, user.getMustChangePassword());
    }

    public void authorizeFile(String originalUri) {
        String filePath = originalUri.replaceFirst("^/files/", "");
        determineFileOwnership(filePath);
    }

    private void determineFileOwnership(String filePath) {
        try {
            String[] pathParts = filePath.split("/");
            if (pathParts.length < 2) {
                throw new FileAuthorizationException();
            }
            String resourceType = pathParts[0];
            String resourceId = pathParts[1];

            User user = userService.getCurrentUser();
            String username = user.getUsername();

            if(!checkFileAccess(resourceType, resourceId, username, user.getRole())) {
                throw new FileAuthorizationException();
            }
        } catch (Exception e) {
            throw new BadRequestException("File url is not correct");
        }
    }

    private boolean checkFileAccess(
        String resourceType,
        String resourceId,
        String username,
        Role role
    ) {
        if (role.equals(Role.MANAGER) || role.equals(Role.ADMIN))
            return true;
        boolean isCustomer = role.equals(Role.CUSTOMER);

        return switch (resourceType) {
            case "company" -> {
                if (isCustomer)
                    yield authorizeCompanyFile(resourceId, username);
                yield false;
            }
            case "product" -> isCustomer;
            case "user" -> {
                if (isCustomer)
                    yield authorizeUserFile(resourceId, username);
                yield false;
            }
            default -> false;
        };
    }

    private boolean authorizeCompanyFile(String resourceId, String username) {
        try {
            Long companyId = Long.parseLong(resourceId);
            return companyRepository.existsByIdAndOwner_Username(companyId, username);
        } catch (NumberFormatException e) {
            return false;
        }
    }

    private boolean authorizeUserFile(String resourceId, String username) {
        try {
            Long userId = Long.parseLong(resourceId);
            return userRepository.existsByIdAndUsername(userId, username);
        } catch (NumberFormatException e) {
            return false;
        }
    }
}
