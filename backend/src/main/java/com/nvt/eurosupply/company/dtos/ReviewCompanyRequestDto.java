package com.nvt.eurosupply.company.dtos;

import com.nvt.eurosupply.company.enums.RequestStatus;
import com.nvt.eurosupply.company.validators.ValidCompanyReview;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ValidCompanyReview
public class ReviewCompanyRequestDto {
    @NotNull(message = "Status is mandatory")
    private RequestStatus status;
    private String rejectionReason;
}
