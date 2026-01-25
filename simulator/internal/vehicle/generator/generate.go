package generator

import (
	"context"
	"eurosupply/simulator/internal/vehicle/domain"
	"eurosupply/simulator/internal/vehicle/simulator"
	influxdb2 "github.com/influxdata/influxdb-client-go/v2"
	"github.com/influxdata/influxdb-client-go/v2/api"
	"github.com/influxdata/influxdb-client-go/v2/api/write"
	"log"
	"math/rand"
	"strconv"
	"sync"
	"time"
)

type VehicleGenerator struct {
	writeAPI          api.WriteAPI
	movementSim       *simulator.MovementSimulator
	reportingInterval time.Duration
	batchSize         int
	rng               *rand.Rand
	workerID          int
}

func (g *VehicleGenerator) Generate(ctx context.Context, vehicle domain.Vehicle, startTime, endTime time.Time) {
	currentTime := startTime
	currentLocation := vehicle.Location
	isOnline := false
	var (
		locationCount int
		statusCount   int
		pointsInBatch int
	)
	nextStatusChange := currentTime

	for currentTime.Before(endTime) {
		if ctx.Err() != nil {
			return
		}

		if !currentTime.Before(nextStatusChange) {
			isOnline = !isOnline
			duration := nextStatusDuration(isOnline, currentTime, g.rng)
			nextStatusChange = currentTime.Add(duration)
			p := newAvailabilityPoint(vehicle.ID, isOnline, currentTime)
			g.writeAPI.WritePoint(p)
			statusCount++
			pointsInBatch++
		}

		if isOnline {
			intervalMinutes := g.reportingInterval.Minutes()
			newLocation, distance := g.movementSim.SimulateMovement(currentLocation, intervalMinutes)
			currentLocation = newLocation

			p := newLocationPoint(vehicle.ID, newLocation, distance, currentTime)
			g.writeAPI.WritePoint(p)
			locationCount++
			pointsInBatch++
		}
		currentTime = currentTime.Add(g.reportingInterval)

		if pointsInBatch >= g.batchSize {
			g.writeAPI.Flush()
			log.Printf("Worker %d: Vehicle %d - Progress: %d locations, %d status changes",
				g.workerID, vehicle.ID, locationCount, statusCount)
			pointsInBatch = 0
		}
	}
	g.writeAPI.Flush()
	log.Printf("Worker %d: Vehicle %d completed - Locations: %d, Status changes: %d",
		g.workerID, vehicle.ID, locationCount, statusCount)
}

func GenerateVehicles(count int) []domain.Vehicle {
	vehicles := make([]domain.Vehicle, count)
	baseLat := 44.8
	baseLon := 20.4

	for i := 0; i < count; i++ {
		vehicles[i] = domain.Vehicle{
			ID: int64(i + 1),
			Location: domain.Location{
				Latitude:  baseLat + (float64(i%10) * 0.1),
				Longitude: baseLon + (float64(i/10) * 0.1),
				UpdatedAt: time.Now(),
			},
		}
	}

	return vehicles
}

func GenerateHistoricData(ctx context.Context, client influxdb2.Client, cfg *Config, vehicles []domain.Vehicle) error {
	endTime := time.Now()
	startTime := endTime.AddDate(-cfg.Vehicle.YearsOfHistory, 0, 0)
	var wg sync.WaitGroup
	vehicleChan := make(chan domain.Vehicle, len(vehicles))
	for i := 0; i < cfg.Vehicle.Workers; i++ {
		wg.Add(1)
		rng := rand.New(rand.NewSource(time.Now().UnixNano()))
		go worker(ctx, i, client, cfg, vehicleChan, &wg, startTime, endTime, rng)
	}

	for _, vehicle := range vehicles {
		select {
		case <-ctx.Done():
			close(vehicleChan)
			wg.Wait()
			return ctx.Err()
		case vehicleChan <- vehicle:
		}
	}
	close(vehicleChan)
	wg.Wait()
	return nil
}

func worker(
	ctx context.Context,
	workerID int,
	client influxdb2.Client,
	cfg *Config,
	vehicleChan <-chan domain.Vehicle,
	wg *sync.WaitGroup,
	startTime,
	endTime time.Time,
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

	generator := &VehicleGenerator{
		writeAPI:          writeApi,
		movementSim:       simulator.NewMovementSimulator(cfg.Vehicle.MinSpeed, cfg.Vehicle.MaxSpeed),
		reportingInterval: cfg.Vehicle.ReportingInterval,
		batchSize:         cfg.Vehicle.BatchSize,
		rng:               rng,
		workerID:          workerID,
	}

	for vehicle := range vehicleChan {
		if ctx.Err() != nil {
			return
		}
		generator.Generate(ctx, vehicle, startTime, endTime)
	}
}

func nextStatusDuration(isOnline bool, t time.Time, rng *rand.Rand) time.Duration {
	hour := t.Hour()
	weekday := t.Weekday()

	if isOnline {
		switch {
		case hour >= 12 && hour < 13:
			return time.Hour
		case weekday == time.Saturday || weekday == time.Sunday:
			return time.Duration(6+rng.Intn(6)) * time.Hour
		case hour >= 18:
			return time.Duration(10+rng.Intn(4)) * time.Hour
		default:
			return time.Duration(15+rng.Intn(45)) * time.Minute
		}
	}

	switch {
	case weekday == time.Saturday || weekday == time.Sunday:
		return time.Duration(3+rng.Intn(4)) * time.Hour
	case hour >= 7 && hour < 12:
		return time.Duration(4+rng.Intn(2)) * time.Hour
	case hour >= 13 && hour < 18:
		return time.Duration(4+rng.Intn(3)) * time.Hour
	default:
		return time.Duration(2+rng.Intn(3)) * time.Hour
	}
}

func newAvailabilityPoint(vehicleID int64, isOnline bool, t time.Time) *write.Point {
	return influxdb2.NewPoint(
		"vehicle_availability",
		map[string]string{"vehicle_id": strconv.FormatInt(vehicleID, 10)},
		map[string]interface{}{"is_online": isOnline},
		t,
	)
}

func newLocationPoint(vehicleID int64, loc domain.Location, dist float64, t time.Time) *write.Point {
	return influxdb2.NewPoint(
		"vehicle_location",
		map[string]string{"vehicle_id": strconv.FormatInt(vehicleID, 10)},
		map[string]interface{}{
			"type":              "GPS",
			"latitude":          loc.Latitude,
			"longitude":         loc.Longitude,
			"distance_traveled": dist,
		},
		t,
	)
}
