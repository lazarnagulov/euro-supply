package com.nvt.eurosupply.email.handlers;

import com.nvt.eurosupply.email.exceptions.EmailException;
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
public class EmailExceptionHandler {

    @ExceptionHandler(EmailException.class)
    public ResponseEntity<ExceptionResponse> handleEmailException(
            EmailException ex,
            HttpServletRequest request) {

        ExceptionResponse response = ExceptionResponse.builder()
                .error("Email Sending Failed")
                .message(ex.getMessage())
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .path(request.getRequestURI())
                .timestamp(Instant.now())
                .build();

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(response);
    }

}
