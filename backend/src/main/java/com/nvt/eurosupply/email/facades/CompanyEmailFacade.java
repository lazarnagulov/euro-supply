package com.nvt.eurosupply.email.facades;

import com.nvt.eurosupply.company.enums.RequestStatus;
import com.nvt.eurosupply.company.models.Company;
import com.nvt.eurosupply.email.services.CompanyEmailService;
import com.nvt.eurosupply.user.models.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CompanyEmailFacade {

    private final CompanyEmailService emailService;

    public void sendReviewEmail(
            Company company,
            User customer,
            RequestStatus status,
            String rejectionReason
    ) {
        if (status == RequestStatus.APPROVED) {
            emailService.sendApprovalEmail(
                    company,
                    customer.getEmail(),
                    customer.getUsername()
            );
        } else if (status == RequestStatus.REJECTED) {
            emailService.sendRejectionEmail(
                    company,
                    customer.getEmail(),
                    customer.getUsername(),
                    rejectionReason
            );
        }
    }
}

