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

	factories := GenerateFactories(cfg)

	log.Printf("Starting historic data generation for %d factories, %d products each, %d years of history",
		cfg.Factory.NumFactories, cfg.Factory.NumProducts, cfg.Factory.YearsOfHistory)

	r.wg.Add(1)
	go func() {
		defer r.wg.Done()
		r.err = GenerateHistoricData(ctx, client, cfg, factories)
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
		log.Fatalf("factory generator failed: %v", r.err)
	}

	log.Println("Historic factory data generation completed successfully")
}
