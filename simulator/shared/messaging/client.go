package messaging

import (
	"context"
)

type Publisher interface {
	Publish(ctx context.Context, exchange string, routingKey string, message any) error
	Close() error
}

type Connection interface {
	Connect(ctx context.Context) error
	IsConnected() bool
	Close() error
	Publisher() Publisher
}
