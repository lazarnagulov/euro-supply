package com.nvt.eurosupply.realtime.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TimeRangeRequestDto {
    private String period;
    private Instant start;
    private Instant end;
}
