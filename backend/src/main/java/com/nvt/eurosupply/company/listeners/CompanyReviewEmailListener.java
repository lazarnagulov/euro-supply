package com.nvt.eurosupply.company.listeners;

import com.nvt.eurosupply.company.events.CompanyReviewedEvent;
import com.nvt.eurosupply.email.facades.CompanyEmailFacade;
import com.nvt.eurosupply.email.services.CompanyEmailService;
import com.nvt.eurosupply.email.services.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
public class CompanyReviewEmailListener {

    private final CompanyEmailFacade facade;

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleCompanyReviewed(CompanyReviewedEvent event) {
        facade.sendReviewEmail(
                event.company(),
                event.customer(),
                event.status(),
                event.rejectionReason()
        );
    }
}

