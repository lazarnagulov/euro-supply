package main

import "eurosupply/simulator/internal/vehicle/bootstrap"

func main() {
	cfg := bootstrap.LoadConfig()
	mqClient := bootstrap.InitMessaging(cfg)
	sim := bootstrap.StartSimulator(cfg, mqClient)

	bootstrap.WaitForShutdown()
	sim.Stop()
	sim.WaitForShutdown()
}
