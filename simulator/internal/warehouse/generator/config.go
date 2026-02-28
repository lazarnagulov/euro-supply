package generator

import (
	"errors"
	"log"
	"time"

	"github.com/spf13/viper"
)

type Config struct {
	Influx    InfluxConfig    `mapstructure:"influx"`
	Warehouse WarehouseConfig `mapstructure:"warehouse"`
}

type InfluxConfig struct {
	URL    string `mapstructure:"url"`
	Token  string `mapstructure:"token"`
	Org    string `mapstructure:"org"`
	Bucket string `mapstructure:"bucket"`
}

type WarehouseConfig struct {
	NumWarehouses     int           `mapstructure:"numWarehouses"`
	NumSectors        int           `mapstructure:"numSectors"`
	YearsOfHistory    int           `mapstructure:"yearsOfHistory"`
	Workers           int           `mapstructure:"workers"`
	BatchSize         int           `mapstructure:"batchSize"`
	IntervalMinutes   int           `mapstructure:"intervalMinutes"`
	HeartbeatInterval time.Duration `mapstructure:"heartbeatInterval"`
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

	if err := validate(&cfg); err != nil {
		return nil, err
	}

	return &cfg, nil
}

func setDefaults(v *viper.Viper) {
	v.SetDefault("warehouse.numWarehouses", 100)
	v.SetDefault("warehouse.numSectors", 3)
	v.SetDefault("warehouse.yearsOfHistory", 2)
	v.SetDefault("warehouse.workers", 10)
	v.SetDefault("warehouse.batchSize", 5000)
	v.SetDefault("warehouse.intervalMinutes", 10)
	v.SetDefault("warehouse.heartbeatInterval", 30*time.Second)

	v.SetDefault("influx.url", "http://localhost:8086")
	v.SetDefault("influx.org", "eurosupply")
	v.SetDefault("influx.bucket", "warehouse")
}

func validate(cfg *Config) error {
	if cfg.Influx.Token == "" {
		return errors.New("influx.token is required")
	}

	if cfg.Warehouse.NumWarehouses < 1 {
		return errors.New("numWarehouses must be at least 1")
	}

	if cfg.Warehouse.NumSectors < 1 {
		return errors.New("numSectors must be at least 1")
	}

	if cfg.Warehouse.IntervalMinutes < 1 {
		return errors.New("intervalMinutes must be at least 1")
	}

	return nil
}