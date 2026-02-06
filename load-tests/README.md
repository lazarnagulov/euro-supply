# Locust Load Testing

This directory contains Locust load test scenarios used for performance testing of the Spring Boot backend application.
The tests simulate realistic usage patterns for customers and managers, covering frequently used and performance-critical endpoints such as vehicle search, distance calculation, company moderation, and reference data retrieval.

The load tests are implemented using [Locust](https://locust.io/).

## Tested Scenarios

The following API scenarios are covered by the load tests:

- Retrieving companies associated with the authenticated customer
- Retrieving countries and cities
- Reviewing pending companies (including email notification)
- Retrieving pending companies
- Vehicle data access
- Vehicle distance aggregation
- Retrieving vehicle brands and models
- Searching vehicles using multiple filter combinations and pagination

## Requirements
- Python 3.9+
- Running Spring Boot backend application
- requirements.txt (contains Locust and dependencies)

## Setup

1. Start the Spring Boot application before running load tests.

Follow the instructions in the backend project `README.md`.
By default, the application is expected to be available at:
```
http://localhost:8080/
```

2. _(Optional)_ Create and activate a virtual environment
```bash
python -m pip install virtualenv
python -m virtualenv venv
.\venv\bin\activate # ./venv/Scripts/activate (Windows)
```

3. Install dependencies

From the root directory containing `requirements.txt`:
```bash
python -m pip install -r requirements.txt
```

4. Run Locust
Run Locust using Python from the virtual environment:
```bash
python -m locust
```
By default, Locust will automatically discover all test files in the directory.
Specificy a test file with:
```bash
python -m locust -f "path_to_test_file"
```
5. Open Locust Web UI

Open a browser and navigate to:
```
http://localhost:8089
```

6. Start load testing

## Authentication

Each Locust user authenticates on startup using predefined credentials:
- Customer role – used for customer-specific endpoints
- Manager role – used for administrative and management endpoints

Authentication tokens are retrieved once per simulated user and reused for subsequent requests.

## Test Data Assumptions

- A predefined number of companies exist in the database.

- A subset of companies is marked as PENDING to allow repeatable review testing.

- Vehicle brands, models, and vehicles are preloaded.

- Randomized IDs are used within valid ranges to simulate realistic access patterns.