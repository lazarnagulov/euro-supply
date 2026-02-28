package com.nvt.eurosupply.realtime.services;

import com.influxdb.client.InfluxDBClient;
import com.influxdb.client.WriteApiBlocking;
import com.influxdb.client.domain.WritePrecision;
import com.influxdb.client.write.Point;
import com.nvt.eurosupply.realtime.dtos.warehouse.SectorTemperatureChartDto;
import com.nvt.eurosupply.realtime.messages.WarehouseHeartbeatMessage;
import com.nvt.eurosupply.realtime.messages.WarehouseReportMessage;
import com.nvt.eurosupply.realtime.queries.WarehouseFlux;
import com.nvt.eurosupply.shared.components.TimeWindowCalculator;
import com.nvt.eurosupply.warehouse.services.WarehouseService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Objects;

@Slf4j
@Service
public class WarehouseRealTimeService {

    private final WriteApiBlocking writeApi;
    private final InfluxQueryService service;
    private final WarehouseService warehouseService;
    private final TimeWindowCalculator timeWindowCalculator;
    private final WarehouseFlux warehouseFlux;

    public WarehouseRealTimeService(
            @Qualifier("warehouseInfluxClient") InfluxDBClient influxDBClient,
            InfluxQueryService service,
            WarehouseService warehouseService,
            TimeWindowCalculator timeWindowCalculator,
            WarehouseFlux warehouseFlux
    ) {
        this.writeApi = influxDBClient.getWriteApiBlocking();
        this.service = service;
        this.warehouseService = warehouseService;
        this.timeWindowCalculator = timeWindowCalculator;
        this.warehouseFlux = warehouseFlux;
    }

    public List<SectorTemperatureChartDto> getSectorTemperatureChart(
            Long warehouseId,
            Long sectorId,
            Instant start,
            Instant end
    ) {
        warehouseService.find(warehouseId);

        String window = timeWindowCalculator.calculateWindowDuration(start, end);
        String query = warehouseFlux.getAverageTemperature(warehouseId, sectorId, start, end, window);
        log.info(query);

        return service.query(query, fluxRecord -> new SectorTemperatureChartDto(
                Objects.requireNonNull(fluxRecord.getTime()).toString(),
                fluxRecord.getValue() == null ? 0 : ((Number) fluxRecord.getValue()).doubleValue()
        )).toList();
    }


    public void saveReport(WarehouseReportMessage report) {
        report.getTemperatures().forEach(item -> {
            Point point = Point
                    .measurement("warehouse_temperature")
                    .addTag("warehouse_id", String.valueOf(report.getWarehouseId()))
                    .addTag("sector_id", String.valueOf(item.getSectorId()))
                    .addField("temperature", item.getTemperature())
                    .time(report.getTimestamp(), WritePrecision.NS);

            writeApi.writePoint(point);
        });
    }

    public void saveHeartbeat(WarehouseHeartbeatMessage heartbeat) {
        Point point = Point
                .measurement("warehouse_availability")
                .addTag("warehouse_id", String.valueOf(heartbeat.getWarehouseId()))
                .addField("status", heartbeat.getStatus().ordinal())
                .time(heartbeat.getTimestamp(), WritePrecision.NS);

        writeApi.writePoint(point);
    }
}