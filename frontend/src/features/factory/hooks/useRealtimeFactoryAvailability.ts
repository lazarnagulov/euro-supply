import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import type { FactoryAvailabilitySummary } from "../types/factory.types.ts";

export const useRealtimeFactoryAvailability = (
  factoryId: string | undefined,
  enabled: boolean = false,
) => {
  const [availabilityData, setAvailabilityData] =
    useState<FactoryAvailabilitySummary | null>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    if (!factoryId || !enabled) {
      if (clientRef.current?.connected) {
        clientRef.current.deactivate();
      }
      return;
    }

    const client = new Client({
      webSocketFactory: () => new SockJS("/api/ws"),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      console.log("WebSocket connected for factory", factoryId);
      setConnected(true);
      setError(null);

      client.subscribe(
        `/topic/factory/${factoryId}/availability`,
        (message) => {
          try {
            const data: FactoryAvailabilitySummary = JSON.parse(message.body);
            setAvailabilityData(data);
          } catch (err) {
            console.error("Error parsing factory availability data:", err);
            setError("Failed to parse availability data");
          }
        },
      );

      client.publish({
        destination: `/app/factory/${factoryId}/availability/subscribe`,
        body: JSON.stringify({}),
      });
    };

    client.onStompError = (frame) => {
      console.error("STOMP error:", frame);
      setError("WebSocket connection error");
      setConnected(false);
    };

    client.onWebSocketClose = () => {
      setConnected(false);
    };

    client.activate();
    clientRef.current = client;

    return () => {
      if (client.connected) {
        client.publish({
          destination: `/app/factory/${factoryId}/availability/unsubscribe`,
          body: JSON.stringify({}),
        });
        client.deactivate();
      }
      setConnected(false);
    };
  }, [factoryId, enabled]);

  return { availabilityData, connected, error };
};
