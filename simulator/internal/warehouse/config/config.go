package config

import (
	sharedConfig "eurosupply/simulator/shared/config"
	"github.com/spf13/viper"
	"fmt"
	"time"
	"github.com/spf13/pflag"
)

type Config struct {
	Warehouse   WarehouseConfig               `mapstructure:"warehouse"`
	Simulator SimulatorConfig             `mapstructure:"simulator"`
	Logging   LoggingConfig         `mapstructure:"logging"`
	RabbitMQ  sharedConfig.RabbitMQConfig       `mapstructure:"rabbitmq"`
}

type SectorConfig struct {
	Name           string  `mapstructure:"name"`
	MinTemperature float64 `mapstructure:"min_temperature"`
	MaxTemperature float64 `mapstructure:"max_temperature"`
}

type WarehouseConfig struct {
	ID        int           `mapstructure:"id"`
	Name      string        `mapstructure:"name"`
	Address   string        `mapstructure:"address"`
	City      string        `mapstructure:"city"`
	Country   string        `mapstructure:"country"`
	Latitude  float64       `mapstructure:"latitude"`
	Longitude float64       `mapstructure:"longitude"`
	Sectors   []SectorConfig `mapstructure:"sectors"`
}

type SimulatorConfig struct {
	HeartbeatInterval time.Duration `mapstructure:"heartbeat_interval" validate:"required"`
	ReportingInterval time.Duration `mapstructure:"reporting_interval" validate:"required"`
	MinTemperature          float64       `mapstructure:"min_temperature"`
	MaxTemperature          float64       `mapstructure:"max_temperature"`
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

	v.SetEnvPrefix("WAREHOUSE")
	v.AutomaticEnv()

	if err := v.BindPFlags(pflag.CommandLine); err != nil {
		panic(fmt.Errorf("failed to bind flags: %w", err))
	}

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
	v.SetDefault("warehouse.id", 1)
	v.SetDefault("warehouse.name", "Main Warehouse")
	v.SetDefault("warehouse.address", "123 Storage St.")
	v.SetDefault("warehouse.city", "Novi Sad")
	v.SetDefault("warehouse.country", "Serbia")
	v.SetDefault("warehouse.latitude", 45.2671)
	v.SetDefault("warehouse.longitude", 19.8335)

	v.SetDefault("warehouse.sectors", []map[string]interface{}{
		{
			"name":            "Frozen",
			"min_temperature": -20.0,
			"max_temperature": -15.0,
		},
		{
			"name":            "Cool",
			"min_temperature": 2.0,
			"max_temperature": 8.0,
		},
		{
			"name":            "Dry",
			"min_temperature": 15.0,
			"max_temperature": 25.0,
		},
	})

	v.SetDefault("rabbitmq.url", "amqp://guest:guest@localhost:5672/")
	v.SetDefault("rabbitmq.connection_timeout", "10s")
	v.SetDefault("rabbitmq.reconnect_delay", "5s")
	v.SetDefault("rabbitmq.max_reconnect_attempts", 10)
	v.SetDefault("rabbitmq.exchanges", []map[string]interface{}{
		{
			"name":    "simulator.warehouse.temperature",
			"kind":    "topic",
			"durable": true,
		},
	})

	v.SetDefault("simulator.reporting_interval", "1m")
	v.SetDefault("simulator.heartbeat_interval", "30s")
	v.SetDefault("simulator.randomize_temperature", true)
	v.SetDefault("simulator.min_sector_interval", 1)

	v.SetDefault("logging.level", "info")
	v.SetDefault("logging.format", "console")
	v.SetDefault("logging.output_path", "stdout")
}