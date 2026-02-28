package simulator


import (
	"eurosupply/simulator/internal/warehouse/domain"
	"math"
	"math/rand"
	"time"
)

type TemperatureSimulator struct {
	rng *rand.Rand
}

func NewTemperatureSimulator() *TemperatureSimulator {
	return &TemperatureSimulator{
		rng: rand.New(rand.NewSource(time.Now().UnixNano())),
	}
}

func (t *TemperatureSimulator) SimulateTemperature(sector domain.Sector) float64 {
	min := sector.MinTemperature
	max := sector.MaxTemperature

	temp := min + t.rng.Float64()*(max-min)
	return  math.Round(temp*100) / 100
}

func (t *TemperatureSimulator) SimulateAllTemperature(sectors []domain.Sector) map[int64]float64 {
	result := make(map[int64]float64, len(sectors))
	for _, s := range sectors {
		result[s.ID] = t.SimulateTemperature(s)
	}
	return result
}