package simulator

import (
	"context"
	"eurosupply/simulator/internal/warehouse/config"
	"eurosupply/simulator/internal/warehouse/domain"
	"eurosupply/simulator/shared/messaging"
	"fmt"
	"sync"
	"time"
)

type Simulator struct {
	warehouse       *domain.Warehouse
	config          config.SimulatorConfig
	temperatureSim  *TemperatureSimulator
	reportTicker    *time.Ticker
	heartbeatTicker  *time.Ticker
	ctx             context.Context
	cancel          context.CancelFunc
	wg              sync.WaitGroup
	publisher       messaging.Publisher
	shutdownComplete chan struct{}
}

func New(warehouse *domain.Warehouse, publisher messaging.Publisher, cfg config.SimulatorConfig) *Simulator {
	ctx, cancel := context.WithCancel(context.Background())
	return &Simulator{
		warehouse:       warehouse,
		config:          cfg,
		publisher:       publisher,
		temperatureSim:  NewTemperatureSimulator(),
		ctx:             ctx,
		cancel:          cancel,
		shutdownComplete: make(chan struct{}),
	}
}

func (s *Simulator) Start() error {
    s.reportTicker = time.NewTicker(s.config.ReportingInterval)
    s.heartbeatTicker = time.NewTicker(s.config.HeartbeatInterval) 
    
    s.wg.Add(2)  
    go s.reportingLoop()
    go s.heartbeatLoop()
    return nil
}

func (s *Simulator) Stop() {
    if s.reportTicker != nil {
        s.reportTicker.Stop()
    }
    if s.heartbeatTicker != nil {  
        s.heartbeatTicker.Stop()
    }
    s.cancel()
    s.wg.Wait()
    close(s.shutdownComplete)
}

func (s *Simulator) WaitForShutdown() {
	<-s.shutdownComplete
}

func (s *Simulator) reportingLoop() {
	defer s.wg.Done()
	for {
		select {
		case <-s.ctx.Done():
			return
		case <-s.reportTicker.C:
			if err := s.sendTemperatures(); err != nil {
				fmt.Println("failed to send temperatures:", err)
			}
		}
	}
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
	msg := domain.NewHeartbeatMessage(s.warehouse.ID)

	ctx, cancel := context.WithTimeout(s.ctx, 5*time.Second)
	defer cancel()

	routingKey := fmt.Sprintf("warehouse.%d.heartbeat", s.warehouse.ID)

	if err := s.publisher.Publish(ctx, "warehouse.heartbeat", routingKey, msg); err != nil {
		return fmt.Errorf("failed to publish heartbeat: %w", err)
	}

	return nil
}

func (s *Simulator) sendTemperatures() error {
	temps := s.temperatureSim.SimulateAllTemperature(s.warehouse.Sectors)

	msg := domain.NewWarehouseTemperatureMessage(s.warehouse, temps)

	ctx, cancel := context.WithTimeout(s.ctx, 5*time.Second)
	defer cancel()

	routingKey := fmt.Sprintf("warehouse.%d.temperatures", s.warehouse.ID)

	if err := s.publisher.Publish(ctx, "warehouse.temperature", routingKey, msg); err != nil {
		fmt.Printf("failed to publish temperatures for warehouse %d: %v\n", s.warehouse.ID, err)
		return err
	}

	return nil
}