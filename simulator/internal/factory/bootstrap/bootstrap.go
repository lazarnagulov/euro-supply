package bootstrap

import (
	"context"
	"eurosupply/simulator/internal/factory/config"
	internalConfig "eurosupply/simulator/internal/factory/config"
	"eurosupply/simulator/internal/factory/repository"
	"eurosupply/simulator/internal/factory/simulator"
	sharedConfig "eurosupply/simulator/shared/config"
	"eurosupply/simulator/shared/messaging"
	"log"
	"os"
	"os/signal"
	"syscall"

	"database/sql"

	_ "github.com/lib/pq"
	"github.com/spf13/pflag"
)

func LoadConfig() *internalConfig.Config {
	internalConfig.RegisterFlags()
	configPath := pflag.String("config", "", "Optional path to configuration file (YAML/JSON)")
	pflag.Parse()

	cfg, err := internalConfig.Load(*configPath)
	if err != nil {
		log.Fatalf("Failed to load configuration: %v", err)
	}
	return cfg
}

func InitMessaging(rabbitCfg sharedConfig.RabbitMQConfig) *messaging.RabbitMQClient {
	mqClient := messaging.NewRabbitMQClient(rabbitCfg)

	ctx, cancel := context.WithTimeout(context.Background(), rabbitCfg.ConnectionTimeout)
	defer cancel()

	if err := mqClient.Connect(ctx); err != nil {
		log.Fatalf("failed to connect to RabbitMQ: %v", err)
	}

	return mqClient
}
func StartSimulators(cfg *config.Config, mq *messaging.RabbitMQClient, db *sql.DB) []*simulator.Simulator {
	repo := repository.NewFactoryRepository(db)

	factories, err := repo.GetAllFactories()
	if err != nil {
		log.Fatalf("failed to load factories from DB: %v", err)
	}

	if len(factories) == 0 {
		log.Println("No factories found in the database. Nothing to simulate.")
		return nil
	}

	var sims []*simulator.Simulator

	for _, f := range factories {
		products, err := repo.GetProductsForFactory(f.ID)
		if err != nil {
			log.Printf("failed to load products for factory %d: %v", f.ID, err)
			continue
		}

		if len(products) == 0 {
			log.Printf("factory %d has no products, skipping", f.ID)
			continue
		}

		f.Products = products

		sim := simulator.New(f, mq.Publisher(), cfg.Simulator)

		if err := sim.Start(); err != nil {
			log.Printf("failed to start simulator for factory %d: %v", f.ID, err)
			continue
		}

		log.Printf("Simulator started for factory %d with %d products", f.ID, len(f.Products))
		sims = append(sims, sim)
	}

	if len(sims) == 0 {
		log.Println("No simulators started.")
	}

	return sims
}

func WaitForShutdown() {
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, os.Interrupt, syscall.SIGTERM)
	<-sigChan
}

func InitDB(cfg config.DBConfig) (*sql.DB, error) {
	db, err := sql.Open("postgres", cfg.URL)
	if err != nil {
		return nil, err
	}
	if err := db.Ping(); err != nil {
		return nil, err
	}
	return db, nil
}
