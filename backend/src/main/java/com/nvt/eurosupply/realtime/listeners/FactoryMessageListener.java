package com.nvt.eurosupply.realtime.listeners;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nvt.eurosupply.realtime.messages.FactoryHeartbeatMessage;
import com.nvt.eurosupply.realtime.messages.ProductionReportMessage;
import com.nvt.eurosupply.realtime.services.FactoryRealTimeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class FactoryMessageListener {

    private final ObjectMapper mapper;
    private final FactoryRealTimeService realTimeService;

    @RabbitListener(queues = "factory.heartbeat.queue")
    public void receiveHeartbeat(String message) {
        try {
            FactoryHeartbeatMessage heartbeat = mapper.readValue(message, new TypeReference<>() {});
            realTimeService.saveHeartbeat(heartbeat);
            log.info("[{}] Received heartbeat from factory {}: status={}",
                    heartbeat.getTimestamp(), heartbeat.getFactoryId(), heartbeat.getStatus());
        } catch (JsonProcessingException e) {
            log.error("Error processing factory heartbeat: {}", e.getMessage(), e);
        }
    }

    @RabbitListener(queues = "factory.production.queue")
    public void receiveProductionReport(String message) {
        try {
            ProductionReportMessage report = mapper.readValue(message, new TypeReference<>() {});
            realTimeService.saveProductionReport(report);
            log.info("[{}] Received production report from factory {}: {} items",
                    report.getProducedAt(), report.getFactoryId(), report.getItems().size());
        } catch (JsonProcessingException e) {
            log.error("Error processing production report: {}", e.getMessage(), e);
        }
    }
}
