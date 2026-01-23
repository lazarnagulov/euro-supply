package com.nvt.eurosupply.user.exceptions;

public class PasswordNotChangedException extends RuntimeException {
    public PasswordNotChangedException() {
        super("New password must be different from the old password.");
    }
}
