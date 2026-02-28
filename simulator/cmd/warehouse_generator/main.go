package main

import (
	"eurosupply/simulator/internal/warehouse/bootstrap"
)

func main() {
	cfg := bootstrap.LoadWarehouseConfig()
	client := bootstrap.InitInflux(cfg.Influx)
	defer client.Close()

	gen := bootstrap.StartGenerator(cfg, client)

	select {
	case <-gen.Done():
	case <-bootstrap.ShutdownSignal():
		gen.Stop()
	}

	gen.WaitForShutdown()
}