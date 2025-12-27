package com.nvt.eurosupply.shared.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum FileFolder {
    VEHICLE("vehicle"),
    COMPANY("company"),
    PRODUCT("product"),
    FACTORY("factory");

    private final String path;
}
