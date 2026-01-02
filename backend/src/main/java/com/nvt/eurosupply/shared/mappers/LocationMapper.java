package com.nvt.eurosupply.shared.mappers;

import com.nvt.eurosupply.shared.dtos.LocationResponseDto;
import com.nvt.eurosupply.shared.models.Location;
import org.springframework.stereotype.Component;

@Component
public class LocationMapper {

    public LocationResponseDto toResponse(Location location) {
        return new LocationResponseDto(location.getLatitude(), location.getLongitude(), location.getTimestamp());
    }
}
