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
	if len(r.config.Exchanges) == 0 {
		return fmt.Errorf("no exchanges defined in RabbitMQ config")
	}

	for _, ex := range r.config.Exchanges {
		if err := channel.ExchangeDeclare(
			ex.Name,
			ex.Kind,
			ex.Durable,
			ex.AutoDelete,
			ex.Internal,
			ex.NoWait,
			ex.Args,
		); err != nil {
			return fmt.Errorf("failed to declare exchange %s: %w", ex.Name, err)
		}
		fmt.Printf("Declared exchange: %s\n", ex.Name)
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
