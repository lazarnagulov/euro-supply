package bootstrap

import (
	"context"
	"eurosupply/simulator/internal/vehicle/config"
	"eurosupply/simulator/internal/vehicle/domain"
	"eurosupply/simulator/internal/vehicle/simulator"
	"eurosupply/simulator/shared/messaging"
	"github.com/spf13/pflag"
	"log"
	"os"
	"os/signal"
	"syscall"
)

func LoadConfig() *config.Config {
	config.RegisterFlags()
	configPath := pflag.String("config", "", "Optional path to configuration file (YAML/JSON)")
	pflag.Parse()

	cfg, err := config.Load(*configPath)
	if err != nil {
		log.Fatalf("Failed to load configuration: %v", err)
	}
	return cfg
}

func InitMessaging(cfg *config.Config) *messaging.RabbitMQClient {
	mqClient := messaging.NewRabbitMQClient(cfg.RabbitMQ)

	ctx, cancel := context.WithTimeout(context.Background(), cfg.RabbitMQ.ConnectionTimeout)
	defer cancel()

	if err := mqClient.Connect(ctx); err != nil {
		log.Fatalf("failed to connect to RabbitMQ: %v", err)
	}

	return mqClient
}

func StartSimulator(cfg *config.Config, mq *messaging.RabbitMQClient) *simulator.Simulator {
	vehicle := domain.NewVehicle(cfg)
	sim := simulator.New(*vehicle, mq.Publisher(), cfg.Simulator)

	if err := sim.Start(); err != nil {
		log.Fatalf("failed to start simulator: %v", err)
	}
	return sim
}

func WaitForShutdown() {
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, os.Interrupt, syscall.SIGTERM)
	<-sigChan
}
