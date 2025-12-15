package com.nvt.eurosupply.realtime.services;

import com.influxdb.client.InfluxDBClient;
import com.influxdb.client.WriteApiBlocking;
import com.influxdb.client.domain.WritePrecision;
import com.influxdb.client.write.Point;
import com.nvt.eurosupply.realtime.messages.VehicleHeartbeatMessage;
import com.nvt.eurosupply.realtime.messages.VehicleLocationMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class VehicleRealTimeService {

    private final WriteApiBlocking writeApi;

    @Autowired
    public VehicleRealTimeService(InfluxDBClient client) {
        writeApi = client.getWriteApiBlocking();
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
