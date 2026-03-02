package domain

import (
	"eurosupply/simulator/internal/warehouse/config"
	"time"
)

type Sector struct {
	ID             int64
	Name           string
	MinTemperature float64
	MaxTemperature float64
}

type WarehouseHeartbeatMessage struct {
	WarehouseID int64     `json:"warehouse_id"`
	Timestamp time.Time `json:"timestamp"`
	Status      string    `json:"status"`
    Type        string    `json:"type"`
}

func NewHeartbeatMessage(warehouseID int64) WarehouseHeartbeatMessage {
    return WarehouseHeartbeatMessage{
        WarehouseID: warehouseID,
        Timestamp:   time.Now(),
        Status:      "online",
        Type:        "heartbeat",
    }
}

type Warehouse struct {
	ID        int64
	Name      string
	Address   string
	City      string
	Country   string
	Latitude  float64
	Longitude float64
	Sectors   []Sector
}

type SectorTemperature struct {
    SectorID int64     `json:"sector_id"`
    Temperature float64 `json:"temperature"`
}

type WarehouseTemperatureMessage struct {
    WarehouseID   int64               `json:"warehouse_id"`
    Temperatures       []SectorTemperature `json:"temperatures"`
    Timestamp     time.Time           `json:"timestamp"`
}

func NewWarehouseTemperatureMessage(warehouse *Warehouse, temps map[int64]float64) WarehouseTemperatureMessage {
	sectorTemps := make([]SectorTemperature, 0, len(temps))
	for id, temp := range temps {
		sectorTemps = append(sectorTemps, SectorTemperature{
			SectorID:    id,
			Temperature: temp,
		})
	}

	return WarehouseTemperatureMessage{
		WarehouseID:  warehouse.ID,
		Temperatures: sectorTemps,
		Timestamp:    time.Now(),
	}
}

func NewWarehouse(cfg *config.Config) *Warehouse {
	return &Warehouse{
		ID:        int64(cfg.Warehouse.ID),
		Name:      cfg.Warehouse.Name,
		Address:   cfg.Warehouse.Address,
		City:      cfg.Warehouse.City,
		Country:   cfg.Warehouse.Country,
		Latitude:  cfg.Warehouse.Latitude,
		Longitude: cfg.Warehouse.Longitude,
		Sectors:   buildSectors(cfg),
	}
}

func buildSectors(cfg *config.Config) []Sector {
	sectors := make([]Sector, len(cfg.Warehouse.Sectors))
	for i, s := range cfg.Warehouse.Sectors {
		sectors[i] = Sector{
			ID:             int64(s.ID),
			Name:           s.Name,
			MinTemperature: s.MinTemperature,
			MaxTemperature: s.MaxTemperature,
		}
	}
	return sectors
}