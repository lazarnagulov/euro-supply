package config

import "github.com/spf13/pflag"

func RegisterFlags() {
	pflag.Int("warehouse.id", 3, "Warehouse ID")
	pflag.String("warehouse.name", "Main Warehouse", "Warehouse name")
	pflag.String("warehouse.address", "123 Storage St.", "Warehouse address")
	pflag.String("warehouse.city", "Novi Sad", "Warehouse city")
	pflag.String("warehouse.country", "Serbia", "Warehouse country")
	pflag.Float64("warehouse.latitude", 45.2671, "Warehouse latitude")
	pflag.Float64("warehouse.longitude", 19.8335, "Warehouse longitude")

	pflag.Duration("simulator.reporting_interval", 10*60*1e9, "Reporting interval in nanoseconds") // 10 min
	pflag.Bool("simulator.randomize_temperature", true, "Randomize sector temperature")
	pflag.Int("simulator.min_sector_interval", 1, "Minimum interval per sector update")

	pflag.String("rabbitmq.url", "amqp://guest:guest@localhost:5672/", "RabbitMQ URL")
	pflag.Duration("rabbitmq.connection_timeout", 10*1e9, "Connection timeout") // 10s
	pflag.Duration("rabbitmq.reconnect_delay", 5*1e9, "Reconnect delay")        // 5s
	pflag.Int("rabbitmq.max_reconnect_attempts", 10, "Max reconnect attempts")

	pflag.String("logging.level", "info", "Log level")
	pflag.String("logging.format", "console", "Log format")
	pflag.String("logging.output_path", "stdout", "Output path")
}