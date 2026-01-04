package messaging

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	amqp "github.com/rabbitmq/amqp091-go"
)

type RabbitMqPublisher struct {
	client *RabbitMQClient
}

func (p *RabbitMqPublisher) Publish(
	ctx context.Context,
	exchange string,
	routingKey string,
	message any,
) error {
	if !p.client.IsConnected() {
		return fmt.Errorf("not connected to RabbitMQ")
	}

	body, err := json.Marshal(message)
	if err != nil {
		return fmt.Errorf("failed to marshal message: %w", err)
	}

	err = p.client.channel.PublishWithContext(
		ctx,
		exchange,
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
		return fmt.Errorf("failed to publish message: %w", err)
	}

	fmt.Printf("[%v] Published to exchange '%s', routing key '%s': %v\n", time.Now(), exchange, routingKey, message)
	return nil
}

func (p *RabbitMqPublisher) Close() error {
	return nil
}
