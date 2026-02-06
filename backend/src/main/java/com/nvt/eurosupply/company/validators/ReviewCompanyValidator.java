package com.nvt.eurosupply.company.validators;

import com.nvt.eurosupply.company.dtos.ReviewCompanyRequestDto;
import com.nvt.eurosupply.company.enums.RequestStatus;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class ReviewCompanyValidator
        implements ConstraintValidator<ValidCompanyReview, ReviewCompanyRequestDto> {

    @Override
    public boolean isValid(ReviewCompanyRequestDto request, ConstraintValidatorContext context) {
        context.disableDefaultConstraintViolation();

        if (request.getStatus() == RequestStatus.PENDING) {
            context.buildConstraintViolationWithTemplate(
                            "Status PENDING is not allowed when reviewing a company"
                    )
                    .addPropertyNode("status")
                    .addConstraintViolation();

            return false;
        }

        if (request.getStatus() == RequestStatus.REJECTED &&
                (request.getRejectionReason() == null || request.getRejectionReason().isBlank())) {
                context.buildConstraintViolationWithTemplate(
                                "Rejection reason is mandatory when status is REJECTED"
                        )
                        .addPropertyNode("rejectionReason")
                        .addConstraintViolation();

                return false;
            }


        if (request.getStatus() == RequestStatus.APPROVED && request.getRejectionReason() != null
                && !request.getRejectionReason().isBlank()) {
                context.buildConstraintViolationWithTemplate(
                                "Rejection reason must be empty when status is APPROVED"
                        )
                        .addPropertyNode("rejectionReason")
                        .addConstraintViolation();

                return false;
            }


        return true;
    }
}

