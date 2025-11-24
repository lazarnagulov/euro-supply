package domain

import "time"

type Vehicle struct {
	ID                 string
	RegistrationNumber string
	Brand              string
	Model              string
	WeightLimit        float64
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

func NewLocationMessage(vehicleID string, lat, lon, distance float64) LocationMessage {
	return LocationMessage{
		VehicleID:        vehicleID,
		Latitude:         lat,
		Longitude:        lon,
		DistanceTraveled: distance,
		Timestamp:        time.Now(),
		Type:             "location",
	}
}
