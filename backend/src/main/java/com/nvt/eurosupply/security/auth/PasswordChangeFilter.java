package com.nvt.eurosupply.security.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nvt.eurosupply.security.utils.JwtTokenUtil;
import com.nvt.eurosupply.user.models.User;
import com.nvt.eurosupply.user.repositories.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class PasswordChangeFilter extends OncePerRequestFilter {

    private final JwtTokenUtil jwtTokenUtil;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {

        String requestURI = request.getRequestURI();

        if (requestURI.startsWith("/api/v1/auth/login") ||
                requestURI.startsWith("/api/v1/users/registration") ||
                requestURI.equals("/api/v1/users/password")||
                requestURI.equals("/api/v1/auth/authorize-file")
        ) {
            filterChain.doFilter(request, response);
            return;
        }

        if (SecurityContextHolder.getContext().getAuthentication() != null &&
                SecurityContextHolder.getContext().getAuthentication().isAuthenticated()) {

            String authHeader = request.getHeader("Authorization");

            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String jwt = authHeader.substring(7);

                try {
                    String username = jwtTokenUtil.extractUsername(jwt);
                    User user = userRepository.findByUsername(username)
                            .orElse(null);

                    if (user != null && Boolean.TRUE.equals(user.getMustChangePassword())) {
                        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                        response.setContentType("application/json");
                        response.setCharacterEncoding("UTF-8");

                        Map<String, Object> errorResponse = new HashMap<>();
                        errorResponse.put("error", "Password change required");
                        errorResponse.put("message", "You must change your password before accessing the application");
                        errorResponse.put("mustChangePassword", true);

                        ObjectMapper mapper = new ObjectMapper();
                        response.getWriter().write(mapper.writeValueAsString(errorResponse));
                        return;
                    }
                } catch (Exception e) {
                    filterChain.doFilter(request, response);
                    return;
                }
            }
        }

        filterChain.doFilter(request, response);
    }
}
