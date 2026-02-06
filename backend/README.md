# Backend Application

This directory contains the Spring Boot backend application for the EuroSupply system.

The backend exposes a secure, role-aware REST API used by the frontend, simulators, and load-testing tools. It is responsible for business logic, authentication and authorization, persistence, integrations, and system coordination across supply-chain–related domains such as companies, vehicles, and reference data.

The application is built with Spring Boot 3, Java 17+, and PostgreSQL, following clean architecture principles and emphasizing scalability, security, and maintainability.

## Features

The backend provides the following core capabilities:

- JWT-based authentication and role-based authorization
- User and role management (Administrator, Manager, Customer)
- Company registration, moderation, and lifecycle management
- Vehicle management, search, filtering, and distance aggregation
- Pagination, sorting, and filtering for large datasets
- Redis-backed caching
- Integration with RabbitMQ for asynchronous processing
- Centralized validation and error handling
- OpenAPI / Swagger documentation for all REST endpoints
...

## Technology Stack

The backend is implemented using the following technologies:

- Java 17+ – Language runtime
- Spring Boot 3.3.x – Application framework
- Spring Security – Authentication and authorization
- Spring Data JPA (Hibernate) – Persistence layer
- PostgreSQL – Primary relational database
- Redis – Caching and token/session support
- RabbitMQ – Asynchronous messaging
- Maven – Dependency management and build tool

## Requirements

Before running the backend application, ensure the following are installed and available:

- Java 17 or newer
- Maven 3.9+
- PostgreSQL
- Redis
- RabbitMQ
- _Optional_ Docker & Docker Compose for infrastructure services

## Configuration

The application is configured using Spring profiles and environment variables.

### Key configuration files:

- application-dev.yml – Local development profile
- application-prod.yml – Production profile


## Setup
1. Start Infrastructure Services
Ensure the following services are running before starting the backend:
- PostgreSQL
- Redis
- RabbitMQ

2. Build the Application

From the backend directory:
```bash
mvn clean package
```

3. Run the Application

Run using Maven:
```bash
mvn spring-boot:run
```
By default, the backend will be available at:
```bash
http://localhost:8080
```

## API Documentation

Once the application is running (in dev mode), OpenAPI documentation is available at:
```bash
http://localhost:8080/swagger-ui.html
```
This documentation describes all available endpoints, request/response models, and security requirements.

## Notes

- This backend is designed to be used together with the EuroSupply frontend.
- Simulators and load tests rely on these APIs being available and properly seeded.
- Default credentials are intended for development and testing only.
- For production deployments, ensure secrets, passwords, and tokens are managed securely.
