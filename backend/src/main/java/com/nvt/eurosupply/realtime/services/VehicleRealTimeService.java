package com.nvt.eurosupply.realtime.services;

import com.influxdb.client.InfluxDBClient;
import com.influxdb.client.WriteApiBlocking;
import com.influxdb.client.domain.WritePrecision;
import com.influxdb.client.write.Point;
import com.nvt.eurosupply.realtime.dtos.vehicle.*;
import com.nvt.eurosupply.realtime.messages.VehicleLocationMessage;
import com.nvt.eurosupply.shared.components.TimeWindowCalculator;
import com.nvt.eurosupply.vehicle.events.StatusChangeEvent;
import com.nvt.eurosupply.vehicle.mappers.VehicleMapper;
import com.nvt.eurosupply.vehicle.services.VehicleService;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class VehicleRealTimeService {

    private final WriteApiBlocking writeApi;
    private final InfluxQueryService service;
    private final VehicleService vehicleService;
    private final TimeWindowCalculator timeWindowCalculator;
    private final InfluxQueryService influxQueryService;
    private final VehicleMapper vehicleMapper;

    public VehicleRealTimeService(
            @Qualifier("vehicleInfluxClient") InfluxDBClient influxDBClient,
            InfluxQueryService service,
            VehicleService vehicleService,
            TimeWindowCalculator timeWindowCalculator,
            InfluxQueryService influxQueryService, VehicleMapper vehicleMapper) {
        this.writeApi = influxDBClient.getWriteApiBlocking();
        this.service = service;
        this.vehicleService = vehicleService;
        this.timeWindowCalculator = timeWindowCalculator;
        this.influxQueryService = influxQueryService;
        this.vehicleMapper = vehicleMapper;
    }

    public void saveStatusChanges(List<StatusChangeEvent> statusChanges) {
        if (statusChanges == null || statusChanges.isEmpty())
            return;

        List<Point> points = statusChanges.stream()
                .map(change -> Point
                        .measurement("vehicle_status_change")
                        .addTag("vehicle_id", String.valueOf(change.vehicleId()))
                        .addField("is_online", change.isOnline())
                        .time(change.timestamp(), WritePrecision.NS))
                .toList();

        writeApi.writePoints(points);
    }

    public List<VehicleDistanceDto> getDistances(Long id, VehicleDistanceRequestDto request) {
        vehicleService.find(id);
        Instant start = request.getStart();
        Instant end = request.getEnd();
        String window = timeWindowCalculator.calculateWindowDuration(start, end);

        String query = String.format(
                """
                from(bucket: "vehicle")
                |> range(start: %s, stop: %s)
                |> filter(fn: (r) => r["vehicle_id"] == "%d")
                |> filter(fn: (r) => r["_measurement"] == "vehicle_location")
                |> filter(fn: (r) => r["_field"] == "distance_traveled")
                |> aggregateWindow(every: %s, fn: sum, createEmpty: false)
                |> yield()
                """,
                start, end, id, window
        );

        return service.query(query, fluxRecord -> {
            VehicleDistanceDto dto = new VehicleDistanceDto();
            dto.setTime(fluxRecord.getTime());
            dto.setDistanceTraveled(
                    fluxRecord.getValue() == null ? null : ((Number) fluxRecord.getValue()).doubleValue()
            );
            return dto;
        }).toList();
    }

    public VehicleAvailabilitySummaryDto getAvailabilitySummary(Long id, VehicleAvailabilityRequestDto request) {
        vehicleService.find(id);

        Instant start = request.getStart();
        Instant end = request.getEnd();
        String window = timeWindowCalculator.calculateWindowDuration(start, end);

        List<VehicleAvailabilityDto> dataPoints = getAggregatedAvailability(id, start, end, window);
        return calculateSummary(dataPoints, start, end);
    }

    public void saveLocation(VehicleLocationMessage location) {
        Point point = Point
                .measurement("vehicle_location")
                .addTag("vehicle_id", String.valueOf(location.getVehicleId()))
                .addField("type", location.getType())
                .addField("latitude", location.getLatitude())
                .addField("longitude", location.getLongitude())
                .addField("distance_traveled", location.getDistanceTraveled())
                .time(location.getTimestamp(), WritePrecision.NS);

        writeApi.writePoint(point);
    }

    public void saveStatusChange(Long vehicleId, boolean isOnline, Instant timestamp) {
        Point point = Point
                .measurement("vehicle_status_change")
                .addTag("vehicle_id", String.valueOf(vehicleId))
                .addField("is_online", isOnline)
                .time(timestamp, WritePrecision.NS);

        writeApi.writePoint(point);
    }

    private List<VehicleAvailabilityDto> getAggregatedAvailability(Long vehicleId, Instant start, Instant end, String window) {
        String query = String.format(
            """
            from(bucket: "vehicle")
              |> range(start: %s, stop: %s)
              |> filter(fn: (r) => r["_measurement"] == "vehicle_availability")
              |> filter(fn: (r) => r["vehicle_id"] == "%d")
              |> filter(fn: (r) => r["_field"] == "is_online")
              |> sort(columns: ["_time"])
              |> elapsed(unit: 1m)
              |> window(every: %s, createEmpty: false)
              |> map(fn: (r) => ({
                  r with
                  online_minutes: if r._value == true then r.elapsed else 0,
                  offline_minutes: if r._value == false then r.elapsed else 0
              }))
              |> reduce(
                  identity: {online_minutes: 0, offline_minutes: 0},
                  fn: (r, accumulator) => ({
                      online_minutes: accumulator.online_minutes + r.online_minutes,
                      offline_minutes: accumulator.offline_minutes + r.offline_minutes
                  })
              )
              |> duplicate(column: "_stop", as: "_time")
              |> drop(columns: ["_start"])
              |> yield(name: "availability")
            """,
            start, end, vehicleId, window
        );

        DateTimeFormatter formatter = getFormatterForWindow(window);
        return influxQueryService.query(query, fluxRecord -> vehicleMapper.fromFluxRecord(fluxRecord, formatter)).toList();
    }

    private DateTimeFormatter getFormatterForWindow(String window) {
        if (window.endsWith("h") || window.equals("1d")) {
            return DateTimeFormatter.ofPattern("MMM dd HH:mm");
        } else if (window.endsWith("d")) {
            return DateTimeFormatter.ofPattern("MMM dd");
        } else {
            return DateTimeFormatter.ofPattern("'Week' w");
        }
    }

    private VehicleAvailabilitySummaryDto calculateSummary(List<VehicleAvailabilityDto> dataPoints, Instant start, Instant end) {
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