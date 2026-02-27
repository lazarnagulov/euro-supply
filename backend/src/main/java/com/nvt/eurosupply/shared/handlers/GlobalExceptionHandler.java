package com.nvt.eurosupply.shared.handlers;

import com.nvt.eurosupply.shared.exceptions.*;
import com.nvt.eurosupply.shared.models.ExceptionResponse;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.PessimisticLockingFailureException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

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

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ExceptionResponse> handleBadRequestException(
            BadRequestException ex,
            HttpServletRequest request) {

        ExceptionResponse response = ExceptionResponse.builder()
                .error("Bad Request")
                .message(ex.getMessage())
                .path(request.getRequestURI())
                .status(HttpStatus.BAD_REQUEST.value())
                .timestamp(Instant.now())
                .build();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(ObjectOptimisticLockingFailureException.class)
    public ResponseEntity<ExceptionResponse> handleOptimisticLockingFailure(
            ObjectOptimisticLockingFailureException ex,
            HttpServletRequest request) {

        ExceptionResponse response = ExceptionResponse.builder()
                .error("Conflict")
                .message("The resource was modified by another user. Please refresh and try again.")
                .path(request.getRequestURI())
                .status(HttpStatus.CONFLICT.value())
                .timestamp(Instant.now())
                .build();

        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ExceptionResponse> handleIllegalStateException(IllegalStateException e) {
        ExceptionResponse response = ExceptionResponse.builder()
                .error(HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase())
                .message(e.getMessage())
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .timestamp(Instant.now())
                .build();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    @ExceptionHandler(FileUploadException.class)
    public ResponseEntity<ExceptionResponse> handleFileUploadException(
            EntityNotFoundException ex,
            HttpServletRequest request) {

        ExceptionResponse response = ExceptionResponse.builder()
                .error(HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase())
                .message(ex.getMessage())
                .path(request.getRequestURI())
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .timestamp(Instant.now())
                .build();

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    @ExceptionHandler(FileAuthorizationException.class)
    public ResponseEntity<ExceptionResponse> handleFileAuthorizationException(
            FileAuthorizationException ex,
            HttpServletRequest request) {

        ExceptionResponse response = ExceptionResponse.builder()
                .error("Forbidden")
                .message(ex.getMessage())
                .path(request.getRequestURI())
                .status(HttpStatus.FORBIDDEN.value())
                .timestamp(Instant.now())
                .build();

        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
    }


    @ExceptionHandler(FileDeleteException.class)
    public ResponseEntity<ExceptionResponse> handleFileDeleteException(
            FileDeleteException ex,
            HttpServletRequest request) {

        ExceptionResponse response = ExceptionResponse.builder()
                .error(HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase())
                .message(ex.getMessage())
                .path(request.getRequestURI())
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .timestamp(Instant.now())
                .build();

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(response);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ExceptionResponse> handleValidationException(
            MethodArgumentNotValidException ex,
            HttpServletRequest request) {

        String errorMessage = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(err -> err.getDefaultMessage())
                .findFirst()
                .orElse(ex.getMessage());

        ExceptionResponse response = ExceptionResponse.builder()
                .error("Validation Error")
                .message(errorMessage)
                .path(request.getRequestURI())
                .status(HttpStatus.BAD_REQUEST.value())
                .timestamp(Instant.now())
                .build();

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(response);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ExceptionResponse> handleDataIntegrityViolation(
            DataIntegrityViolationException ex,
            HttpServletRequest request) {

        String message = "Data integrity violation";

        if (ex.getMostSpecificCause().getMessage().contains("registration_number")) {
            message = "Vehicle with this registration number already exists";
        }

        ExceptionResponse response = ExceptionResponse.builder()
                .error("Conflict")
                .message(message)
                .path(request.getRequestURI())
                .status(HttpStatus.CONFLICT.value())
                .timestamp(Instant.now())
                .build();

        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    @ExceptionHandler(CustomRangeTooLargeException.class)
    public ResponseEntity<ExceptionResponse> handleCustomRangeTooLargeException(
            CustomRangeTooLargeException ex,
            HttpServletRequest request) {

        ExceptionResponse response = ExceptionResponse.builder()
                .error("Bad Request")
                .message(ex.getMessage())
                .path(request.getRequestURI())
                .status(HttpStatus.BAD_REQUEST.value())
                .timestamp(Instant.now())
                .build();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(PdfGenerationException.class)
    public ResponseEntity<ExceptionResponse> handlePdfGenerationException(
            PdfGenerationException e, WebRequest request) {

        ExceptionResponse response = ExceptionResponse.builder()
                .timestamp(Instant.now())
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .error(HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase())
                .message(e.getMessage())
                .path(request.getDescription(false).replace("uri=", ""))
                .build();

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(response);
    }

    @ExceptionHandler(PessimisticLockingFailureException.class)
    public ResponseEntity<ExceptionResponse> handlePessimisticLockingFailureException(PessimisticLockingFailureException e) {
        ExceptionResponse response = ExceptionResponse.builder()
                .error(HttpStatus.CONFLICT.getReasonPhrase())
                .message(e.getMessage())
                .status(HttpStatus.CONFLICT.value())
                .timestamp(Instant.now())
                .build();
        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }
}

