package main

import (
	"context"
	"eurosupply/simulator/internal/vehicle/bootstrap"
	"eurosupply/simulator/internal/vehicle/generator"
	influxdb2 "github.com/influxdata/influxdb-client-go/v2"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"
)

func main() {
	cfg := bootstrap.LoadGeneratorConfig()
	client := influxdb2.NewClient(cfg.Influx.URL, cfg.Influx.Token)
	defer client.Close()

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	_, err := client.Ping(ctx)
	cancel()
	if err != nil {
		log.Fatalf("Failed to connect to InfluxDB: %v", err)
	}
	log.Println("Connected to InfluxDB successfully")

	vehicles := generator.GenerateVehicles(cfg.Vehicle.NumVehicles)
	ctx, cancel = context.WithCancel(context.Background())
	defer cancel()

	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, os.Interrupt, syscall.SIGTERM)

	errChan := make(chan error, 1)
	go func() {
		errChan <- generator.GenerateHistoricData(
			ctx,
			client,
			cfg,
			vehicles)
	}()

	select {
	case <-sigChan:
		log.Println("Received interrupt signal, shutting down...")
		cancel()
		<-errChan
	case err := <-errChan:
		if err != nil {
			log.Fatalf("Generation failed: %v", err)
		}
		log.Println("Generation completed successfully!")
	}
}
