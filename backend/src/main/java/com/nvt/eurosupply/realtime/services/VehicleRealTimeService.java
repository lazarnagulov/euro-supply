package com.nvt.eurosupply.realtime.services;

import com.influxdb.client.InfluxDBClient;
import com.influxdb.client.WriteApiBlocking;
import com.influxdb.client.domain.WritePrecision;
import com.influxdb.client.write.Point;
import com.nvt.eurosupply.realtime.dtos.vehicle.*;
import com.nvt.eurosupply.realtime.messages.VehicleLocationMessage;
import com.nvt.eurosupply.realtime.queries.VehicleFlux;
import com.nvt.eurosupply.shared.components.TimeWindowCalculator;
import com.nvt.eurosupply.vehicle.events.StatusChangeEvent;
import com.nvt.eurosupply.vehicle.mappers.VehicleMapper;
import com.nvt.eurosupply.vehicle.services.VehicleService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class VehicleRealTimeService {

    private final WriteApiBlocking writeApi;
    private final InfluxQueryService service;
    private final VehicleService vehicleService;
    private final TimeWindowCalculator timeWindowCalculator;
    private final InfluxQueryService influxQueryService;
    private final VehicleMapper vehicleMapper;
    private final VehicleFlux vehicleFlux;

    public VehicleRealTimeService(
            @Qualifier("vehicleInfluxClient") InfluxDBClient influxDBClient,
            InfluxQueryService service,
            VehicleService vehicleService,
            TimeWindowCalculator timeWindowCalculator,
            InfluxQueryService influxQueryService, VehicleMapper vehicleMapper, VehicleFlux vehicleFlux) {
        this.writeApi = influxDBClient.getWriteApiBlocking();
        this.service = service;
        this.vehicleService = vehicleService;
        this.timeWindowCalculator = timeWindowCalculator;
        this.influxQueryService = influxQueryService;
        this.vehicleMapper = vehicleMapper;
        this.vehicleFlux = vehicleFlux;
    }

    public void saveStatusChanges(List<StatusChangeEvent> statusChanges) {
        if (statusChanges == null || statusChanges.isEmpty())
            return;

        List<Point> points = statusChanges.stream()
                .map(change -> Point
                        .measurement("vehicle_availability")
                        .addTag("vehicle_id", String.valueOf(change.vehicleId()))
                        .addField("is_online", change.isOnline())
                        .time(change.timestamp(), WritePrecision.NS))
                .toList();

        writeApi.writePoints(points);
    }

    public List<VehicleDistanceDto> getDistances(Long id, VehicleDistanceRequestDto request) {
        if(!vehicleService.vehicleExists(id)) {
            throw new EntityNotFoundException("Vehicle not found");
        }

        Instant start = request.getStart();
        Instant end = request.getEnd();
        String window = timeWindowCalculator.calculateWindowDuration(start, end);

        String query = vehicleFlux.getDistances(id, start, end, window);
        return service.query(query, vehicleMapper::fromFluxRecord).toList();
    }

    public VehicleAvailabilitySummaryDto getAvailabilitySummary(Long id, VehicleAvailabilityRequestDto request) {
        vehicleService.find(id);

        Instant start = request.getStart();
        Instant end = request.getEnd();
        String window = timeWindowCalculator.calculateWindowDuration(start, end);

        List<VehicleAvailabilityDto> dataPoints = getAggregatedAvailability(id, start, end, window);
        return vehicleMapper.toSummary(dataPoints, start, end);
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
                .measurement("vehicle_availability")
                .addTag("vehicle_id", String.valueOf(vehicleId))
                .addField("is_online", isOnline)
                .time(timestamp, WritePrecision.NS);

        writeApi.writePoint(point);
    }

    private List<VehicleAvailabilityDto> getAggregatedAvailability(Long vehicleId, Instant start, Instant end, String window) {
        String query = vehicleFlux.getAggregatedAvailability(vehicleId, start, end, window);
        DateTimeFormatter formatter = timeWindowCalculator.getFormatterForWindow(window);
        return influxQueryService.query(query, fluxRecord -> vehicleMapper.fromFluxRecord(fluxRecord, formatter)).toList();
    }
}