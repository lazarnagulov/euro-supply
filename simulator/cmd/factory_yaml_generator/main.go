package main

import (
	"database/sql"
	"eurosupply/simulator/shared/config"
	"fmt"
	"log"
	"os"
	"strconv"

	_ "github.com/lib/pq"
	"gopkg.in/yaml.v2"
)

type Config struct {
	Factory   FactoryConfig         `yaml:"factory"`
	Simulator SimulatorConfig       `yaml:"simulator"`
	Logging   LoggingConfig         `yaml:"logging"`
	RabbitMQ  config.RabbitMQConfig `yaml:"rabbitmq"`
}

type FactoryConfig struct {
	ID       int64           `yaml:"id"`
	Products []ProductConfig `yaml:"products"`
}

type ProductConfig struct {
	ProductID int64 `yaml:"product_id"`
}

type SimulatorConfig struct {
	HeartbeatInterval string   `yaml:"heartbeat_interval"`
	ProductionTimes   []string `yaml:"production_times"`
}

type LoggingConfig struct {
	Level      string `yaml:"level"`
	Format     string `yaml:"format"`
	OutputPath string `yaml:"output_path"`
}

func main() {
	if len(os.Args) < 2 {
		log.Fatal("Usage: go run generate_factory_yaml.go <factory_id>")
	}
	factoryID := os.Args[1]

	dbURL := "postgres://user:pass@localhost:5432/eurosupply?sslmode=disable"
	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	rows, err := db.Query("SELECT product_id FROM product_factory WHERE factory_id = $1", factoryID)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	var products []struct{ ProductID int64 }
	for rows.Next() {
		var p struct{ ProductID int64 }
		if err := rows.Scan(&p.ProductID); err != nil {
			log.Fatal(err)
		}
		products = append(products, p)
	}

	var productConfigs []ProductConfig
	for _, p := range products {
		productConfigs = append(productConfigs, ProductConfig{
			ProductID: p.ProductID,
		})
	}

	factoryIDInt, err := strconv.ParseInt(factoryID, 10, 64)
	if err != nil {
		log.Fatalf("Invalid factory ID: %v", err)
	}

	cfg := Config{
		Factory: FactoryConfig{
			ID:       factoryIDInt,
			Products: productConfigs,
		},
		Simulator: SimulatorConfig{
			HeartbeatInterval: "30s",
			ProductionTimes:   []string{"12:00", "00:00"},
		},
		Logging: LoggingConfig{
			Level:      "info",
			Format:     "console",
			OutputPath: "stdout",
		},
		RabbitMQ: config.RabbitMQConfig{
			URL: "amqp://guest:guest@localhost:5672/",
			Exchanges: []config.ExchangeConfig{
				{
					Name:    "factory.heartbeat",
					Kind:    "topic",
					Durable: true,
				},
				{
					Name:    "factory.production",
					Kind:    "topic",
					Durable: true,
				},
			},
		},
	}

	out, err := yaml.Marshal(cfg)
	if err != nil {
		log.Fatal(err)
	}

	filename := fmt.Sprintf("configs/factory/factory_%s.yaml", factoryID)
	err = os.WriteFile(filename, out, 0644)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Printf("Configuration file generated successfully.\n")
}
