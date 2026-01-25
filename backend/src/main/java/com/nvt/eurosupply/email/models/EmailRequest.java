package com.nvt.eurosupply.email.models;

import lombok.Builder;
import lombok.Data;
import lombok.Singular;

import java.util.Map;

@Data
@Builder
public class EmailRequest {
    private String to;
    private String from;
    private String subject;
    private String templateName;
    @Singular
    private final Map<String, Object> templateVariables;
    private final byte[] attachmentBytes;
    private final String attachmentFilename;
}
