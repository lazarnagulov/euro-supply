# Simulators

This directory contains Go-based simulators used in the EuroSupply system to generate realistic domain events and telemetry data.

The simulators are designed to emulate real-world behavior of vehicles, factories and warehouses in a supply-chain environment. They publish data to the backend ecosystem using messaging and time-series infrastructure, enabling testing, monitoring, and performance evaluation under realistic conditions.

The simulator suite consists of:

- Programs that run live simulators (vehicle, factory and warehouse)
- A program that generates initial and reference data used by the simulators

All simulator behavior is driven by external configuration files, allowing scenarios to be adjusted without code changes.

## Simulator programs

### Vehicle Simulator
Simulates vehicle movement and operational telemetry

- Periodically publishes location updates, status, and metrics
- Designed to mimic real vehicle behavior over time

### Factory Simulator
Simulates factory production activity

- Periodically reports the number of products produced
- Used to test ingestion, aggregation, and monitoring of production output

### Warehouse Simulator

Simulates warehouse environmental conditions

- Periodically reports temperature values per warehouse sector
- Used to test time-series ingestion, monitoring, and alerting scenarios

## Generator programs

### Vehicle Generator
Simulates warehouse environmental conditions

- Periodically reports temperature values per warehouse sector
- Used to test time-series ingestion, monitoring, and alerting scenarios

### Factory Generator

- Generates initial factory data
- Populates the influxdb with realistic factory entities
- Intended to be run once


### Warehouse Generator

- Generates initial warehouse data
- Populates the influxdb with realistic warehouse entities
- Intended to be run once

## Configuration Methods

Simulators and generators support two configuration mechanisms:

- Configuration files (recommended for most scenarios)
- Command-line arguments (useful for overrides and ad-hoc runs)

Both approaches can be used together, with command-line flags taking precedence over values defined in configuration files.

### Configuration Files
All simulators and generators are configured via external configuration files. The configuration examples are located in:
```
configs/
```

### Command-Line Arguments

In addition to configuration files, simulators support command-line flags for fine-grained control at runtime.

Typical use cases include:

- Running multiple simulator instances with different identities
- Overriding timing parameters during testing

```bash
./vehicle_simulator \
  --config ./configs/vehicle/vehicle_simulator.yaml \
  --vehicle.id=42 \
  --simulator.reporting_interval=2s \
```
## Technology Stack

The simulators are implemented using:

- Go 1.22+ – Programming language
- RabbitMQ – Event and message publishing
- InfluxDB – Time-series telemetry storage
- AMQP clients – Backend communication

## Requirements

Before running the simulators, ensure the following are available:

- Go 1.22+
- Running backend application
- RabbitMQ instance
- InfluxDB instance

## Setup
1. Prepare Configuration
Ensure all service URLs, credentials, and routing keys match the target environment.

2. Build Simulators and Generators

```bash
go build -o vehicle_simulator ./cmd/vehicle_simulator/main.go
go build -o factory_simulator ./cmd/factory_simulator/main.go
go build -o warehouse_simulator ./cmd/warehouse_simulator/main.go

go build -o vehicle_generator ./cmd/vehicle_generator/main.go
go build -o factory_generator ./cmd/factory_generator/main.go
go build -o warehouse_generator ./cmd/warehouse_generator/main.go
```

3. Run Generators

Run generators to create initial data:

```bash
./vehicle_generator -config configs/vehicle/generator.yaml
./factory_generator --config configs/factory/generator.yaml
./warehouse_generator --config configs/warehouse/generator.yaml
```

4. Run Simulators

Run a simulator with its configuration file:

```bash
./vehicle_simulator --config configs/vehicle/vehicle_simulator.yaml
./factory_simulator --config configs/factory/factory_simulator.yaml
./warehouse_simulator --config configs/warehouse/warehouse_simulator.yaml
```

## Usage Notes

- Generators should be executed before running simulators.
- Simulators are intended to run continuously.
- Multiple instances can be started to increase event volume.
- Separate config files can be used to model different scenarios.

## Notes

- Simulators are intended for development, testing, and demonstration.
- They are not designed for production environments.
- Ensure infrastructure services are running before starting simulations.