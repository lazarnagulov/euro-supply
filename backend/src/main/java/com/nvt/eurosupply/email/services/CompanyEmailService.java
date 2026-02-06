package com.nvt.eurosupply.email.services;

import com.nvt.eurosupply.company.models.Company;
import com.nvt.eurosupply.email.models.EmailRequest;
import com.nvt.eurosupply.email.models.EmailTemplate;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CompanyEmailService {

    private final EmailService emailService;

    @Value("${app.base-url:http://localhost:3000}")
    private String baseUrl;

    public void sendApprovalEmail(Company company, String customerEmail, String customerName) {
        Map<String, Object> variables = new HashMap<>();
        variables.put("customerName", customerName);
        variables.put("company", createCompanyMap(company));
        variables.put("dashboardUrl", baseUrl + "/dashboard");
        variables.put("baseUrl", baseUrl);

        EmailRequest request = EmailRequest.builder()
                .to(customerEmail)
                .subject(EmailTemplate.COMPANY_APPROVAL.getDefaultSubject() + " - " + company.getName())
                .templateName(EmailTemplate.COMPANY_APPROVAL.getTemplatePath())
                .templateVariables(variables)
                .build();

        emailService.sendEmail(request);
    }

    public void sendRejectionEmail(
        Company company,
        String customerEmail,
        String customerName,
        String rejectionReason
    ) {
        Map<String, Object> variables = new HashMap<>();
        variables.put("customerName", customerName);
        variables.put("company", createCompanyMap(company));
        variables.put("rejectionReason", rejectionReason);
        variables.put("resubmitUrl", baseUrl + "/company-registration/");
        variables.put("baseUrl", baseUrl);

        EmailRequest request = EmailRequest.builder()
                .to(customerEmail)
                .subject(EmailTemplate.COMPANY_REJECTION.getDefaultSubject() + " - " + company.getName())
                .templateName(EmailTemplate.COMPANY_REJECTION.getTemplatePath())
                .templateVariables(variables)
                .build();

        emailService.sendEmail(request);
    }

    private Map<String, Object> createCompanyMap(Company company) {
        Map<String, Object> map = new HashMap<>();
        map.put("name", company.getName());
        map.put("address", company.getAddress());
        map.put("city", company.getCity() != null ? company.getCity().getName() : "N/A");
        map.put("country", company.getCountry() != null ? company.getCountry().getName() : "N/A");
        return map;
    }
}
