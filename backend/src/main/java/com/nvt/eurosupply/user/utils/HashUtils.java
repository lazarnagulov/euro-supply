package com.nvt.eurosupply.user.utils;

import java.util.UUID;

public class HashUtils {

    private HashUtils() {}

    public static String generateHash() {
        return UUID.randomUUID().toString();
    }
}