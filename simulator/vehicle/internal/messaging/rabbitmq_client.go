package messaging

import (
	"context"
	"eurosupply/delivery-vehicle-simulator/internal/config"
	"fmt"
	amqp "github.com/rabbitmq/amqp091-go"
	"sync"
	"time"
)

type RabbitMQClient struct {
	config    config.RabbitMQConfig
	conn      *amqp.Connection
	channel   *amqp.Channel
	mu        sync.RWMutex
	connected bool
	closed    bool
}

func NewRabbitMQClient(cfg config.RabbitMQConfig) *RabbitMQClient {
	return &RabbitMQClient{
		config: cfg,
	}
}

func (r *RabbitMQClient) Connect(ctx context.Context) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	if r.connected {
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

	go r.monitorConnection()
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

func (r *RabbitMQClient) monitorConnection() {
	notifyClose := make(chan *amqp.Error)
	r.conn.NotifyClose(notifyClose)

	err := <-notifyClose
	if err != nil {
		r.mu.Lock()
		r.connected = false
		r.mu.Unlock()

		if !r.closed {
			r.reconnect()
		}
	}
}

func (r *RabbitMQClient) reconnect() {
	attempt := 0
	maxAttempts := r.config.MaxReconnectAttempt

	for attempt < maxAttempts && !r.closed {
		attempt++
		time.Sleep(r.config.ReconnectDelay)

		ctx, cancel := context.WithTimeout(context.Background(), r.config.ConnectionTimeout)
		err := r.Connect(ctx)
		cancel()

		if err == nil {
			return
		}
	}
}

func (r *RabbitMQClient) Close() error {
	r.mu.Lock()
	defer r.mu.Unlock()

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
