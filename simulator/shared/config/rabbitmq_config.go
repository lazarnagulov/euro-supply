package config

import (
	"time"

	amqp "github.com/rabbitmq/amqp091-go"
)

type RabbitMQConfig struct {
	URL               string           `mapstructure:"url" validate:"required"`
	Exchanges         []ExchangeConfig `mapstructure:"exchanges"`
	ConnectionTimeout time.Duration    `mapstructure:"connection_timeout"`
}

type ExchangeConfig struct {
	Name       string     `mapstructure:"name" validate:"required"`
	Kind       string     `mapstructure:"kind" validate:"required,oneof=direct fanout topic headers"`
	Durable    bool       `mapstructure:"durable"`
	AutoDelete bool       `mapstructure:"auto_delete"`
	Internal   bool       `mapstructure:"internal"`
	NoWait     bool       `mapstructure:"no_wait"`
	Args       amqp.Table `mapstructure:"args"`
}
