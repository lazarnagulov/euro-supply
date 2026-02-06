package generator

import (
	"errors"
	"github.com/spf13/viper"
	"log"
	"time"
)

type Config struct {
	Influx  InfluxConfig  `mapstructure:"influx"`
	Vehicle VehicleConfig `mapstructure:"vehicle"`
}

type InfluxConfig struct {
	URL    string `mapstructure:"url"`
	Token  string `mapstructure:"token"`
	Org    string `mapstructure:"org"`
	Bucket string `mapstructure:"bucket"`
}

type VehicleConfig struct {
	NumVehicles       int           `mapstructure:"numVehicles"`
	YearsOfHistory    int           `mapstructure:"yearsOfHistory"`
	Workers           int           `mapstructure:"workers"`
	BatchSize         int           `mapstructure:"batchSize"`
	MinSpeed          float64       `mapstructure:"minSpeed"`
	MaxSpeed          float64       `mapstructure:"maxSpeed"`
	ReportingInterval time.Duration `mapstructure:"reportingInterval"`
}

func Load(path string) (*Config, error) {
	v := viper.New()

	v.SetConfigFile(path)
	v.SetConfigType("yaml")

	v.SetEnvPrefix("APP")
	v.AutomaticEnv()

	setDefaults(v)

	if err := v.ReadInConfig(); err != nil {
		log.Fatalf("failed reading config file: %v", err)
	}

	var cfg Config
	if err := v.Unmarshal(&cfg); err != nil {
		log.Fatalf("failed unmarshalling config: %v", err)
	}

	err := validate(&cfg)
	if err != nil {
		return nil, err
	}

	return &cfg, nil
}

func setDefaults(v *viper.Viper) {
	v.SetDefault("vehicle.numVehicles", 100)
	v.SetDefault("vehicle.yearsOfHistory", 5)
	v.SetDefault("vehicle.workers", 10)
	v.SetDefault("vehicle.batchSize", 5000)
	v.SetDefault("vehicle.minSpeed", 20.0)
	v.SetDefault("vehicle.maxSpeed", 90.0)
	v.SetDefault("vehicle.reportingInterval", 10*time.Minute)

	v.SetDefault("influx.url", "http://localhost:8086")
	v.SetDefault("influx.org", "eurosupply")
	v.SetDefault("influx.bucket", "vehicle")
}

func validate(cfg *Config) error {
	if cfg.Influx.Token == "" {
		return errors.New("influx.token is required")
	}

	if cfg.Vehicle.MinSpeed >= cfg.Vehicle.MaxSpeed {
		return errors.New("minSpeed must be lower than maxSpeed")
	}

	return nil
}
