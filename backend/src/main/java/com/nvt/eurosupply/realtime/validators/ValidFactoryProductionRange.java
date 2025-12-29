package com.nvt.eurosupply.realtime.validators;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = FactoryProductionRangeValidator.class)
public @interface ValidFactoryProductionRange {
    String message() default "Invalid production date range";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
