package com.nvt.eurosupply.company.dtos;

import com.nvt.eurosupply.company.models.RequestStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReviewCompanyRequestDto {
    @NotNull(message = "Status is mandatory")
    private RequestStatus status;
    private String rejectionReason;
}
