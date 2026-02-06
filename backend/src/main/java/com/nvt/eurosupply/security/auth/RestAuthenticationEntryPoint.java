package com.nvt.eurosupply.security.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nvt.eurosupply.shared.models.ExceptionResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import org.springframework.security.core.AuthenticationException;

import java.io.IOException;

@Component
public class RestAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request,
                         HttpServletResponse response,
                         AuthenticationException authException) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");

        ExceptionResponse exceptionResponse = new ExceptionResponse();
        exceptionResponse.setError("Unauthorized");
        exceptionResponse.setMessage(authException.getMessage());

        ObjectMapper mapper = new ObjectMapper();
        String jsonResponse = mapper.writeValueAsString(exceptionResponse);

        response.getWriter().write(jsonResponse);
    }
}