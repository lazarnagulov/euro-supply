package com.nvt.eurosupply.shared.models;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class ExceptionResponse {
    private String error;
    private String message;
    private String path;
    private int status;
    private Instant timestamp;
}
