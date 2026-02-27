package com.nvt.eurosupply.shared.exceptions;

public class FileAuthorizationException extends RuntimeException {
    public FileAuthorizationException() {
        super("You are not allowed to view this file");
    }
}
