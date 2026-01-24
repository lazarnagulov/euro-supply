import { useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import type {AvailabilitySummary} from "../types/vehicle.types.ts";

export const useRealtimeAvailability = (
    vehicleId: string | undefined,
    enabled: boolean = false
) => {
    const [availabilityData, setAvailabilityData] = useState<AvailabilitySummary | null>(null);
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const clientRef = useRef<Client | null>(null);

    useEffect(() => {
        if (!vehicleId || !enabled) {
            if (clientRef.current?.connected) {
                clientRef.current.deactivate().then();
            }
            return;
        }

        const client = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/api/v1/ws'),
            debug: (str) => {
                console.log('[STOMP]', str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        client.onConnect = () => {
            console.log('WebSocket connected for vehicle', vehicleId);
            setConnected(true);
            setError(null);

            client.subscribe(`/topic/vehicle/${vehicleId}/availability`, (message) => {
                try {
                    const data: AvailabilitySummary = JSON.parse(message.body);
                    console.log('Received availability update:', data);
                    setAvailabilityData(data);
                } catch (err) {
                    console.error('Error parsing availability data:', err);
                    setError('Failed to parse availability data');
                }
            });

            client.publish({
                destination: `/app/vehicle/${vehicleId}/availability/subscribe`,
                body: JSON.stringify({}),
            });
        };

        client.onStompError = (frame) => {
            console.error('STOMP error:', frame);
            setError('WebSocket connection error');
            setConnected(false);
        };

        client.onWebSocketClose = () => {
            console.log('WebSocket closed');
            setConnected(false);
        };

        client.activate();
        clientRef.current = client;

        return () => {
            if (client.connected) {
                client.publish({
                    destination: `/app/vehicle/${vehicleId}/availability/unsubscribe`,
                    body: JSON.stringify({}),
                });
                client.deactivate().then();
            }
            setConnected(false);
        };
    }, [vehicleId, enabled]);

    return {
        availabilityData,
        connected,
        error,
    };
};