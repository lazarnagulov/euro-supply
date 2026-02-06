package com.nvt.eurosupply.vehicle.mappers;

import com.influxdb.query.FluxRecord;
import com.nvt.eurosupply.realtime.dtos.vehicle.VehicleAvailabilityDto;
import com.nvt.eurosupply.realtime.dtos.vehicle.VehicleAvailabilitySummaryDto;
import com.nvt.eurosupply.realtime.dtos.vehicle.VehicleDistanceDto;
import com.nvt.eurosupply.shared.enums.FileFolder;
import com.nvt.eurosupply.shared.mappers.FileMapper;
import com.nvt.eurosupply.shared.mappers.LocationMapper;
import com.nvt.eurosupply.shared.models.PagedResponse;
import com.nvt.eurosupply.vehicle.dtos.CreateVehicleRequestDto;
import com.nvt.eurosupply.vehicle.dtos.VehicleBrandDto;
import com.nvt.eurosupply.vehicle.dtos.VehicleModelDto;
import com.nvt.eurosupply.vehicle.dtos.VehicleResponseDto;
import com.nvt.eurosupply.vehicle.models.Vehicle;
import com.nvt.eurosupply.vehicle.models.VehicleBrand;
import com.nvt.eurosupply.vehicle.models.VehicleLocation;
import com.nvt.eurosupply.vehicle.models.VehicleModel;
import com.nvt.eurosupply.vehicle.models.VehicleStatus;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class VehicleMapper {

    private final ModelMapper modelMapper;
    private final FileMapper fileMapper;
    private final LocationMapper locationMapper;

    public Vehicle fromCreateRequest(CreateVehicleRequestDto request) {
        Vehicle vehicle = new Vehicle();
        vehicle.setRegistrationNumber(request.getRegistrationNumber());
        vehicle.setMaxLoadKg(request.getMaxLoadKg());
        return vehicle;
    }

    public VehicleResponseDto toResponse(Vehicle vehicle) {
        return toResponse(vehicle, null, null);
    }

    public VehicleResponseDto toResponse(Vehicle vehicle, VehicleLocation location, VehicleStatus status) {
        VehicleResponseDto response = modelMapper.map(vehicle, VehicleResponseDto.class);

        if (location != null && location.getLocation() != null) {
            response.setLastLocation(locationMapper.toResponse(location.getLocation()));
        }

        if (status != null) {
            response.setOnline(status.getIsOnline());
        }

        response.setImageUrls(
                Optional.ofNullable(vehicle.getImages())
                        .orElseGet(List::of)
                        .stream()
                        .map(f -> fileMapper.toResponse(
                                FileFolder.VEHICLE, vehicle.getId(), f))
                        .toList()
        );

        return response;
    }

    public VehicleBrandDto toResponse(VehicleBrand brand) {
        return modelMapper.map(brand, VehicleBrandDto.class);
    }

    public VehicleModelDto toResponse(VehicleModel model) {
        return modelMapper.map(model, VehicleModelDto.class);
    }

    public VehicleAvailabilityDto fromFluxRecord(FluxRecord fluxRecord, DateTimeFormatter formatter) {
        VehicleAvailabilityDto response = new VehicleAvailabilityDto();
        Instant timestamp = fluxRecord.getTime();
        response.setTimestamp(timestamp);
        assert timestamp != null;
        response.setLabel(timestamp.atZone(ZoneId.systemDefault()).format(formatter));

        Object onlineValue = fluxRecord.getValueByKey("online_minutes");
        Object offlineValue = fluxRecord.getValueByKey("offline_minutes");

        long onlineMinutes = onlineValue != null ? ((Number) onlineValue).longValue() : 0L;
        long offlineMinutes = offlineValue != null ? ((Number) offlineValue).longValue() : 0L;
        long totalMinutes = onlineMinutes + offlineMinutes;

        response.setOnlineMinutes(onlineMinutes);
        response.setOfflineMinutes(offlineMinutes);
        response.setOnlinePercentage(totalMinutes > 0 ? (onlineMinutes * 100.0 / totalMinutes) : 0.0);

        return response;
    }

    public VehicleDistanceDto fromFluxRecord(FluxRecord fluxRecord) {
        VehicleDistanceDto response = new VehicleDistanceDto();
        response.setTime(fluxRecord.getTime());
        response.setDistanceTraveled(
                fluxRecord.getValue() == null ? null : ((Number) fluxRecord.getValue()).doubleValue()
        );
        return response;
    }

    public PagedResponse<VehicleResponseDto> toPagedResponse(Page<Vehicle> page) {
        return new PagedResponse<>(
                page.getContent().stream()
                        .map(this::toResponse)
                        .toList(),
                page.getTotalPages(),
                page.getTotalElements()
        );
    }

    public PagedResponse<VehicleResponseDto> toPagedResponse(
            Page<Vehicle> page,
            List<VehicleLocation> locations,
            List<VehicleStatus> statuses
    ) {
        Map<Long, VehicleLocation> locationMap = locations.stream()
                .collect(Collectors.toMap(VehicleLocation::getVehicleId, loc -> loc));

        Map<Long, VehicleStatus> statusMap = statuses.stream()
                .collect(Collectors.toMap(VehicleStatus::getVehicleId, stat -> stat));

        return new PagedResponse<>(
                page.getContent().stream()
                        .map(vehicle -> toResponse(
                                vehicle,
                                locationMap.get(vehicle.getId()),
                                statusMap.get(vehicle.getId())
                        ))
                        .toList(),
                page.getTotalPages(),
                page.getTotalElements()
        );
    }

    public VehicleAvailabilitySummaryDto toSummary(List<VehicleAvailabilityDto> dataPoints, Instant start, Instant end) {
        long totalOnlineMinutes = dataPoints.stream()
                .mapToLong(VehicleAvailabilityDto::getOnlineMinutes)
                .sum();

        long totalOfflineMinutes = dataPoints.stream()
                .mapToLong(VehicleAvailabilityDto::getOfflineMinutes)
                .sum();

        long totalMinutes = totalOnlineMinutes + totalOfflineMinutes;

        if (totalMinutes == 0) {
            totalMinutes = ChronoUnit.MINUTES.between(start, end);
            totalOfflineMinutes = totalMinutes;
        }

        VehicleAvailabilitySummaryDto summary = new VehicleAvailabilitySummaryDto();
        summary.setTotalOnlineMinutes(totalOnlineMinutes);
        summary.setTotalOfflineMinutes(totalOfflineMinutes);
        summary.setOnlinePercentage(totalMinutes > 0 ? (totalOnlineMinutes * 100.0 / totalMinutes) : 0.0);
        summary.setOfflinePercentage(totalMinutes > 0 ? (totalOfflineMinutes * 100.0 / totalMinutes) : 0.0);
        summary.setDataPoints(dataPoints);

        return summary;
    }
}