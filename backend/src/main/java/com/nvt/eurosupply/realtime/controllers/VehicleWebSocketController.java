package com.nvt.eurosupply.realtime.controllers;

import com.nvt.eurosupply.realtime.services.VehicleSubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class VehicleWebSocketController {

    private final VehicleSubscriptionService service;

    @MessageMapping("/vehicle/{vehicleId}/availability/subscribe")
    public void subscribeToAvailability(@DestinationVariable Long vehicleId) {
        service.subscribe(vehicleId);
        service.triggerUpdate(vehicleId);
    }

    @MessageMapping("/vehicle/{vehicleId}/availability/unsubscribe")
    public void unsubscribeFromAvailability(@DestinationVariable Long vehicleId) {
        service.unsubscribe(vehicleId);
    }
}
