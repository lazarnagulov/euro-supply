package com.nvt.eurosupply.realtime.listeners;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nvt.eurosupply.realtime.messages.VehicleHeartbeatMessage;
import com.nvt.eurosupply.realtime.messages.VehicleLocationMessage;
import com.nvt.eurosupply.realtime.services.VehicleRealTimeService;
import com.nvt.eurosupply.realtime.services.VehicleSubscriptionService;
import com.nvt.eurosupply.shared.models.Location;
import com.nvt.eurosupply.vehicle.services.VehicleService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class VehicleMessageListener {

    private final ObjectMapper mapper;
    private final VehicleSubscriptionService subscriptionService;
    private final VehicleRealTimeService realTimeService;
    private final VehicleService service;

    @PostConstruct
    public void init() {
        service.setStatusChangeListener(event ->
            realTimeService.saveStatusChange(
                    event.vehicleId(),
                    event.isOnline(),
                    event.timestamp()
            )
        );

        service.setBatchStatusChangeListener(events -> {
            if (events.isEmpty()) 
                return;
            realTimeService.saveStatusChanges(events);
            log.info("Batch saved {} vehicle status changes to InfluxDB", events.size());
        });
    }

    @RabbitListener(queues = "vehicle.heartbeat.queue")
    public void receiveHeartbeat(String message) {
        try {
            VehicleHeartbeatMessage heartbeat = mapper.readValue(message, new TypeReference<>() {});
            service.applyHeartbeat(heartbeat.getVehicleId(), heartbeat.getTimestamp());
            log.info("[{}] Received heartbeat from vehicle: {}", heartbeat.getTimestamp(),  heartbeat.getStatus());
        } catch (JsonProcessingException e) {
            log.error("Error processing heartbeat: {}", e.getMessage(), e);
        }
    }

    @RabbitListener(queues = "vehicle.location.queue")
    public void receiveLocation(String message) {
        try {
            VehicleLocationMessage location = mapper.readValue(message, new TypeReference<>() {});
            realTimeService.saveLocation(location);
            service.updateLocation(location.getVehicleId(), new Location(location.getLatitude(), location.getLongitude(), location.getTimestamp()));
            log.info("[{}] Received location: {} {}", location.getTimestamp(), location.getLatitude(), location.getLongitude());
        } catch (JsonProcessingException e) {
            log.error("Error processing location: {}", e.getMessage(), e);
        }
    }
}
