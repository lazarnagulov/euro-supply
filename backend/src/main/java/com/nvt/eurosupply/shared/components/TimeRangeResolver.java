package com.nvt.eurosupply.shared.components;

import com.nvt.eurosupply.shared.records.TimeRange;
import com.nvt.eurosupply.shared.exceptions.CustomRangeTooLargeException;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Component
public class TimeRangeResolver {

    public TimeRange resolve(String period, Instant from, Instant to) {
        Instant now = Instant.now();

        if (from != null && to != null) {
            long daysBetween = ChronoUnit.DAYS.between(from, to);
            if (daysBetween > 365)
                throw new CustomRangeTooLargeException();
            
            return new TimeRange(from, to);
        }

        if (period == null || period.isBlank()) {
            return new TimeRange(now.minus(365, ChronoUnit.DAYS), now);
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
