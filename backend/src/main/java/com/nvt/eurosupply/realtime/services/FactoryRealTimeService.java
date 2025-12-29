package com.nvt.eurosupply.realtime.services;

import com.influxdb.client.InfluxDBClient;
import com.influxdb.client.WriteApiBlocking;
import com.influxdb.client.domain.WritePrecision;
import com.influxdb.client.write.Point;
import com.nvt.eurosupply.factory.services.FactoryService;
import com.nvt.eurosupply.realtime.dtos.FactoryProductionDto;
import com.nvt.eurosupply.realtime.dtos.FactoryProductionRequestDto;
import com.nvt.eurosupply.realtime.messages.FactoryHeartbeatMessage;
import com.nvt.eurosupply.realtime.messages.ProductionReportMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.List;

@Service
public class FactoryRealTimeService {

    private final InfluxQueryService service;
    private final WriteApiBlocking writeApi;
    private final FactoryService factoryService;

    @Autowired
    public FactoryRealTimeService(
            InfluxDBClient client,
            InfluxQueryService service,
            FactoryService factoryService
    ) {
        this.writeApi = client.getWriteApiBlocking();
        this.service = service;
        this.factoryService = factoryService;
    }

    public List<FactoryProductionDto> getProduction(
            Long factoryId,
            FactoryProductionRequestDto request
    ) {
        factoryService.find(factoryId);

        Instant start = request.getStart();
        Instant end = request.getEnd();
        String window = calculateWindowDuration(start, end);

        String query = String.format(
                """
                from(bucket: "factory")
                |> range(start: %s, stop: %s)
                |> filter(fn: (r) => r["factory_id"] == "%d")
                |> filter(fn: (r) => r["_measurement"] == "factory_production")
                |> filter(fn: (r) => r["_field"] == "quantity")
                |> aggregateWindow(every: %s, fn: sum, createEmpty: false)
                |> yield()
                """,
                start, end, factoryId, window
        );

        return service.query(query, fluxRecord -> {
            FactoryProductionDto dto = new FactoryProductionDto();
            dto.setTime(fluxRecord.getTime());
            dto.setProductId(
                    Long.parseLong(fluxRecord.getValueByKey("product_id").toString())
            );
            dto.setQuantity(
                    fluxRecord.getValue() == null ? null : ((Number) fluxRecord.getValue()).intValue()
            );
            return dto;
        }).toList();
    }

    public void saveProductionReport(ProductionReportMessage report) {
        report.getItems().forEach(item -> {
            Point point = Point
                    .measurement("factory_production")
                    .addTag("factory_id", String.valueOf(report.getFactoryId()))
                    .addTag("product_id", String.valueOf(item.getProductId()))
                    .addField("quantity", item.getQuantity())
                    .time(report.getProducedAt(), WritePrecision.NS);

            writeApi.writePoint(point);
        });
    }

    public void saveHeartbeat(FactoryHeartbeatMessage heartbeat) {
        Point point = Point
                .measurement("factory_availability")
                .addTag("factory_id", String.valueOf(heartbeat.getFactoryId()))
                .addField("status", heartbeat.getStatus().ordinal())
                .time(heartbeat.getTimestamp(), WritePrecision.NS);

        writeApi.writePoint(point);
    }

    private String calculateWindowDuration(Instant start, Instant stop) {
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
}
