package com.nvt.eurosupply.realtime.controllers;

import com.nvt.eurosupply.realtime.services.FactorySubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class FactoryWebSocketController {

    private final FactorySubscriptionService service;

    @MessageMapping("/factory/{factoryId}/availability/subscribe")
    public void subscribeToAvailability(@DestinationVariable Long factoryId) {
        service.subscribe(factoryId);
        service.triggerUpdate(factoryId);
    }

    @MessageMapping("/factory/{factoryId}/availability/unsubscribe")
    public void unsubscribeFromAvailability(@DestinationVariable Long factoryId) {
        service.unsubscribe(factoryId);
    }
}