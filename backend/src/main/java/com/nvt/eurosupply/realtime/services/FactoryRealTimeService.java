package com.nvt.eurosupply.realtime.services;

import com.influxdb.client.InfluxDBClient;
import com.influxdb.client.WriteApiBlocking;
import com.influxdb.client.domain.WritePrecision;
import com.influxdb.client.write.Point;
import com.nvt.eurosupply.realtime.dtos.ProductionChartDto;
import com.nvt.eurosupply.factory.services.FactoryService;
import com.nvt.eurosupply.realtime.messages.FactoryHeartbeatMessage;
import com.nvt.eurosupply.realtime.messages.ProductionReportMessage;
import com.nvt.eurosupply.realtime.queries.FactoryFlux;
import com.nvt.eurosupply.shared.components.TimeWindowCalculator;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Slf4j
@Service
public class FactoryRealTimeService {

    private final WriteApiBlocking writeApi;
    private final InfluxQueryService service;
    private final FactoryService factoryService;
    private final TimeWindowCalculator timeWindowCalculator;
    private final FactoryFlux factoryFlux;

    public FactoryRealTimeService(
            @Qualifier("factoryInfluxClient") InfluxDBClient influxDBClient,
            InfluxQueryService service,
            FactoryService factoryService,
            TimeWindowCalculator timeWindowCalculator,
            FactoryFlux factoryFlux) {
        this.writeApi = influxDBClient.getWriteApiBlocking();
        this.service = service;
        this.factoryService = factoryService;
        this.timeWindowCalculator = timeWindowCalculator;
        this.factoryFlux = factoryFlux;
    }

    public List<ProductionChartDto> getProduction(
            Long factoryId,
            Long productId,
            Instant start,
            Instant end
    ) {
        factoryService.find(factoryId);
        String window = timeWindowCalculator.calculateWindowDuration(start, end);
        String query = factoryFlux.getProduction(factoryId, productId, start, end, window);

        return service.query(query, fluxRecord -> new ProductionChartDto(
                fluxRecord.getTime().toString(),
                fluxRecord.getValue() == null ? 0 : ((Number) fluxRecord.getValue()).intValue()
        )).toList();
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

}