package com.nvt.eurosupply.email.services;

import com.nvt.eurosupply.email.models.EmailRequest;
import com.nvt.eurosupply.email.models.EmailTemplate;
import com.nvt.eurosupply.product.models.Order;
import com.nvt.eurosupply.shared.services.PdfService;
import com.nvt.eurosupply.user.models.User;
import com.nvt.eurosupply.user.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
@Service
@RequiredArgsConstructor

public class ProductEmailService {

    private final EmailService emailService;
    private final PdfService pdfService;
    private final UserService userService;

    public void sendInvoice(Order order) {
        User loggedIn = userService.getCurrentUser();

        byte[] pdfBytes = generateInvoicePdf(order, loggedIn);
        sendInvoiceEmail(order, loggedIn, pdfBytes);
    }

    private byte[] generateInvoicePdf(Order order, User user) {
        Map<String, Object> reportParams = new HashMap<>();
        reportParams.put("productName", order.getProduct().getName());
        reportParams.put("customerName", user.getPerson().getFirstname());
        reportParams.put("companyName", order.getCompany().getName());
        reportParams.put(
                "totalPrice",
                order.getQuantity() * order.getProduct().getPrice()
        );

        return pdfService.generate(
                "/reports/invoice.jrxml",
                List.of(order),
                reportParams
        );
    }

    private void sendInvoiceEmail(Order order, User user, byte[] pdfBytes) {
        Map<String, Object> templateVars = new HashMap<>();
        templateVars.put("customerName", user.getPerson().getFirstname());
        templateVars.put(
                "totalPrice",
                order.getQuantity() * order.getProduct().getPrice()
        );

        emailService.sendEmail(
                EmailRequest.builder()
                        .to(user.getEmail())
                        .subject(EmailTemplate.ORDER_INVOICE.getDefaultSubject())
                        .templateName(
                                EmailTemplate.ORDER_INVOICE.getTemplatePath()
                        )
                        .templateVariables(templateVars)
                        .attachmentBytes(pdfBytes)
                        .attachmentFilename("invoice.pdf")
                        .build()
        );
    }
}