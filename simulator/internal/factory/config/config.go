package config

import (
	"fmt"
	"time"

	"github.com/spf13/pflag"
	"github.com/spf13/viper"

	"eurosupply/simulator/shared/config"
)

type Config struct {
	Factory   FactoryConfig         `mapstructure:"factory"`
	Simulator SimulatorConfig       `mapstructure:"simulator"`
	Logging   LoggingConfig         `mapstructure:"logging"`
	RabbitMQ  config.RabbitMQConfig `mapstructure:"rabbitmq"`
}

type FactoryConfig struct {
	ID       int64           `mapstructure:"id" validate:"required"`
	Products []ProductConfig `mapstructure:"products" validate:"required,dive"`
}

type ProductConfig struct {
	ProductID int64 `mapstructure:"product_id" validate:"required"`
}

type SimulatorConfig struct {
	HeartbeatInterval time.Duration `mapstructure:"heartbeat_interval" validate:"required"`
	ProductionTimes   []string      `mapstructure:"production_times" validate:"required"`
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

	v.SetEnvPrefix("FACTORY")
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
	v.SetDefault("rabbitmq.url", "amqp://guest:guest@localhost:5672/")
	v.SetDefault("rabbitmq.connection_timeout", "10s")
	v.SetDefault("rabbitmq.reconnect_delay", "5s")
	v.SetDefault("rabbitmq.max_reconnect_attempts", 10)

	v.SetDefault("simulator.heartbeat_interval", "30s")
	v.SetDefault("simulator.production_times", []string{"12:00", "00:00"})

	v.SetDefault("logging.level", "info")
	v.SetDefault("logging.format", "console")
	v.SetDefault("logging.output_path", "stdout")
}

func bindFlags(v *viper.Viper) {
	if err := v.BindPFlags(pflag.CommandLine); err != nil {
		panic(fmt.Errorf("failed to bind flags: %w", err))
	}
}
