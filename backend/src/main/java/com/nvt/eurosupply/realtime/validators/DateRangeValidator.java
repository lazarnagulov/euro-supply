package com.nvt.eurosupply.realtime.validators;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.time.Duration;
import java.time.Instant;

public class DateRangeValidator
        implements ConstraintValidator<ValidDateRange, DateRangeRequest> {

    @Override
    public boolean isValid(DateRangeRequest request,
                           ConstraintValidatorContext context) {

        if (request == null) return false;

        Instant start = request.getStart();
        Instant end = request.getEnd();

        if (start == null || end == null) return false;

        context.disableDefaultConstraintViolation();

        if (!start.isBefore(end)) {
            context.buildConstraintViolationWithTemplate("Start must be before end")
                    .addPropertyNode("start")
                    .addConstraintViolation();
            return false;
        }

        if (Duration.between(start, end).toDays() > 365) {
            context.buildConstraintViolationWithTemplate("Date range cannot exceed 1 year")
                    .addPropertyNode("end")
                    .addConstraintViolation();
            return false;
        }

        Instant now = Instant.now();
        if (start.isAfter(now) || end.isAfter(now)) {
            context.buildConstraintViolationWithTemplate("Dates cannot be in the future")
                    .addPropertyNode("start")
                    .addConstraintViolation();
            return false;
        }

        return true;
    }
}
