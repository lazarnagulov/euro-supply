package generator

import (
	"errors"
	"log"
	"time"

	"github.com/spf13/viper"
)

type Config struct {
	Influx  InfluxConfig  `mapstructure:"influx"`
	Factory FactoryConfig `mapstructure:"factory"`
}

type InfluxConfig struct {
	URL    string `mapstructure:"url"`
	Token  string `mapstructure:"token"`
	Org    string `mapstructure:"org"`
	Bucket string `mapstructure:"bucket"`
}

type FactoryConfig struct {
	NumFactories      int           `mapstructure:"numFactories"`
	NumProducts       int           `mapstructure:"numProducts"`
	YearsOfHistory    int           `mapstructure:"yearsOfHistory"`
	Workers           int           `mapstructure:"workers"`
	BatchSize         int           `mapstructure:"batchSize"`
	MinQuantity       int           `mapstructure:"minQuantity"`
	MaxQuantity       int           `mapstructure:"maxQuantity"`
	ProductionTimes   []string      `mapstructure:"productionTimes"`
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
	v.SetDefault("factory.numFactories", 1000)
	v.SetDefault("factory.numProducts", 10)
	v.SetDefault("factory.yearsOfHistory", 4)
	v.SetDefault("factory.workers", 20)
	v.SetDefault("factory.batchSize", 5000)
	v.SetDefault("factory.minQuantity", 10)
	v.SetDefault("factory.maxQuantity", 200)
	v.SetDefault("factory.productionTimes", []string{"12:00", "00:00"})
	v.SetDefault("factory.heartbeatInterval", 30*time.Second)

	v.SetDefault("influx.url", "http://localhost:8086")
	v.SetDefault("influx.org", "eurosupply")
	v.SetDefault("influx.bucket", "factory")
}

func validate(cfg *Config) error {
	if cfg.Influx.Token == "" {
		return errors.New("influx.token is required")
	}

	if cfg.Factory.MinQuantity >= cfg.Factory.MaxQuantity {
		return errors.New("minQuantity must be lower than maxQuantity")
	}

	if cfg.Factory.NumProducts < 1 {
		return errors.New("numProducts must be at least 1")
	}

	return nil
}
