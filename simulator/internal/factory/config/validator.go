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

	if cfg.Factory.ID < 1 {
		return fmt.Errorf("factory.id is required and must be > 0")
	}

	if cfg.Factory.Name == "" {
		return fmt.Errorf("factory.name is required")
	}

	if len(cfg.Factory.Products) == 0 {
		return fmt.Errorf("factory.products cannot be empty")
	}

	for i, p := range cfg.Factory.Products {
		if p.ProductID < 1 {
			return fmt.Errorf("factory.products[%d].product_id must be > 0", i)
		}
		if p.MinQty < 1 {
			return fmt.Errorf("factory.products[%d].min_qty must be > 0", i)
		}
		if p.MaxQty < p.MinQty {
			return fmt.Errorf("factory.products[%d].max_qty must be >= min_qty", i)
		}
	}

	if cfg.Simulator.HeartbeatInterval <= 0 {
		return fmt.Errorf("simulator.heartbeat_interval must be > 0")
	}

	if len(cfg.Simulator.ProductionTimes) == 0 {
		return fmt.Errorf("simulator.production_times cannot be empty")
	}

	return nil
}
