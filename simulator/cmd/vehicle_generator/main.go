package main

import (
	"eurosupply/simulator/internal/vehicle/bootstrap"
	influxdb2 "github.com/influxdata/influxdb-client-go/v2"
)

func main() {
	cfg := bootstrap.LoadGeneratorConfig()
	client := influxdb2.NewClient(cfg.Influx.URL, cfg.Influx.Bucket)
	defer client.Close()
}
