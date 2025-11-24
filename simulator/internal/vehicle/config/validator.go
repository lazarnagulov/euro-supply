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

	if cfg.Vehicle.ID == "" {
		return fmt.Errorf("vehicle.id is required")
	}

	if cfg.Vehicle.RegistrationNumber == "" {
		return fmt.Errorf("vehicle.registration_number is required")
	}

	if cfg.Simulator.MinSpeed > cfg.Simulator.MaxSpeed {
		return fmt.Errorf("simulator.min_speed cannot be greater than max_speed")
	}

	return nil
}
