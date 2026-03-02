package main

import (
	"eurosupply/simulator/internal/factory/bootstrap"
)

func main() {
	cfg := bootstrap.LoadGeneratorConfig()
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
