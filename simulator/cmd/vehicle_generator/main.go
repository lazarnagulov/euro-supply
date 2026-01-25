package main

import (
	"eurosupply/simulator/internal/vehicle/bootstrap"
)

func main() {
	cfg := bootstrap.LoadGeneratorConfig()
	client := bootstrap.InitInflux(cfg.Influx)
	gen := bootstrap.StartGenerator(cfg, client)

	select {
	case <-gen.Done():
	case <-bootstrap.ShutdownSignal():
		gen.Stop()
	}

	gen.Stop()
	gen.WaitForShutdown()
}
