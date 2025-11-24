package domain

import (
	"eurosupply/delivery-vehicle-simulator/internal/config"
	"time"
)

type Vehicle struct {
	ID                 string
	RegistrationNumber string
	Brand              string
	Model              string
	MaxWeightKg        float64
	Location           Location
}

type Location struct {
	Latitude  float64
	Longitude float64
	UpdatedAt time.Time
}

type HeartbeatMessage struct {
	VehicleID string    `json:"vehicle_id"`
	Timestamp time.Time `json:"timestamp"`
	Status    string    `json:"status"`
	Type      string    `json:"type"`
}

type LocationMessage struct {
	VehicleID        string    `json:"vehicle_id"`
	Latitude         float64   `json:"latitude"`
	Longitude        float64   `json:"longitude"`
	DistanceTraveled float64   `json:"distance_traveled"`
	Timestamp        time.Time `json:"timestamp"`
	Type             string    `json:"type"`
}

func NewHeartbeatMessage(vehicleID string) HeartbeatMessage {
	return HeartbeatMessage{
		VehicleID: vehicleID,
		Timestamp: time.Now(),
		Status:    "online",
		Type:      "heartbeat",
	}
}

func NewLocationMessage(vehicleID string, location Location, distance float64) LocationMessage {
	return LocationMessage{
		VehicleID:        vehicleID,
		Timestamp:        time.Now(),
		Type:             "location",
		Latitude:         location.Latitude,
		Longitude:        location.Longitude,
		DistanceTraveled: distance,
	}
}

func NewVehicle(cfg *config.Config) *Vehicle {
	return &Vehicle{
		ID:                 cfg.Vehicle.ID,
		RegistrationNumber: cfg.Vehicle.RegistrationNumber,
		Brand:              cfg.Vehicle.Brand,
		Model:              cfg.Vehicle.Model,
		MaxWeightKg:        cfg.Vehicle.MaxLoadKg,
		Location: Location{
			Latitude:  cfg.Vehicle.InitialLat,
			Longitude: cfg.Vehicle.InitialLon,
			UpdatedAt: time.Now(),
		},
	}
}
