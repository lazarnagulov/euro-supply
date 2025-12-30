package com.nvt.eurosupply.realtime.validators;

import java.time.Instant;

public interface DateRangeRequest {
    Instant getStart();
    Instant getEnd();
}