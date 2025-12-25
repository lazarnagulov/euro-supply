package com.nvt.eurosupply.realtime.validators;

import com.nvt.eurosupply.realtime.dtos.VehicleDistanceRequestDto;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.time.Duration;
import java.time.Instant;

public class VehicleLocationRangeValidator implements ConstraintValidator<ValidVehicleLocationRange, VehicleDistanceRequestDto> {

    @Override
    public boolean isValid(VehicleDistanceRequestDto request, ConstraintValidatorContext context) {
        if (request == null) return false;

        Instant start = request.getStart();
        Instant end = request.getEnd();

        if (start == null || end == null) return false;

        if (!start.isBefore(end)) {
            context.buildConstraintViolationWithTemplate("Start must be before end")
                    .addPropertyNode("start")
                    .addConstraintViolation();
            return false;
        }

        long days = Duration.between(start, end).toDays();
        if (days > 365) {
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

