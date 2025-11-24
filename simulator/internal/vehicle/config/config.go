package config

import (
	"fmt"
	"github.com/spf13/pflag"
	"time"

	"github.com/spf13/viper"
)

type Config struct {
	Vehicle   VehicleConfig   `mapstructure:"vehicle"`
	RabbitMQ  RabbitMQConfig  `mapstructure:"rabbitmq"`
	Simulator SimulatorConfig `mapstructure:"simulator"`
	Logging   LoggingConfig   `mapstructure:"logging"`
}

type VehicleConfig struct {
	ID                 int64   `mapstructure:"id" validate:"required"`
	RegistrationNumber string  `mapstructure:"registration_number" validate:"required"`
	Brand              string  `mapstructure:"brand"`
	Model              string  `mapstructure:"model"`
	MaxLoadKg          float64 `mapstructure:"max_load_kg" validate:"gt=0"`
	InitialLat         float64 `mapstructure:"initial_latitude" validate:"min=-90,max=90"`
	InitialLon         float64 `mapstructure:"initial_longitude" validate:"min=-180,max=180"`
}

type RabbitMQConfig struct {
	URL                 string        `mapstructure:"url" validate:"required"`
	HeartbeatExchange   string        `mapstructure:"heartbeat_exchange"`
	LocationExchange    string        `mapstructure:"location_exchange"`
	ConnectionTimeout   time.Duration `mapstructure:"connection_timeout"`
	ReconnectDelay      time.Duration `mapstructure:"reconnect_delay"`
	MaxReconnectAttempt int           `mapstructure:"max_reconnect_attempts"`
}

type SimulatorConfig struct {
	HeartbeatInterval time.Duration `mapstructure:"heartbeat_interval" validate:"required"`
	ReportingInterval time.Duration `mapstructure:"reporting_interval" validate:"required"`
	MinSpeed          float64       `mapstructure:"min_speed"`
	MaxSpeed          float64       `mapstructure:"max_speed"`
}

type LoggingConfig struct {
	Level      string `mapstructure:"level"`
	Format     string `mapstructure:"format"`
	OutputPath string `mapstructure:"output_path"`
}

func Load(configPath string) (*Config, error) {
	v := viper.New()

	setDefaults(v)

	if configPath != "" {
		v.SetConfigFile(configPath)
		if err := v.ReadInConfig(); err != nil {
			return nil, fmt.Errorf("failed to read config file '%s': %w", configPath, err)
		}
	}

	v.SetEnvPrefix("VEHICLE")
	v.AutomaticEnv()

	bindFlags(v)

	var cfg Config
	if err := v.Unmarshal(&cfg); err != nil {
		return nil, fmt.Errorf("failed to unmarshal config: %w", err)
	}

	if err := Validate(&cfg); err != nil {
		return nil, fmt.Errorf("invalid configuration: %w", err)
	}

	return &cfg, nil
}

func setDefaults(v *viper.Viper) {
	v.SetDefault("vehicle.max_load_kg", 1000.0)
	v.SetDefault("vehicle.initial_latitude", 45.2671)
	v.SetDefault("vehicle.initial_longitude", 19.8335)

	v.SetDefault("rabbitmq.url", "amqp://guest:guest@localhost:5672/")
	v.SetDefault("rabbitmq.heartbeat_exchange", "vehicle.heartbeat")
	v.SetDefault("rabbitmq.location_exchange", "vehicle.location")
	v.SetDefault("rabbitmq.connection_timeout", "10s")
	v.SetDefault("rabbitmq.reconnect_delay", "5s")
	v.SetDefault("rabbitmq.max_reconnect_attempts", 10)

	v.SetDefault("simulator.heartbeat_interval", "30s")
	v.SetDefault("simulator.reporting_interval", "10m")
	v.SetDefault("simulator.min_speed", 0.0)
	v.SetDefault("simulator.max_speed", 90.0)

	v.SetDefault("logging.level", "info")
	v.SetDefault("logging.format", "console")
	v.SetDefault("logging.output_path", "stdout")
}

func bindFlags(v *viper.Viper) {
	if err := v.BindPFlags(pflag.CommandLine); err != nil {
		panic(fmt.Errorf("failed to bind flags: %w", err))
	}
}
