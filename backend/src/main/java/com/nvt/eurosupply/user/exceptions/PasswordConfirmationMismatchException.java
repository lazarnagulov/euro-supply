package com.nvt.eurosupply.user.exceptions;

public class PasswordConfirmationMismatchException extends RuntimeException {
    public PasswordConfirmationMismatchException() {
        super("Password confirmation does not match new password.");
    }
}
