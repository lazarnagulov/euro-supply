package generator

import (
	"context"
	"log"
	"math/rand"
	"strconv"
	"sync"
	"time"

	influxdb2 "github.com/influxdata/influxdb-client-go/v2"
	"github.com/influxdata/influxdb-client-go/v2/api"
	"github.com/influxdata/influxdb-client-go/v2/api/write"
)

type FactoryGenerator struct {
	writeAPI        api.WriteAPI
	productionTimes []productionTime
	batchSize       int
	minQty          int
	maxQty          int
	rng             *rand.Rand
	workerID        int
}

type productionTime struct {
	hour   int
	minute int
}

func (g *FactoryGenerator) Generate(ctx context.Context, factory Factory, startTime, endTime time.Time) {
	current := truncateToDay(startTime)
	var (
		totalRecords  int
		pointsInBatch int
	)

	for !current.After(endTime) {
		if ctx.Err() != nil {
			return
		}

		for _, pt := range g.productionTimes {
			reportTime := time.Date(
				current.Year(), current.Month(), current.Day(),
				pt.hour, pt.minute, 0, 0, current.Location(),
			)

			if reportTime.Before(startTime) || reportTime.After(endTime) {
				continue
			}

			for _, product := range factory.Products {
				qty := simulateQuantity(g.rng, product, reportTime)

				p := newProductionPoint(factory.ID, product.ProductID, qty, reportTime)
				g.writeAPI.WritePoint(p)
				totalRecords++
				pointsInBatch++
			}

			if pointsInBatch >= g.batchSize {
				g.writeAPI.Flush()
				log.Printf("Worker %d: Factory %d - Progress: %d records written",
					g.workerID, factory.ID, totalRecords)
				pointsInBatch = 0
			}
		}

		current = current.AddDate(0, 0, 1)
	}

	g.writeAPI.Flush()
	log.Printf("Worker %d: Factory %d completed - Total records: %d",
		g.workerID, factory.ID, totalRecords)
}

func simulateQuantity(rng *rand.Rand, product Product, t time.Time) int {
	base := product.MinQty + rng.Intn(product.MaxQty-product.MinQty+1)

	if t.Hour() == 0 {
		return int(float64(base) * 0.6)
	}

	weekday := t.Weekday()
	if weekday == time.Saturday || weekday == time.Sunday {
		return int(float64(base) * 0.4)
	}

	return base
}

func GenerateFactories(cfg *Config) []Factory {
	factories := make([]Factory, cfg.Factory.NumFactories)

	for i := 0; i < cfg.Factory.NumFactories; i++ {
		factoryID := int64(i + 1)
		products := make([]Product, cfg.Factory.NumProducts)

		for j := 0; j < cfg.Factory.NumProducts; j++ {
			products[j] = Product{
				ProductID: factoryID*100 + int64(j+1),
				MinQty:    cfg.Factory.MinQuantity,
				MaxQty:    cfg.Factory.MaxQuantity,
			}
		}

		factories[i] = Factory{
			ID:       factoryID,
			Products: products,
		}
	}

	return factories
}

func GenerateHistoricData(ctx context.Context, client influxdb2.Client, cfg *Config, factories []Factory) error {
	endTime := time.Now()
	startTime := endTime.AddDate(-cfg.Factory.YearsOfHistory, 0, 0)

	var wg sync.WaitGroup
	factoryChan := make(chan Factory, len(factories))

	for i := 0; i < cfg.Factory.Workers; i++ {
		wg.Add(1)
		rng := rand.New(rand.NewSource(time.Now().UnixNano() + int64(i)))
		go worker(ctx, i, client, cfg, factoryChan, &wg, startTime, endTime, rng)
	}

	for _, factory := range factories {
		select {
		case <-ctx.Done():
			close(factoryChan)
			wg.Wait()
			return ctx.Err()
		case factoryChan <- factory:
		}
	}

	close(factoryChan)
	wg.Wait()
	return nil
}

func worker(
	ctx context.Context,
	workerID int,
	client influxdb2.Client,
	cfg *Config,
	factoryChan <-chan Factory,
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

	productionTimes := parseProductionTimes(cfg.Factory.ProductionTimes)

	generator := &FactoryGenerator{
		writeAPI:        writeApi,
		productionTimes: productionTimes,
		batchSize:       cfg.Factory.BatchSize,
		minQty:          cfg.Factory.MinQuantity,
		maxQty:          cfg.Factory.MaxQuantity,
		rng:             rng,
		workerID:        workerID,
	}

	for factory := range factoryChan {
		if ctx.Err() != nil {
			return
		}
		generator.Generate(ctx, factory, startTime, endTime)
	}
}

func parseProductionTimes(times []string) []productionTime {
	result := make([]productionTime, 0, len(times))
	for _, t := range times {
		parsed, err := time.Parse("15:04", t)
		if err != nil {
			log.Printf("Warning: invalid production time '%s', skipping: %v", t, err)
			continue
		}
		result = append(result, productionTime{
			hour:   parsed.Hour(),
			minute: parsed.Minute(),
		})
	}
	return result
}

func newProductionPoint(factoryID, productID int64, quantity int, t time.Time) *write.Point {
	return influxdb2.NewPoint(
		"factory_production",
		map[string]string{
			"factory_id": strconv.FormatInt(factoryID, 10),
			"product_id": strconv.FormatInt(productID, 10),
		},
		map[string]interface{}{
			"quantity": quantity,
		},
		t,
	)
}

func truncateToDay(t time.Time) time.Time {
	return time.Date(t.Year(), t.Month(), t.Day(), 0, 0, 0, 0, t.Location())
}
