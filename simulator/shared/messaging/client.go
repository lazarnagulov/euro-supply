package messaging

import (
	"context"
	"eurosupply/simulator/internal/vehicle/domain"
)

type Publisher interface {
	PublishHeartbeat(ctx context.Context, msg domain.HeartbeatMessage) error
	PublishLocation(ctx context.Context, msg domain.LocationMessage) error
	Close() error
}

type Connection interface {
	Connect(ctx context.Context) error
	IsConnected() bool
	Close() error
	Publisher() Publisher
}
