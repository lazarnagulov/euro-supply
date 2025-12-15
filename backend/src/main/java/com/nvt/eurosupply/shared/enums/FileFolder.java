package com.nvt.eurosupply.shared.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum FileFolder {
    VEHICLE("vehicle"),
    COMPANY("company");

    private final String path;
}
