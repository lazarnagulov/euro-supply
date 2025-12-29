package simulator

import (
	"context"
	"eurosupply/simulator/internal/factory/config"
	"eurosupply/simulator/internal/factory/domain"
	"eurosupply/simulator/shared/messaging"
	"fmt"
	"math/rand"
	"sync"
	"time"
)

type Simulator struct {
	factory          domain.Factory
	config           config.SimulatorConfig
	heartbeatTicker  *time.Ticker
	productionTimes  []time.Time
	productionTicker *time.Ticker
	ctx              context.Context
	cancel           context.CancelFunc
	wg               sync.WaitGroup
	publisher        messaging.Publisher
	shutdownComplete chan struct{}
}

func New(factory domain.Factory, publisher messaging.Publisher, cfg config.SimulatorConfig) *Simulator {
	ctx, cancel := context.WithCancel(context.Background())

	var times []time.Time
	for _, t := range cfg.ProductionTimes {
		parsed, _ := time.Parse("15:04", t)
		times = append(times, parsed)
	}

	return &Simulator{
		factory:          factory,
		config:           cfg,
		publisher:        publisher,
		productionTimes:  times,
		ctx:              ctx,
		cancel:           cancel,
		shutdownComplete: make(chan struct{}),
	}
}

func (s *Simulator) Start() error {
	s.heartbeatTicker = time.NewTicker(s.config.HeartbeatInterval)
	s.wg.Add(1)
	go s.heartbeatLoop()

	s.productionTicker = time.NewTicker(time.Minute)
	s.wg.Add(1)
	go s.productionLoop()

	return nil
}

func (s *Simulator) Stop() {
	if s.heartbeatTicker != nil {
		s.heartbeatTicker.Stop()
	}
	if s.productionTicker != nil {
		s.productionTicker.Stop()
	}

	s.cancel()
	s.wg.Wait()
	close(s.shutdownComplete)
}

func (s *Simulator) WaitForShutdown() {
	<-s.shutdownComplete
}

func (s *Simulator) heartbeatLoop() {
	defer s.wg.Done()
	for {
		select {
		case <-s.ctx.Done():
			return
		case <-s.heartbeatTicker.C:
			if err := s.sendHeartbeat(); err != nil {
				fmt.Println("failed to send heartbeat:", err)
			}
		}
	}
}

func (s *Simulator) sendHeartbeat() error {
	msg := domain.FactoryHeartbeatMessage{
		FactoryID: s.factory.ID,
		Timestamp: time.Now(),
		Status:    "online",
	}

	ctx, cancel := context.WithTimeout(s.ctx, 5*time.Second)
	defer cancel()

	routingKey := fmt.Sprintf("factory.%d.heartbeat", s.factory.ID)

	if err := s.publisher.Publish(ctx, "factory.heartbeat", routingKey, msg); err != nil {
		return fmt.Errorf("failed to publish heartbeat: %w", err)
	}
	return nil
}

func (s *Simulator) productionLoop() {
	defer s.wg.Done()
	for {
		select {
		case <-s.ctx.Done():
			return
		case <-s.productionTicker.C:
			now := time.Now()
			for _, t := range s.productionTimes {
				if now.Hour() == t.Hour() && now.Minute() == t.Minute() {
					if err := s.sendProductionReport(); err != nil {
						fmt.Println("failed to send production report:", err)
					}
				}
			}
		}
	}
}

func (s *Simulator) sendProductionReport() error {
	var items []domain.ProductionItem
	for _, p := range s.factory.Products {
		quantity := randomInt(p.MinQty, p.MaxQty)
		items = append(items, domain.ProductionItem{
			ProductID: p.ProductID,
			Quantity:  quantity,
		})
	}

	msg := domain.ProductionReportMessage{
		FactoryID:  s.factory.ID,
		ProducedAt: time.Now(),
		Items:      items,
	}

	ctx, cancel := context.WithTimeout(s.ctx, 5*time.Second)
	defer cancel()

	routingKey := fmt.Sprintf("factory.%d.production", s.factory.ID)

	if err := s.publisher.Publish(ctx, "factory.production", routingKey, msg); err != nil {
		return fmt.Errorf("failed to publish production: %w", err)
	}

	fmt.Printf("Factory %d produced: %+v\n", s.factory.ID, items)
	return nil
}

func randomInt(min, max int) int {
	if max <= min {
		return min
	}
	rand.Seed(time.Now().UnixNano())
	mid := (min + max) / 2
	variation := (max - min) / 5 // 20%
	return mid + rand.Intn(variation*2+1) - variation
}
