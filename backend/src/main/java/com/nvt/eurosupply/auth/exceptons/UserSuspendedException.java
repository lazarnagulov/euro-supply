package com.nvt.eurosupply.auth.exceptons;

public class UserSuspendedException extends RuntimeException {

    public UserSuspendedException(String message) {
        super(message);
    }
}