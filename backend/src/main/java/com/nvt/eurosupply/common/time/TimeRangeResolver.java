package com.nvt.eurosupply.common.time;

import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Component
public class TimeRangeResolver {

    public TimeRange resolve(String period, Instant from, Instant to) {
        Instant now = Instant.now();

        if (from != null && to != null) {
            return new TimeRange(from, to);
        }

        return switch (period) {
            case "7d" -> new TimeRange(now.minus(7, ChronoUnit.DAYS), now);
            case "30d" -> new TimeRange(now.minus(30, ChronoUnit.DAYS), now);
            case "90d" -> new TimeRange(now.minus(90, ChronoUnit.DAYS), now);
            case "180d" -> new TimeRange(now.minus(180, ChronoUnit.DAYS), now);
            default -> new TimeRange(now.minus(365, ChronoUnit.DAYS), now);
        };
    }
}
