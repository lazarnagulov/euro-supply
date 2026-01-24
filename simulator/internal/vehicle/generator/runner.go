package generator

import (
	"context"
	influxdb2 "github.com/influxdata/influxdb-client-go/v2"
	"log"
	"sync"
)

type Runner struct {
	ctx    context.Context
	cancel context.CancelFunc
	wg     sync.WaitGroup
	err    error
}

func NewRunner(
	cfg *Config,
	client influxdb2.Client,
) *Runner {
	ctx, cancel := context.WithCancel(context.Background())

	r := &Runner{
		ctx:    ctx,
		cancel: cancel,
	}

	vehicles := GenerateVehicles(cfg.Vehicle.NumVehicles)

	r.wg.Add(1)
	go func() {
		defer r.wg.Done()
		r.err = GenerateHistoricData(ctx, client, cfg, vehicles)
	}()

	return r
}

func (r *Runner) Stop() {
	r.cancel()
}

func (r *Runner) WaitForShutdown() {
	r.wg.Wait()

	if r.err != nil {
		log.Fatalf("generator failed: %v", r.err)
	}

	log.Println("Historic data generation completed successfully")
}
