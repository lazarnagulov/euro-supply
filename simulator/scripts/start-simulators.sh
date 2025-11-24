#!/bin/bash

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

CONFIG_DIR="./configs"
LOG_DIR="./logs"

mkdir -p "$LOG_DIR"

if [ ! -f "./vehicle-simulator" ]; then
    echo "Building simulator..."
    go build -o vehicle-simulator ./cmd/vehicle-simulator/main.go
fi

start_vehicle() {
    local config_file="$1"
    local vehicle_name="$2"

    echo -e "${GREEN}Starting ${vehicle_name}...${NC}"
    ./vehicle-simulator --config "$config_file" > "$LOG_DIR/${vehicle_name}.log" 2>&1 &
    echo "${vehicle_name} started with PID: $!"
    sleep 2
}

echo -e "${BLUE}Starting Delivery Vehicle Simulators...${NC}"

start_vehicle "$CONFIG_DIR/vehicle1.yaml" "Vehicle1_Mercedes"
start_vehicle "$CONFIG_DIR/vehicle2.yaml" "Vehicle2_Volvo"
start_vehicle "$CONFIG_DIR/vehicle3.yaml" "Vehicle3_Scania"
start_vehicle "$CONFIG_DIR/vehicle4.yaml" "Vehicle4_MAN"

echo -e "${BLUE}All simulators started!${NC}"
echo "Check logs in the '$LOG_DIR' directory"
echo "To stop all simulators, run: ./stop-simulators.sh"

pgrep -f "vehicle-simulator" > .simulator_pids