package com.nvt.eurosupply.auth.handlers;

import com.nvt.eurosupply.auth.exceptons.UserSuspendedException;
import com.nvt.eurosupply.shared.models.ExceptionResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class UserSuspendedExceptionHandler {

    @ExceptionHandler(UserSuspendedException.class)
    public ResponseEntity<ExceptionResponse> handleUserSuspended(UserSuspendedException ex) {
        return ResponseEntity.status(HttpStatus.LOCKED)
                .body(ExceptionResponse.builder()
                        .error(HttpStatus.LOCKED.getReasonPhrase())
                        .message(ex.getMessage())
                        .build());
    }
}