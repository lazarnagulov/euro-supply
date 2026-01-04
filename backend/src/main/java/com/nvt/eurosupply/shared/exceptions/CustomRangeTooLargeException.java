package com.nvt.eurosupply.shared.exceptions;

public class CustomRangeTooLargeException extends RuntimeException {
    public CustomRangeTooLargeException(String message) {
        super(message);
    }

    public CustomRangeTooLargeException() {
        super("Custom range cannot exceed 1 year.");
    }
}