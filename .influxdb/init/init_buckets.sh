#!/bin/bash
set -e

until curl -s http://localhost:8086/health | grep "ok" >/dev/null; do
    echo "Waiting for InfluxDB..."
    sleep 2
done

INFLUX_HOST=http://localhost:8086
INFLUX_TOKEN="${DOCKER_INFLUXDB_INIT_PASSWORD}"
ORG="${DOCKER_INFLUXDB_INIT_ORG}"

BUCKETS=("vehicle" "factory" "warehouse")

for BUCKET in "${BUCKETS[@]}"; do
    echo "Creating bucket: $BUCKET"
    curl -X POST "$INFLUX_HOST/api/v2/buckets" \
        -H "Authorization: Token $INFLUX_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{
            \"name\": \"$BUCKET\",
            \"org\": \"$ORG\",
            \"retentionRules\": []
        }" || true
done

echo "All buckets created."