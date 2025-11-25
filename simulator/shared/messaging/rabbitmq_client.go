package messaging

import (
	"context"
	"eurosupply/simulator/internal/vehicle/config"
	"fmt"
	amqp "github.com/rabbitmq/amqp091-go"
)

type RabbitMQClient struct {
	config    config.RabbitMQConfig
	conn      *amqp.Connection
	channel   *amqp.Channel
	connected bool
	closed    bool
}

func NewRabbitMQClient(cfg config.RabbitMQConfig) *RabbitMQClient {
	return &RabbitMQClient{
		config: cfg,
	}
}

func (r *RabbitMQClient) Connect(ctx context.Context) error {
	if r.IsConnected() {
		return nil
	}

	conn, err := amqp.Dial(r.config.URL)
	if err != nil {
		return fmt.Errorf("failed to connect to RabbitMQ: %w", err)
	}

	channel, err := conn.Channel()
	if err != nil {
		err = conn.Close()
		if err != nil {
			return err
		}
		return fmt.Errorf("failed to open channel: %w", err)
	}

	if err = r.declareExchanges(channel); err != nil {
		err = channel.Close()
		if err != nil {
			return fmt.Errorf("failed to close channel: %w", err)
		}
		err = conn.Close()
		if err != nil {
			return fmt.Errorf("failed to close connection: %w", err)
		}
		return fmt.Errorf("failed to declare exchanges: %w", err)
	}

	r.conn = conn
	r.channel = channel
	r.connected = true

	return nil
}

func (r *RabbitMQClient) IsConnected() bool {
	return r.connected
}

func (r *RabbitMQClient) declareExchanges(channel *amqp.Channel) error {
	if err := channel.ExchangeDeclare(
		r.config.HeartbeatExchange,
		"topic",
		true,
		false,
		false,
		false,
		nil,
	); err != nil {
		return fmt.Errorf("failed to declare heartbeat exchange: %w", err)
	}

	if err := channel.ExchangeDeclare(
		r.config.LocationExchange,
		"topic",
		true,
		false,
		false,
		false,
		nil,
	); err != nil {
		return fmt.Errorf("failed to declare location exchange: %w", err)
	}
	return nil
}

func (r *RabbitMQClient) Close() error {
	r.closed = true

	if r.channel != nil {
		if err := r.channel.Close(); err != nil {
			fmt.Println("error closing channel")
		}
	}

	if r.conn != nil {
		if err := r.conn.Close(); err != nil {
			fmt.Println("error closing connection")
		}
	}

	r.connected = false
	return nil
}

func (r *RabbitMQClient) Publisher() Publisher {
	return &RabbitMqPublisher{client: r}
}
