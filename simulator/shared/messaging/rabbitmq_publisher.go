package messaging

import (
	"context"
	"encoding/json"
	"eurosupply/simulator/internal/vehicle/domain"
	"fmt"
	amqp "github.com/rabbitmq/amqp091-go"
	"time"
)

type RabbitMqPublisher struct {
	client *RabbitMQClient
}

func (p *RabbitMqPublisher) PublishHeartbeat(ctx context.Context, msg domain.HeartbeatMessage) error {
	if !p.client.IsConnected() {
		return fmt.Errorf("not connected to RabbitMQ")
	}
	body, err := json.Marshal(msg)
	if err != nil {
		return fmt.Errorf("failed to marshal heartbeat: %w", err)
	}

	routingKey := fmt.Sprintf("vehicle.%d.heartbeat", msg.VehicleID)
	p.client.mu.RLock()
	defer p.client.mu.RUnlock()

	err = p.client.channel.PublishWithContext(
		ctx,
		p.client.config.HeartbeatExchange,
		routingKey,
		false,
		false,
		amqp.Publishing{
			ContentType:  "application/json",
			Body:         body,
			Timestamp:    time.Now(),
			DeliveryMode: amqp.Persistent,
		},
	)

	if err != nil {
		return fmt.Errorf("failed to publish heartbeat: %w", err)
	}

	return nil
}

func (p *RabbitMqPublisher) PublishLocation(ctx context.Context, msg domain.LocationMessage) error {
	if !p.client.IsConnected() {
		return fmt.Errorf("not connected to RabbitMQ")
	}

	body, err := json.Marshal(msg)
	if err != nil {
		return fmt.Errorf("failed to marshal location: %w", err)
	}

	routingKey := fmt.Sprintf("vehicle.%d.location", msg.VehicleID)
	p.client.mu.RLock()
	defer p.client.mu.RUnlock()

	err = p.client.channel.PublishWithContext(
		ctx,
		p.client.config.LocationExchange,
		routingKey,
		false,
		false,
		amqp.Publishing{
			ContentType:  "application/json",
			Body:         body,
			Timestamp:    time.Now(),
			DeliveryMode: amqp.Persistent,
		},
	)

	if err != nil {
		return fmt.Errorf("failed to publish heartbeat: %w", err)
	}

	return nil
}

func (p *RabbitMqPublisher) Close() error {
	return nil
}
