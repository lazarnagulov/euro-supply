package simulator

import (
	"context"
	"eurosupply/simulator/internal/vehicle/config"
	"eurosupply/simulator/internal/vehicle/domain"
	"eurosupply/simulator/shared/messaging"
	"fmt"
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
	publisher        messaging.Publisher
	shutdownComplete chan struct{}
}

func New(vehicle domain.Vehicle, publisher messaging.Publisher, cfg config.SimulatorConfig) *Simulator {
	ctx, cancel := context.WithCancel(context.Background())

	return &Simulator{
		vehicle:          vehicle,
		config:           cfg,
		publisher:        publisher,
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
			if err := s.sendHeartbeat(); err != nil {
				fmt.Println("failed to send heartbeat")
			}
		}
	}
}

func (s *Simulator) sendHeartbeat() error {
	msg := domain.NewHeartbeatMessage(s.vehicle.ID)

	ctx, cancel := context.WithTimeout(s.ctx, 5*time.Second)
	defer cancel()

	if err := s.publisher.PublishHeartbeat(ctx, msg); err != nil {
		return fmt.Errorf("failed to publish heartbeat: %w", err)
	}

	return nil
}

func (s *Simulator) sendLocation() error {
	intervalMinutes := s.config.ReportingInterval.Minutes()
	newLocation, distance := s.movement.SimulateMovement(s.vehicle.Location, intervalMinutes)
	msg := domain.NewLocationMessage(s.vehicle.ID, newLocation, distance)

	ctx, cancel := context.WithTimeout(s.ctx, 5*time.Second)
	defer cancel()

	if err := s.publisher.PublishLocation(ctx, msg); err != nil {
		return fmt.Errorf("failed to publish heartbeat: %w", err)
	}

	return nil
}

func (s *Simulator) locationLoop() {
	defer s.wg.Done()
	for {
		select {
		case <-s.ctx.Done():
			return

		case <-s.locationTicker.C:
			if err := s.sendLocation(); err != nil {
				fmt.Println("failed to send location")
			}
		}
	}
}
