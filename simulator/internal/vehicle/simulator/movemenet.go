package simulator

// Reference: http://www.movable-type.co.uk/scripts/latlong.html

import (
	"eurosupply/simulator/internal/vehicle/domain"
	"math"
	"math/rand"
	"time"
)

type MovementSimulator struct {
	minSpeed float64 // km/h
	maxSpeed float64 // km/h
	rng      *rand.Rand
}

func NewMovementSimulator(minSpeed, maxSpeed float64) *MovementSimulator {
	return &MovementSimulator{
		minSpeed: minSpeed,
		maxSpeed: maxSpeed,
		rng:      rand.New(rand.NewSource(time.Now().UnixNano())),
	}
}

func (m *MovementSimulator) SimulateMovement(currentLoc domain.Location, intervalMinutes float64) (domain.Location, float64) {
	speed := m.minSpeed + m.rng.Float64()*(m.maxSpeed-m.minSpeed)

	hours := intervalMinutes / 60.0
	distanceKm := speed * hours

	newLat, newLon := m.calculateNewPosition(currentLoc.Latitude, currentLoc.Longitude, distanceKm)

	newLocation := domain.Location{
		Latitude:  newLat,
		Longitude: newLon,
		UpdatedAt: time.Now(),
	}

	return newLocation, distanceKm
}

func CalculateDistance(lat1, lon1, lat2, lon2 float64) float64 {
	const earthRadius = 6371.0 // km

	lat1Rad := lat1 * math.Pi / 180.0
	lat2Rad := lat2 * math.Pi / 180.0
	deltaLat := (lat2 - lat1) * math.Pi / 180.0
	deltaLon := (lon2 - lon1) * math.Pi / 180.0

	a := math.Sin(deltaLat/2)*math.Sin(deltaLat/2) +
		math.Cos(lat1Rad)*math.Cos(lat2Rad)*
			math.Sin(deltaLon/2)*math.Sin(deltaLon/2)

	c := 2 * math.Atan2(math.Sqrt(a), math.Sqrt(1-a))

	return earthRadius * c
}

func (m *MovementSimulator) calculateNewPosition(lat, lon, distanceKm float64) (float64, float64) {
	bearing := m.rng.Float64() * 2 * math.Pi

	const earthRadius = 6371.0

	latRad := lat * math.Pi / 180.0
	lonRad := lon * math.Pi / 180.0

	newLatRad := math.Asin(
		math.Sin(latRad)*math.Cos(distanceKm/earthRadius) +
			math.Cos(latRad)*math.Sin(distanceKm/earthRadius)*math.Cos(bearing),
	)

	newLonRad := lonRad + math.Atan2(
		math.Sin(bearing)*math.Sin(distanceKm/earthRadius)*math.Cos(latRad),
		math.Cos(distanceKm/earthRadius)-math.Sin(latRad)*math.Sin(newLatRad),
	)

	newLat := newLatRad * 180.0 / math.Pi
	newLon := newLonRad * 180.0 / math.Pi

	newLat = math.Max(-90, math.Min(90, newLat))
	newLon = math.Max(-180, math.Min(180, newLon))

	return newLat, newLon
}
