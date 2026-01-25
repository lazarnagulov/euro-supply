package com.nvt.eurosupply.security.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nvt.eurosupply.shared.models.ExceptionResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class CustomAccessDeniedHandler implements AccessDeniedHandler {

    private final ObjectMapper objectMapper;

    @Override
    public void handle(HttpServletRequest request,
                       HttpServletResponse response,
                       AccessDeniedException accessDeniedException) throws IOException {

        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType("application/json");

        ExceptionResponse exceptionResponse = new ExceptionResponse();
        exceptionResponse.setError("Forbidden");
        exceptionResponse.setMessage("You do not have permission to access this resource");

        String jsonResponse = objectMapper.writeValueAsString(exceptionResponse);
        response.getWriter().write(jsonResponse);
    }
}