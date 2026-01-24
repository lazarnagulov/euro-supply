package main

import (
	"eurosupply/simulator/internal/vehicle/bootstrap"
)

func main() {
	cfg := bootstrap.LoadGeneratorConfig()
	client := bootstrap.InitInflux(cfg.Influx)
	gen := bootstrap.StartGenerator(cfg, client)
	bootstrap.WaitForShutdown()

	gen.Stop()
	gen.WaitForShutdown()
}
