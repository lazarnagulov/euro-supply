package generator

import "time"

type SectorType string

const (
	SectorFrozen       SectorType = "frozen"       // -25°C to -18°C
	SectorRefrigerated SectorType = "refrigerated" // 2°C to 8°C
	SectorAmbient      SectorType = "ambient"      // 15°C to 25°C
)

type Warehouse struct {
	ID      int64
	Sectors []Sector
}

type Sector struct {
	SectorID   int64
	Type       SectorType
	MinTemp    float64
	MaxTemp    float64
}

type TemperatureRecord struct {
	WarehouseID int64
	SectorID    int64
	Temperature float64
	Timestamp   time.Time
}

var sectorProfiles = []struct {
	sType   SectorType
	minTemp float64
	maxTemp float64
}{
	{SectorFrozen, -25.0, -18.0},
	{SectorRefrigerated, 2.0, 8.0},
	{SectorAmbient, 15.0, 25.0},
}
