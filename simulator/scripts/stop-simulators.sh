#!/bin/bash


RED='\033[0;31m'
NC='\033[0m'

echo -e "${RED}Stopping all vehicle simulators...${NC}"

if [ -f ".simulator_pids" ]; then
    while read pid; do
        if ps -p $pid > /dev/null 2>&1; then
            echo "Stopping simulator with PID: $pid"
            kill -SIGTERM $pid
        fi
    done < .simulator_pids
    rm .simulator_pids
else
    pkill -SIGTERM -f "vehicle-simulator"
fi

echo "All simulators stopped!"