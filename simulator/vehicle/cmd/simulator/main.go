package main

import (
	"eurosupply/delivery-vehicle-simulator/internal/config"
	"eurosupply/delivery-vehicle-simulator/internal/domain"
	"flag"
	"fmt"
	"os"
	"os/signal"
	"syscall"
)

func main() {
	configPath := flag.String("config", "", "path to configuration file (YAML/JSON)")
	flag.Parse()

	cfg, err := config.Load(*configPath)
	if err != nil {
		fmt.Printf("Failed to load configuration: %v\n", err)
		os.Exit(1)
	}

	vehicle := domain.NewVehicle(cfg)

	fmt.Println(vehicle)

	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, os.Interrupt, syscall.SIGTERM)

	<-sigChan
}
