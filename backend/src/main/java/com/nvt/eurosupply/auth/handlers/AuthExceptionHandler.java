package com.nvt.eurosupply.auth.handlers;

import com.nvt.eurosupply.auth.exceptons.AccountAccessDeniedException;
import com.nvt.eurosupply.auth.exceptons.UserSuspendedException;
import com.nvt.eurosupply.shared.models.ExceptionResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.Instant;

@ControllerAdvice
@Slf4j
public class AuthExceptionHandler {

    @ExceptionHandler(AccountAccessDeniedException.class)
    public ResponseEntity<ExceptionResponse> handleAccountAccessDenied(
            AccountAccessDeniedException ex,
            HttpServletRequest request) {

        ExceptionResponse response = ExceptionResponse.builder()
                .error("Access Denied")
                .message(ex.getMessage())
                .status(HttpStatus.FORBIDDEN.value())
                .path(request.getRequestURI())
                .timestamp(Instant.now())
                .build();

        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(response);
    }

    @ExceptionHandler(UserSuspendedException.class)
    public ResponseEntity<ExceptionResponse> handleUserSuspended(
            UserSuspendedException ex,
            HttpServletRequest request) {

        ExceptionResponse response = ExceptionResponse.builder()
                .error("Account Suspended")
                .message(ex.getMessage())
                .status(HttpStatus.LOCKED.value())
                .path(request.getRequestURI())
                .timestamp(Instant.now())
                .build();

        return ResponseEntity
                .status(HttpStatus.LOCKED)
                .body(response);
    }

}
