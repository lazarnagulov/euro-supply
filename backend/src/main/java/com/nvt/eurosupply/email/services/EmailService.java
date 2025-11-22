package com.nvt.eurosupply.email.services;

import com.nvt.eurosupply.email.exceptions.EmailException;
import com.nvt.eurosupply.email.models.EmailRequest;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Value("${app.email.from:noreply@eurosupply.com}")
    private String fromEmail;

    @Async
    public void sendEmail(EmailRequest emailRequest) {
        try {
            log.info("Sending email to: {} with template: {}",
                    emailRequest.getTo(), emailRequest.getTemplateName());

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(emailRequest.getFrom() != null ? emailRequest.getFrom() : fromEmail);
            helper.setTo(emailRequest.getTo());
            helper.setSubject(emailRequest.getSubject());

            String htmlContent = processTemplate(emailRequest.getTemplateName(), emailRequest.getTemplateVariables());
            helper.setText(htmlContent, true);
            mailSender.send(message);

            log.info("Email sent successfully to: {}", emailRequest.getTo());

        } catch (MessagingException e) {
            log.error("Failed to send email to: {} - Error: {}",
                    emailRequest.getTo(), e.getMessage());
            throw new EmailException("Failed to send email", e);
        }
    }

    private String processTemplate(String templateName, Map<String, Object> templateVariables) {
        Context context = new Context();
        context.setVariables(templateVariables);
        return templateEngine.process(
                templateName,
                context
        );
    }
}
