package bootstrap

import (
	"context"
	"eurosupply/simulator/internal/factory/generator"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	influxdb2 "github.com/influxdata/influxdb-client-go/v2"
	"github.com/spf13/pflag"
)

func LoadGeneratorConfig() *generator.Config {
	configPath := pflag.String("config", "", "Path to configuration file (YAML/JSON)")
	pflag.Parse()

	cfg, err := generator.Load(*configPath)
	if err != nil {
		log.Fatalf("Failed to load configuration: %v", err)
	}
	return cfg
}

func InitInflux(cfg generator.InfluxConfig) influxdb2.Client {
	client := influxdb2.NewClient(cfg.URL, cfg.Token)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if _, err := client.Ping(ctx); err != nil {
		log.Fatalf("failed to connect to InfluxDB: %v", err)
	}

	log.Println("Connected to InfluxDB successfully")
	return client
}

func StartGenerator(cfg *generator.Config, client influxdb2.Client) *generator.Runner {
	return generator.NewRunner(cfg, client)
}

func ShutdownSignal() <-chan os.Signal {
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, os.Interrupt, syscall.SIGTERM)
	return sigChan
}
