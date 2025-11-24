package config

import (
	"github.com/spf13/pflag"
)

func RegisterFlags() {
	pflag.String("vehicle.id", "", "Vehicle ID")
	pflag.String("vehicle.registration_number", "", "Registration number")
	pflag.String("vehicle.brand", "", "Vehicle brand")
	pflag.String("vehicle.model", "", "Vehicle model")
	pflag.Float64("vehicle.max_load_kg", 0, "Max load in kg")
	pflag.Float64("vehicle.initial_latitude", 0, "Initial latitude")
	pflag.Float64("vehicle.initial_longitude", 0, "Initial longitude")

	pflag.String("rabbitmq.url", "", "RabbitMQ URL")
	pflag.String("rabbitmq.heartbeat_exchange", "", "Heartbeat exchange")
	pflag.String("rabbitmq.location_exchange", "", "Location exchange")
	pflag.Duration("rabbitmq.connection_timeout", 0, "Connection timeout")
	pflag.Duration("rabbitmq.reconnect_delay", 0, "Reconnect delay")
	pflag.Int("rabbitmq.max_reconnect_attempts", 0, "Max reconnect attempts")

	pflag.Duration("simulator.heartbeat_interval", 0, "Heartbeat interval")
	pflag.Duration("simulator.reporting_interval", 0, "Reporting interval")
	pflag.Float64("simulator.min_speed", 0, "Min speed")
	pflag.Float64("simulator.max_speed", 0, "Max speed")

	pflag.String("logging.level", "", "Log level")
	pflag.String("logging.format", "", "Log format")
	pflag.String("logging.output_path", "", "Output path")
}
