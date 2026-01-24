package generator

import (
	"context"
	"eurosupply/simulator/internal/vehicle/domain"
	"eurosupply/simulator/internal/vehicle/simulator"
	"fmt"
	influxdb2 "github.com/influxdata/influxdb-client-go/v2"
	"github.com/influxdata/influxdb-client-go/v2/api"
	"log"
	"math/rand"
	"sync"
	"time"
)

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

	errorsChan := writeApi.Errors()
	go func() {
		for err := range errorsChan {
			log.Printf("Worker %d: Write error: %v", workerID, err)
		}
	}()

	movementSim := simulator.NewMovementSimulator(cfg.Vehicle.MinSpeed, cfg.Vehicle.MaxSpeed)
	for vehicle := range vehicleChan {
		select {
		case <-ctx.Done():
			return
		default:
			generateVehicleData(
				ctx, workerID, writeApi, vehicle, startTime, endTime,
				cfg.Vehicle.BatchSize, movementSim, cfg.Vehicle.ReportingInterval, rng)
		}
	}
}

func generateVehicleData(
	ctx context.Context,
	workerID int,
	writeAPI api.WriteAPI,
	vehicle domain.Vehicle,
	startTime, endTime time.Time,
	batchSize int,
	simulator *simulator.MovementSimulator,
	reportingInterval time.Duration,
	rng *rand.Rand,
) {
	currentTime := startTime
	currentLocation := vehicle.Location
	isOnline := false

	locationCount := 0
	statusCount := 0
	pointsInBatch := 0

	nextStatusChange := currentTime

	for currentTime.Before(endTime) {
		select {
		case <-ctx.Done():
			return
		default:
		}

		if currentTime.Equal(nextStatusChange) || currentTime.After(nextStatusChange) {
			if isOnline {
				var offlineDuration time.Duration
				hour := currentTime.Hour()
				weekday := currentTime.Weekday()

				if hour >= 12 && hour < 13 {
					offlineDuration = 1 * time.Hour
				} else if weekday == time.Saturday || weekday == time.Sunday {
					offlineDuration = time.Duration(6+rng.Intn(6)) * time.Hour
				} else if hour >= 18 {
					offlineDuration = time.Duration(10+rng.Intn(4)) * time.Hour
				} else {
					offlineDuration = time.Duration(15+rng.Intn(45)) * time.Minute
				}

				isOnline = false
				nextStatusChange = currentTime.Add(offlineDuration)
			} else {
				var onlineDuration time.Duration
				hour := currentTime.Hour()
				weekday := currentTime.Weekday()

				if weekday == time.Saturday || weekday == time.Sunday {
					onlineDuration = time.Duration(3+rng.Intn(4)) * time.Hour
				} else if hour >= 7 && hour < 12 {
					onlineDuration = time.Duration(4+rng.Intn(2)) * time.Hour
				} else if hour >= 13 && hour < 18 {
					onlineDuration = time.Duration(4+rng.Intn(3)) * time.Hour
				} else {
					onlineDuration = time.Duration(2+rng.Intn(3)) * time.Hour
				}

				isOnline = true
				nextStatusChange = currentTime.Add(onlineDuration)
			}

			p := influxdb2.NewPoint(
				"vehicle_availability",
				map[string]string{"vehicle_id": fmt.Sprintf("%d", vehicle.ID)},
				map[string]interface{}{"is_online": isOnline},
				currentTime,
			)
			writeAPI.WritePoint(p)
			statusCount++
			pointsInBatch++
		}

		if isOnline {
			intervalMinutes := reportingInterval.Minutes()
			newLocation, distance := simulator.SimulateMovement(currentLocation, intervalMinutes)
			currentLocation = newLocation

			p := influxdb2.NewPoint(
				"vehicle_location",
				map[string]string{"vehicle_id": fmt.Sprintf("%d", vehicle.ID)},
				map[string]interface{}{
					"type":              "GPS",
					"latitude":          newLocation.Latitude,
					"longitude":         newLocation.Longitude,
					"distance_traveled": distance,
				},
				currentTime,
			)

			writeAPI.WritePoint(p)
			locationCount++
			pointsInBatch++
		}
		currentTime = currentTime.Add(reportingInterval)

		if pointsInBatch >= batchSize {
			writeAPI.Flush()
			log.Printf("Worker %d: Vehicle %d - Progress: %d locations, %d status changes",
				workerID, vehicle.ID, locationCount, statusCount)
			pointsInBatch = 0
		}
	}
	writeAPI.Flush()
	log.Printf("Worker %d: Vehicle %d completed - Locations: %d, Status changes: %d",
		workerID, vehicle.ID, locationCount, statusCount)
}
