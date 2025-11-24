package simulator

import (
	"context"
	"eurosupply/delivery-vehicle-simulator/internal/config"
	"eurosupply/delivery-vehicle-simulator/internal/domain"
	"log"
	"sync"
	"time"
)

type Simulator struct {
	vehicle          domain.Vehicle
	config           config.SimulatorConfig
	movement         *MovementSimulator
	heartbeatTicker  *time.Ticker
	locationTicker   *time.Ticker
	ctx              context.Context
	cancel           context.CancelFunc
	wg               sync.WaitGroup
	shutdownComplete chan struct{}
}

func New(vehicle domain.Vehicle, cfg config.SimulatorConfig) *Simulator {
	ctx, cancel := context.WithCancel(context.Background())

	return &Simulator{
		vehicle:          vehicle,
		config:           cfg,
		movement:         NewMovementSimulator(cfg.MinSpeed, cfg.MaxSpeed),
		ctx:              ctx,
		cancel:           cancel,
		shutdownComplete: make(chan struct{}),
	}
}

func (s *Simulator) Start() error {
	s.heartbeatTicker = time.NewTicker(s.config.HeartbeatInterval)
	s.wg.Add(1)
	go s.heartbeatLoop()

	s.locationTicker = time.NewTicker(s.config.ReportingInterval)
	s.wg.Add(1)
	go s.locationLoop()

	return nil
}

func (s *Simulator) Stop() {
	if s.heartbeatTicker != nil {
		s.heartbeatTicker.Stop()
	}
	if s.locationTicker != nil {
		s.locationTicker.Stop()
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
			log.Print("Sending heartbeat")
		}
	}
}

func (s *Simulator) locationLoop() {
	defer s.wg.Done()
	for {
		select {
		case <-s.ctx.Done():
			return

		case <-s.locationTicker.C:
			intervalMinutes := s.config.ReportingInterval.Minutes()
			newLocation, distance := s.movement.SimulateMovement(s.vehicle.Location, intervalMinutes)
			log.Printf("Sending location:  %v dist: %fd", newLocation, distance)
		}
	}
}
