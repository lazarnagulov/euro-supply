package com.nvt.eurosupply.realtime.services;

import com.nvt.eurosupply.realtime.dtos.factory.FactoryAvailabilitySummaryDto;
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
public class FactorySubscriptionService {

    private final FactoryRealTimeService service;
    private final SimpMessagingTemplate messagingTemplate;

    private final Map<Long, Integer> activeSubscriptions = new ConcurrentHashMap<>();

    public void subscribe(Long factoryId) {
        activeSubscriptions.merge(factoryId, 1, Integer::sum);
        log.info("Subscribed to factory {} availability. Active subscriptions: {}",
                factoryId, activeSubscriptions.get(factoryId));
    }

    public void unsubscribe(Long factoryId) {
        activeSubscriptions.computeIfPresent(factoryId, (id, count) -> {
            int newCount = count - 1;
            if (newCount <= 0) {
                log.info("No more subscribers for factory {}, removing.", id);
                return null;
            }
            log.info("Unsubscribed from factory {}. Remaining: {}", id, newCount);
            return newCount;
        });
    }

    @Scheduled(fixedRate = 10000)
    public void broadcastAvailabilityUpdates() {
        if (activeSubscriptions.isEmpty()) return;

        log.info("Broadcasting availability updates for {} factories", activeSubscriptions.size());

        Instant end = Instant.now();
        Instant start = end.minus(3, ChronoUnit.HOURS);

        for (Long factoryId : activeSubscriptions.keySet()) {
            try {
                FactoryAvailabilitySummaryDto summary = service.getAvailabilitySummary(factoryId, start, end);
                messagingTemplate.convertAndSend(
                        "/topic/factory/" + factoryId + "/availability",
                        summary
                );
            } catch (Exception e) {
                log.error("Error broadcasting availability for factory {}: {}", factoryId, e.getMessage(), e);
            }
        }
    }

    public void triggerUpdate(Long factoryId) {
        if (!activeSubscriptions.containsKey(factoryId)) return;

        Instant end = Instant.now();
        Instant start = end.minus(3, ChronoUnit.HOURS);

        try {
            FactoryAvailabilitySummaryDto summary = service.getAvailabilitySummary(factoryId, start, end);
            messagingTemplate.convertAndSend(
                    "/topic/factory/" + factoryId + "/availability",
                    summary
            );
            log.info("Triggered availability update for factory {}", factoryId);
        } catch (Exception e) {
            log.error("Error triggering update for factory {}: {}", factoryId, e.getMessage(), e);
        }
    }
}
