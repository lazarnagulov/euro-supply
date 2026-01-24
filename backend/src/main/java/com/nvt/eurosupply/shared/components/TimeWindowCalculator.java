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

        if (hours <= 3) return "15m";
        if (hours <= 6) return "30m";
        if (hours <= 12) return "1h";
        if (hours <= 24) return "2h";
        if (days <= 3) return "3h";
        if (days <= 7) return "6h";
        if (days <= 30) return "1d";
        if (days <= 90) return "3d";
        if (days <= 180) return "1w";
        if (days <= 365) return "2w";

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