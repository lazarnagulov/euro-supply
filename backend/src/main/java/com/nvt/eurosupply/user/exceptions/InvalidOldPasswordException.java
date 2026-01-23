package com.nvt.eurosupply.user.exceptions;

public class InvalidOldPasswordException extends RuntimeException {
    public InvalidOldPasswordException() {
        super("Old password is incorrect.");
    }
}
