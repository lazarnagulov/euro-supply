package com.nvt.eurosupply.auth.services;

import com.nvt.eurosupply.auth.dtos.LoginRequestDto;
import com.nvt.eurosupply.auth.dtos.UserTokenState;
import com.nvt.eurosupply.auth.exceptons.AccountAccessDeniedException;
import com.nvt.eurosupply.auth.exceptons.UserSuspendedException;
import com.nvt.eurosupply.security.utils.JwtTokenUtil;
import com.nvt.eurosupply.user.models.User;
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
        return new UserTokenState(jwt, expiresIn);
    }
}