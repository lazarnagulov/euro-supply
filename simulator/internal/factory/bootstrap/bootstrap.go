package bootstrap

import (
	"context"
	internalConfig "eurosupply/simulator/internal/factory/config"
	"eurosupply/simulator/internal/factory/domain"
	"eurosupply/simulator/internal/factory/simulator"
	sharedConfig "eurosupply/simulator/shared/config"
	"eurosupply/simulator/shared/messaging"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/spf13/pflag"
)

func LoadConfig() *internalConfig.Config {
	internalConfig.RegisterFlags()
	configPath := pflag.String("config", "", "Optional path to configuration file (YAML/JSON)")
	pflag.Parse()

	cfg, err := internalConfig.Load(*configPath)
	if err != nil {
		log.Fatalf("Failed to load configuration: %v", err)
	}
	return cfg
}

func InitMessaging(rabbitCfg sharedConfig.RabbitMQConfig) *messaging.RabbitMQClient {
	mqClient := messaging.NewRabbitMQClient(rabbitCfg)

	ctx, cancel := context.WithTimeout(context.Background(), rabbitCfg.ConnectionTimeout)
	defer cancel()

	if err := mqClient.Connect(ctx); err != nil {
		log.Fatalf("failed to connect to RabbitMQ: %v", err)
	}

	return mqClient
}

func StartSimulator(cfg *internalConfig.Config, mq *messaging.RabbitMQClient) *simulator.Simulator {
	factory := domain.NewFactory(cfg.Factory)

	sim := simulator.New(factory, mq.Publisher(), cfg.Simulator)

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
