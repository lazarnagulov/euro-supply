package main

import (
	"eurosupply/delivery-vehicle-simulator/internal/config"
	"eurosupply/delivery-vehicle-simulator/internal/domain"
	"eurosupply/delivery-vehicle-simulator/internal/simulator"
	"fmt"
	"github.com/spf13/pflag"
	"log"
	"os"
	"os/signal"
	"syscall"
)

func main() {
	config.RegisterFlags()
	configPath := pflag.String("config", "", "Optional path to configuration file (YAML/JSON)")
	pflag.Parse()

	cfg, err := config.Load(*configPath)
	if err != nil {
		fmt.Printf("Failed to load configuration: %v\n", err)
		os.Exit(1)
	}

	vehicle := domain.NewVehicle(cfg)

	sim := simulator.New(*vehicle, cfg.Simulator)
	if err = sim.Start(); err != nil {
		log.Fatal("failed to start simulator")
	}

	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, os.Interrupt, syscall.SIGTERM)

	<-sigChan
	sim.Stop()
	sim.WaitForShutdown()
}
