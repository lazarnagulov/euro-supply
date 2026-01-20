package com.nvt.eurosupply.auth.handlers;

import com.nvt.eurosupply.auth.exceptons.AccountAccessDeniedException;
import com.nvt.eurosupply.shared.models.ExceptionResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class AccountAccessDeniedExceptionHandler {

    @ExceptionHandler(AccountAccessDeniedException.class)
    public ResponseEntity<ExceptionResponse> handleAccountAccessDenied(AccountAccessDeniedException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(ExceptionResponse.builder()
                        .error(HttpStatus.FORBIDDEN.getReasonPhrase())
                        .message(ex.getMessage())
                        .build());
    }
}