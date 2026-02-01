package com.nvt.eurosupply.realtime.services;

import com.influxdb.client.InfluxDBClient;
import com.influxdb.client.WriteApiBlocking;
import com.influxdb.client.domain.WritePrecision;
import com.influxdb.client.write.Point;
import com.nvt.eurosupply.realtime.dtos.VehicleDistanceDto;
import com.nvt.eurosupply.realtime.dtos.VehicleDistanceRequestDto;
import com.nvt.eurosupply.realtime.messages.VehicleHeartbeatMessage;
import com.nvt.eurosupply.realtime.messages.VehicleLocationMessage;
import com.nvt.eurosupply.shared.components.TimeWindowCalculator;
import com.nvt.eurosupply.vehicle.services.VehicleService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class VehicleRealTimeService {

    private final WriteApiBlocking writeApi;
    private final InfluxQueryService service;
    private final VehicleService vehicleService;
    private final TimeWindowCalculator timeWindowCalculator;

    public VehicleRealTimeService(
            @Qualifier("vehicleInfluxClient") InfluxDBClient influxDBClient,
            InfluxQueryService service,
            VehicleService vehicleService,
            TimeWindowCalculator timeWindowCalculator
    ) {
        this.writeApi = influxDBClient.getWriteApiBlocking();
        this.service = service;
        this.vehicleService = vehicleService;
        this.timeWindowCalculator = timeWindowCalculator;
    }

    public List<VehicleDistanceDto> getDistances(Long id, VehicleDistanceRequestDto request) {
        if(!vehicleService.vehicleExists(id)) {
            throw new EntityNotFoundException("Vehicle not found");
        }

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

    public void saveHearthBeat(VehicleHeartbeatMessage heartbeat) {
        Point point = Point
                .measurement("vehicle_availability")
                .addTag("vehicle_id", String.valueOf(heartbeat.getVehicleId()))
                .addField("status", heartbeat.getStatus().ordinal())
                .time(heartbeat.getTimestamp(), WritePrecision.NS);

        writeApi.writePoint(point);
    }

}