package com.nvt.eurosupply.product.handlers;

import com.nvt.eurosupply.product.exceptions.InsufficientStockException;
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
public class ProductExceptionHandler {

    @ExceptionHandler(InsufficientStockException.class)
    public ResponseEntity<ExceptionResponse> handleInsufficientStock(
            InsufficientStockException ex,
            HttpServletRequest request) {

        log.error("Order failed due to insufficient stock: {}", ex.getMessage());

        ExceptionResponse response = ExceptionResponse.builder()
                .error("Insufficient Stock")
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