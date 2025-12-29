package domain

import (
	"eurosupply/simulator/internal/factory/config"
	"time"
)

type Factory struct {
	ID       int64
	Name     string
	Products []ProductConfig
}

type ProductConfig struct {
	ProductID int64
	MinQty    int
	MaxQty    int
}

type FactoryHeartbeatMessage struct {
	FactoryID int64     `json:"factory_id"`
	Timestamp time.Time `json:"timestamp"`
	Status    string    `json:"status"`
}

type ProductionItem struct {
	ProductID int64 `json:"product_id"`
	Quantity  int   `json:"quantity"`
}

type ProductionReportMessage struct {
	FactoryID  int64            `json:"factory_id"`
	ProducedAt time.Time        `json:"produced_at"`
	Items      []ProductionItem `json:"items"`
}

func NewFactory(cfg config.FactoryConfig) Factory {
	products := make([]ProductConfig, 0, len(cfg.Products))

	for _, p := range cfg.Products {
		products = append(products, ProductConfig{
			ProductID: p.ProductID,
			MinQty:    p.MinQty,
			MaxQty:    p.MaxQty,
		})
	}

	return Factory{
		ID:       cfg.ID,
		Name:     cfg.Name,
		Products: products,
	}
}
