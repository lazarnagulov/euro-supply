package config

import "github.com/spf13/pflag"

func RegisterFlags() {
	pflag.Int64("factory.id", 0, "Factory ID")

	pflag.Duration("simulator.heartbeat_interval", 0, "Heartbeat interval")
	pflag.StringSlice("simulator.production_times", nil, "Production times in HH:MM format")

	pflag.String("rabbitmq.url", "", "RabbitMQ URL")
	pflag.String("rabbitmq.heartbeat_exchange", "", "Heartbeat exchange")
	pflag.String("rabbitmq.production_exchange", "", "Production exchange")
	pflag.Duration("rabbitmq.connection_timeout", 0, "Connection timeout")
	pflag.Duration("rabbitmq.reconnect_delay", 0, "Reconnect delay")
	pflag.Int("rabbitmq.max_reconnect_attempts", 0, "Max reconnect attempts")

	pflag.String("logging.level", "", "Log level")
	pflag.String("logging.format", "", "Log format")
	pflag.String("logging.output_path", "", "Output path")
}
