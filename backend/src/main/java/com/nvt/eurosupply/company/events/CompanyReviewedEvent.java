package com.nvt.eurosupply.company.events;

import com.nvt.eurosupply.company.enums.RequestStatus;
import com.nvt.eurosupply.company.models.Company;
import com.nvt.eurosupply.user.models.User;

public record CompanyReviewedEvent(
        Company company,
        User customer,
        RequestStatus status,
        String rejectionReason
) {}
