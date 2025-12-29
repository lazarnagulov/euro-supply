package main

import "eurosupply/simulator/internal/factory/bootstrap"

func main() {
	cfg := bootstrap.LoadConfig()

	mqClient := bootstrap.InitMessaging(cfg.RabbitMQ)
	sim := bootstrap.StartSimulator(cfg, mqClient)

	bootstrap.WaitForShutdown()
	sim.Stop()
	sim.WaitForShutdown()
}
