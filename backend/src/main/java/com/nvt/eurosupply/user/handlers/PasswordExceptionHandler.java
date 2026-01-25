package com.nvt.eurosupply.user.handlers;

import com.nvt.eurosupply.shared.models.ExceptionResponse;
import com.nvt.eurosupply.user.exceptions.InvalidOldPasswordException;
import com.nvt.eurosupply.user.exceptions.PasswordConfirmationMismatchException;
import com.nvt.eurosupply.user.exceptions.PasswordNotChangedException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;

@Slf4j
@RestControllerAdvice
public class PasswordExceptionHandler {

    @ExceptionHandler(PasswordConfirmationMismatchException.class)
    public ResponseEntity<ExceptionResponse> handlePasswordConfirmationMismatch(
            PasswordConfirmationMismatchException ex,
            HttpServletRequest
                    request) {

        log.warn("Password change failed: {}", ex.getMessage());

        ExceptionResponse response = ExceptionResponse.builder()
                .error("Password Confirmation Mismatch")
                .message(ex.getMessage())
                .status(HttpStatus.BAD_REQUEST.value())
                .path(request.getRequestURI())
                .timestamp(Instant.now())
                .build();

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(response);
    }

    @ExceptionHandler(InvalidOldPasswordException.class)
    public ResponseEntity<ExceptionResponse> handleInvalidOldPassword(
            InvalidOldPasswordException ex,
            HttpServletRequest request) {

        log.warn("Password change failed: {}", ex.getMessage());

        ExceptionResponse response = ExceptionResponse.builder()
                .error("Invalid Old Password")
                .message(ex.getMessage())
                .status(HttpStatus.BAD_REQUEST.value())
                .path(request.getRequestURI())
                .timestamp(Instant.now())
                .build();

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(response);
    }

    @ExceptionHandler(PasswordNotChangedException.class)
    public ResponseEntity<ExceptionResponse> handlePasswordNotChanged(
            PasswordNotChangedException ex,
            HttpServletRequest request) {

        log.warn("Password change failed: {}", ex.getMessage());

        ExceptionResponse response = ExceptionResponse.builder()
                .error("Password Not Changed")
                .message(ex.getMessage())
                .status(HttpStatus.BAD_REQUEST.value())
                .path(request.getRequestURI())
                .timestamp(Instant.now())
                .build();

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(response);
    }
}