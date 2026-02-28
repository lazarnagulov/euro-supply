package generator

import (
	"context"
	"log"
	"math"
	"math/rand"
	"strconv"
	"sync"
	"time"

	influxdb2 "github.com/influxdata/influxdb-client-go/v2"
	"github.com/influxdata/influxdb-client-go/v2/api"
	"github.com/influxdata/influxdb-client-go/v2/api/write"
)

type WarehouseGenerator struct {
	writeAPI        api.WriteAPI
	intervalMinutes int
	batchSize       int
	rng             *rand.Rand
	workerID        int
}

func (g *WarehouseGenerator) Generate(ctx context.Context, warehouse Warehouse, startTime, endTime time.Time) {
	current := truncateToDay(startTime)
	var (
		totalRecords  int
		pointsInBatch int
	)

	interval := time.Duration(g.intervalMinutes) * time.Minute

	for !current.After(endTime) {
		if ctx.Err() != nil {
			return
		}

		t := current
		for !t.After(current.Add(24*time.Hour-interval)) {
			if t.Before(startTime) {
				t = t.Add(interval)
				continue
			}
			if t.After(endTime) {
				break
			}

			for _, sector := range warehouse.Sectors {
				temp := simulateTemperature(g.rng, sector, t)

				p := newTemperaturePoint(warehouse.ID, sector.SectorID, string(sector.Type), temp, t)
				g.writeAPI.WritePoint(p)
				totalRecords++
				pointsInBatch++
			}

			if pointsInBatch >= g.batchSize {
				g.writeAPI.Flush()
				log.Printf("Worker %d: Warehouse %d - Progress: %d records written",
					g.workerID, warehouse.ID, totalRecords)
				pointsInBatch = 0
			}

			t = t.Add(interval)
		}

		current = current.AddDate(0, 0, 1)
	}

	g.writeAPI.Flush()
	log.Printf("Worker %d: Warehouse %d completed - Total records: %d",
		g.workerID, warehouse.ID, totalRecords)
}

func simulateTemperature(rng *rand.Rand, sector Sector, t time.Time) float64 {
	mid := (sector.MinTemp + sector.MaxTemp) / 2.0
	halfRange := (sector.MaxTemp - sector.MinTemp) / 2.0

	dayOfYear := float64(t.YearDay())
	seasonalPhase := 2 * math.Pi * (dayOfYear - 15) / 365.25
	seasonalAmplitude := seasonalInfluence(sector.Type)
	seasonal := seasonalAmplitude * math.Sin(seasonalPhase)

	hourOfDay := float64(t.Hour()) + float64(t.Minute())/60.0
	dailyPhase := 2 * math.Pi * (hourOfDay - 6) / 24.0
	dailyAmplitude := dailyInfluence(sector.Type)
	daily := dailyAmplitude * math.Sin(dailyPhase)

	noiseSigma := noiseLevel(sector.Type)
	noise := rng.NormFloat64() * noiseSigma

	anomaly := 0.0
	if rng.Float64() < 0.005 {
		anomaly = anomalyMagnitude(sector.Type, rng)
	}

	raw := mid + seasonal + daily + noise + anomaly

	minClamp := sector.MinTemp - 3.0
	maxClamp := sector.MaxTemp + 3.0
	_ = halfRange 

	if raw < minClamp {
		raw = minClamp
	}
	if raw > maxClamp {
		raw = maxClamp
	}

	return math.Round(raw*10) / 10
}

func seasonalInfluence(t SectorType) float64 {
	switch t {
	case SectorFrozen:
		return 0.5
	case SectorRefrigerated:
		return 1.0
	case SectorAmbient:
		return 4.0 
	default:
		return 1.0
	}
}

func dailyInfluence(t SectorType) float64 {
	switch t {
	case SectorFrozen:
		return 0.3
	case SectorRefrigerated:
		return 0.8
	case SectorAmbient:
		return 2.5
	default:
		return 1.0
	}
}

func noiseLevel(t SectorType) float64 {
	switch t {
	case SectorFrozen:
		return 0.2
	case SectorRefrigerated:
		return 0.3
	case SectorAmbient:
		return 0.5
	default:
		return 0.3
	}
}

func anomalyMagnitude(t SectorType, rng *rand.Rand) float64 {
	switch t {
	case SectorFrozen:
		return rng.Float64() * 4.0
	case SectorRefrigerated:
		return rng.Float64() * 5.0
	case SectorAmbient:
		return rng.Float64() * 8.0
	default:
		return rng.Float64() * 3.0
	}
}

func GenerateWarehouses(cfg *Config) []Warehouse {
	warehouses := make([]Warehouse, cfg.Warehouse.NumWarehouses)

	for i := 0; i < cfg.Warehouse.NumWarehouses; i++ {
		warehouseID := int64(i + 1)
		sectors := make([]Sector, cfg.Warehouse.NumSectors)

		for j := 0; j < cfg.Warehouse.NumSectors; j++ {
			profileIdx := j
			if profileIdx >= len(sectorProfiles) {
				profileIdx = len(sectorProfiles) - 1
			}
			profile := sectorProfiles[profileIdx]

			log.Printf("Warehouse %d, Sector %d: Type=%s, TempRange=%.1f to %.1f°C")
			sectors[j] = Sector{
				SectorID: int64(i*cfg.Warehouse.NumSectors + j + 1),
				Type:     profile.sType,
				MinTemp:  profile.minTemp,
				MaxTemp:  profile.maxTemp,
			}
		}

		warehouses[i] = Warehouse{
			ID:      warehouseID,
			Sectors: sectors,
		}
	}

	return warehouses
}

func GenerateHistoricData(ctx context.Context, client influxdb2.Client, cfg *Config, warehouses []Warehouse) error {
	endTime := time.Now()
	startTime := endTime.AddDate(-cfg.Warehouse.YearsOfHistory, 0, 0)

	log.Printf("Generating data from %s to %s", startTime.Format("2006-01-02"), endTime.Format("2006-01-02"))

	var wg sync.WaitGroup
	warehouseChan := make(chan Warehouse, len(warehouses))

	for i := 0; i < cfg.Warehouse.Workers; i++ {
		wg.Add(1)
		rng := rand.New(rand.NewSource(time.Now().UnixNano() + int64(i)))
		go worker(ctx, i, client, cfg, warehouseChan, &wg, startTime, endTime, rng)
	}

	for _, warehouse := range warehouses {
		select {
		case <-ctx.Done():
			close(warehouseChan)
			wg.Wait()
			return ctx.Err()
		case warehouseChan <- warehouse:
		}
	}

	close(warehouseChan)
	wg.Wait()
	return nil
}

func worker(
	ctx context.Context,
	workerID int,
	client influxdb2.Client,
	cfg *Config,
	warehouseChan <-chan Warehouse,
	wg *sync.WaitGroup,
	startTime, endTime time.Time,
	rng *rand.Rand,
) {
	defer wg.Done()

	writeApi := client.WriteAPI(cfg.Influx.Org, cfg.Influx.Bucket)
	defer writeApi.Flush()

	go func() {
		for {
			select {
			case <-ctx.Done():
				return
			case err, ok := <-writeApi.Errors():
				if !ok {
					return
				}
				log.Printf("Worker %d: Write error: %v", workerID, err)
			}
		}
	}()

	generator := &WarehouseGenerator{
		writeAPI:        writeApi,
		intervalMinutes: cfg.Warehouse.IntervalMinutes,
		batchSize:       cfg.Warehouse.BatchSize,
		rng:             rng,
		workerID:        workerID,
	}

	for warehouse := range warehouseChan {
		if ctx.Err() != nil {
			return
		}
		generator.Generate(ctx, warehouse, startTime, endTime)
	}
}

func newTemperaturePoint(warehouseID, sectorID int64, sectorType string, temperature float64, t time.Time) *write.Point {
	return influxdb2.NewPoint(
		"warehouse_temperature",
		map[string]string{
			"warehouse_id": strconv.FormatInt(warehouseID, 10),
			"sector_id":    strconv.FormatInt(sectorID, 10),
		},
		map[string]interface{}{
			"temperature": temperature,
		},
		t,
	)
}

func truncateToDay(t time.Time) time.Time {
	return time.Date(t.Year(), t.Month(), t.Day(), 0, 0, 0, 0, t.Location())
}