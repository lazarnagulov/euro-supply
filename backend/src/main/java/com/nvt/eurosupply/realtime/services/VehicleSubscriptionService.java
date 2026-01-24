package com.nvt.eurosupply.realtime.services;

import com.nvt.eurosupply.realtime.dtos.vehicle.VehicleAvailabilityRequestDto;
import com.nvt.eurosupply.realtime.dtos.vehicle.VehicleAvailabilitySummaryDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class VehicleSubscriptionService {

    private final VehicleRealTimeService service;
    private final SimpMessagingTemplate messagingTemplate;

    private final Map<Long, Integer> activeSubscriptions = new ConcurrentHashMap<>();

    public void subscribe(Long vehicleId) {
        activeSubscriptions.merge(vehicleId, 1, Integer::sum);
        log.info("Subscribed to vehicle {} real-time updates. Active subscriptions: {}",
                vehicleId, activeSubscriptions.get(vehicleId));
    }

    public void unsubscribe(Long vehicleId) {
        activeSubscriptions.computeIfPresent(vehicleId, (id, count) -> {
            int newCount = count - 1;
            if (newCount <= 0) {
                return null;
            }
            log.info("Unsubscribed from vehicle {}. Remaining subscriptions: {}", id, newCount);
            return newCount;
        });
    }

    @Scheduled(fixedRate = 30000)
    public void broadcastAvailabilityUpdates() {
        if (activeSubscriptions.isEmpty()) {
            return;
        }

        log.debug("Broadcasting availability updates for {} vehicles", activeSubscriptions.size());

        Instant end = Instant.now();
        Instant start = end.minus(3, ChronoUnit.HOURS);

        for (Long vehicleId : activeSubscriptions.keySet()) {
            try {
                VehicleAvailabilityRequestDto request = new VehicleAvailabilityRequestDto();
                request.setStart(start);
                request.setEnd(end);

                VehicleAvailabilitySummaryDto summary = service.getAvailabilitySummary(vehicleId, request);

                messagingTemplate.convertAndSend(
                        "/topic/vehicle/" + vehicleId + "/availability",
                        summary
                );
            } catch (Exception e) {
                log.error("Error broadcasting availability for vehicle {}: {}", vehicleId, e.getMessage(), e);
            }
        }
    }
    public void triggerUpdate(Long vehicleId) {
        if (!activeSubscriptions.containsKey(vehicleId))
            return;

        Instant end = Instant.now();
        Instant start = end.minus(3, ChronoUnit.HOURS);

        VehicleAvailabilityRequestDto request = new VehicleAvailabilityRequestDto();
        request.setStart(start);
        request.setEnd(end);

        VehicleAvailabilitySummaryDto summary = service.getAvailabilitySummary(vehicleId, request);
        messagingTemplate.convertAndSend(
                "/topic/vehicle/" + vehicleId + "/availability",
                summary
        );

        log.info("Triggered availability update for vehicle {}", vehicleId);
    }
}
