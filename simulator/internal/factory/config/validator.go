package config

import (
	"fmt"

	"github.com/go-playground/validator/v10"
)

var validate = validator.New()

func Validate(cfg *Config) error {
	if err := validate.Struct(cfg); err != nil {
		return fmt.Errorf("configuration validation failed: %w", err)
	}

	if cfg.Simulator.HeartbeatInterval <= 0 {
		return fmt.Errorf("simulator.heartbeat_interval must be > 0")
	}

	return nil
}
