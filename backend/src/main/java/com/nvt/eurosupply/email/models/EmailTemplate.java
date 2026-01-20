package com.nvt.eurosupply.email.models;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum EmailTemplate {
    COMPANY_APPROVAL("emails/company-approval", "Company Registration Approved"),
    COMPANY_REJECTION("emails/company-rejection", "Company Registration Update"),
    ACCOUNT_VERIFICATION("emails/account-verification", "Account Verification");

    private final String templatePath;
    private final String defaultSubject;

    public String getSubjectWithPrefix(String customPrefix) {
        return customPrefix + " - " + defaultSubject;
    }
}
