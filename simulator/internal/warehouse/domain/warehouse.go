package domain

import (
	"eurosupply/simulator/internal/warehouse/config"
	"time"
)

type Sector struct {
	Name           string
	MinTemperature float64
	MaxTemperature float64
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
    SectorName  string  `json:"sector_name"`
    Temperature float64 `json:"temperature"`
}

type WarehouseTemperatureMessage struct {
    WarehouseID   int64               `json:"warehouse_id"`
    WarehouseName string              `json:"warehouse_name"`
    Sectors       []SectorTemperature `json:"sectors"`
    Timestamp     time.Time           `json:"timestamp"`
    Type          string              `json:"type"`
}

func NewWarehouseTemperatureMessage(warehouse *Warehouse, temperatures map[string]float64) WarehouseTemperatureMessage {
    sectors := make([]SectorTemperature, 0, len(temperatures))
    for name, temp := range temperatures {
        sectors = append(sectors, SectorTemperature{
            SectorName:  name,
            Temperature: temp,
        })
    }

    return WarehouseTemperatureMessage{
        WarehouseID:   warehouse.ID,
        WarehouseName: warehouse.Name,
        Sectors:       sectors,
        Timestamp:     time.Now(),
        Type:          "temperature",
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
			Name:           s.Name,
			MinTemperature: s.MinTemperature,
			MaxTemperature: s.MaxTemperature,
		}
	}
	return sectors
}
