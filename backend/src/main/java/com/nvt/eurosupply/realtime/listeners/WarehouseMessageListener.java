package com.nvt.eurosupply.realtime.listeners;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nvt.eurosupply.realtime.messages.WarehouseHeartbeatMessage;
import com.nvt.eurosupply.realtime.messages.WarehouseReportMessage;
import com.nvt.eurosupply.realtime.services.WarehouseRealTimeService;
import com.nvt.eurosupply.warehouse.services.WarehouseService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class WarehouseMessageListener {

    private final ObjectMapper mapper;
    private final WarehouseRealTimeService realTimeService;
    private final WarehouseService service;

    @RabbitListener(queues = "warehouse.temperature.queue")
    public void receiveWarehouseReport(String message) {
        try {
            WarehouseReportMessage report = mapper.readValue(message, new TypeReference<>() {});
            realTimeService.saveReport(report);
            service.applyReport(report);
            log.info("[{}] Received sector report from warehouse {}: {} items",
                    report.getTimestamp(), report.getWarehouseId(), report.getTemperatures().size());
        } catch (JsonProcessingException e) {
            log.error("Error processing production report: {}", e.getMessage(), e);
        }
    }
}