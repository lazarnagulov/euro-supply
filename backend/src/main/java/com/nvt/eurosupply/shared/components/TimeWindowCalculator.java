package com.nvt.eurosupply.shared.components;

import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.time.format.DateTimeFormatter;

@Component
public class TimeWindowCalculator {

    public String calculateWindowDuration(Instant start, Instant stop) {
        Duration d = Duration.between(start, stop);

        long hours = d.toHours();
        long days = d.toDays();

        if (hours < 1) return "1m";
        if (hours <= 6) return "5m";
        if (hours <= 24) return "15m";
        if (days <= 7) return "1h";
        if (days <= 30) return "6h";
        if (days <= 90) return "1d";
        if (days <= 365) return "1w";

        return "1mo";
    }

    public DateTimeFormatter getFormatterForWindow(String window) {
        if (window.endsWith("h") || window.equals("1d"))
            return DateTimeFormatter.ofPattern("MMM dd HH:mm");
        else if (window.endsWith("d") || window.endsWith("w"))
            return DateTimeFormatter.ofPattern("MMM dd");
        else if (window.endsWith("mo"))
            return DateTimeFormatter.ofPattern("MMM yyyy");
        else
            return DateTimeFormatter.ofPattern("MMM dd");
    }

}