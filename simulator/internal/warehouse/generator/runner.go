package generator

import (
	"context"
	"log"
	"sync"

	influxdb2 "github.com/influxdata/influxdb-client-go/v2"
)

type Runner struct {
	ctx    context.Context
	cancel context.CancelFunc
	wg     sync.WaitGroup
	err    error
	done   chan struct{}
}

func NewRunner(cfg *Config, client influxdb2.Client) *Runner {
	ctx, cancel := context.WithCancel(context.Background())

	r := &Runner{
		ctx:    ctx,
		cancel: cancel,
		done:   make(chan struct{}),
	}

	warehouses := GenerateWarehouses(cfg)

	log.Printf("Starting historic data generation for %d warehouses, %d sectors each, %d years of history, interval %dmin",
		cfg.Warehouse.NumWarehouses, cfg.Warehouse.NumSectors,
		cfg.Warehouse.YearsOfHistory, cfg.Warehouse.IntervalMinutes)

	expectedRecords := int64(cfg.Warehouse.NumWarehouses) *
		int64(cfg.Warehouse.NumSectors) *
		int64(cfg.Warehouse.YearsOfHistory) *
		36525 / 100 * // days per year * years
		int64(24*60/cfg.Warehouse.IntervalMinutes)
	log.Printf("Estimated records: ~%d", expectedRecords)

	r.wg.Add(1)
	go func() {
		defer r.wg.Done()
		r.err = GenerateHistoricData(ctx, client, cfg, warehouses)
		close(r.done)
	}()

	return r
}

func (r *Runner) Done() <-chan struct{} {
	return r.done
}

func (r *Runner) Stop() {
	r.cancel()
}

func (r *Runner) WaitForShutdown() {
	r.wg.Wait()

	if r.err != nil {
		log.Fatalf("warehouse generator failed: %v", r.err)
	}

	log.Println("Historic warehouse temperature data generation completed successfully")
}
