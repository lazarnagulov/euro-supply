package com.nvt.eurosupply.shared.models;

import lombok.*;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ExceptionResponse {
    private String error;
    private String message;
    private String path;
    private int status;
    private Instant timestamp;
}
