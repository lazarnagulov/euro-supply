package com.nvt.eurosupply.shared.handlers;

import com.nvt.eurosupply.shared.models.ExceptionResponse;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.Instant;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ExceptionResponse> handleEntityNotFoundException(
            EntityNotFoundException ex,
            HttpServletRequest request) {

        ExceptionResponse response = ExceptionResponse.builder()
                .error("Not Found")
                .message(ex.getMessage())
                .path(request.getRequestURI())
                .status(HttpStatus.NOT_FOUND.value())
                .timestamp(Instant.now())
                .build();

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }
}

