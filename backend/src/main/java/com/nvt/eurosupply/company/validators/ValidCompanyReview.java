package com.nvt.eurosupply.company.validators;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ ElementType.TYPE })
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = ReviewCompanyValidator.class)
public @interface ValidCompanyReview {
    String message() default "Invalid company review request";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
