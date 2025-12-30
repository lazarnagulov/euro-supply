package main

import (
	"eurosupply/simulator/internal/factory/bootstrap"
	"log"

	_ "github.com/lib/pq"
)

func main() {
	cfg := bootstrap.LoadConfig()

	mqClient := bootstrap.InitMessaging(cfg.RabbitMQ)

	db, err := bootstrap.InitDB(cfg.DB)
	if err != nil {
		log.Fatalf("Failed to connect to DB: %v", err)
	}
	defer db.Close()

	sims := bootstrap.StartSimulators(cfg, mqClient, db)
	if len(sims) == 0 {
		log.Println("No simulators started. Exiting.")
		return
	}

	bootstrap.WaitForShutdown()
	log.Println("Shutting down simulators...")

	for _, sim := range sims {
		sim.Stop()
	}

	for _, sim := range sims {
		sim.WaitForShutdown()
	}

	log.Println("All simulators stopped.")
}
