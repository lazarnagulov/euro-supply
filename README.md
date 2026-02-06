[![Contributors][contributors-shield]][contributors-url]
[![Last Commit][last-commit-shield]][last-commit-url]

<div align="center">

  <h1 align="center">EUROSUPPLY</h1>

  <p align="center">
    <br />
    <a href="https://gitlab.com/lazarnagulov/euro-supply/issues/new?labels=bug">Report Bug</a>
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#built-with">Built With</a>
      <ul>
        <li><a href="#backend">Backend</a></li>
        <li><a href="#frontend">Frontend</a></li>
        <li><a href="#infrastructure">Infrastructure</a></li>
        <li><a href="#simulators">Simulators</a></li>
        <li><a href="#load-testing">Load Testing</a></li>
      </ul>
    </li>
    <li>
      <a href="#repository-structure">Repository Structure</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
    </li>
    <li>
      <a href="#available-roles-and-credentials">Available Roles and Credentials</a>
    </li>
  </ol>
</details>


## About The Project

**Euro Supply** is a full-stack web application designed to manage supply-chain–related processes, users, and resources in a secure and scalable way. The system is built with a modern backend architecture and a lightweight, responsive frontend, making it suitable both for development and production environments.

## Built With

This project is built using the following core technologies:

### Backend

[![Java][Java-img]][Java-url]

[![Spring Boot][SpringBoot-img]][SpringBoot-url]

[![PostgreSQL][PostgreSQL-img]][PostgreSQL-url]

[![Redis][Redis-img]][Redis-url]

### Frontend

[![React][React-img]][React-url]

[![Tailwind][Tailwind-img]][Tailwind-url]

[![TypeScript][TypeScript-img]][TypeScript-url]


### Infrastructure

[![Nginx][Nginx-img]][Nginx-url]


### Simulators

[![Go][Go-img]][Go-url]

[![InfluxDB][InfluxDB-img]][InfluxDB-url]

[![RabbitMQ][RabbitMQ-img]][RabbitMQ-url]

### Load Testing

[![Locust][Locust-img]][Locust-url]

## Repository Structure

This repository is organized as a **multi-module system**, where each major component has its own dedicated README with detailed setup and usage instructions:

- **Backend** – Spring Boot application (API, security, persistence)
  - See: `backend/README.md`

- **Frontend** – React + Tailwind CSS web client
  - See: `frontend/README.md`

- **Simulators** – Go-based simulators producing telemetry
  - See: `simulators/README.md`

- **Load Tests** – Locust load tests
  - See: `load-tests/README.md`

- **Docs** – Project documentation (Swagger/OpenAPI specs, Locust test reports)

## Getting Started

To run the full system locally, follow these high-level steps:

1. Start required infrastructure services  
   (PostgreSQL, Redis, RabbitMQ, InfluxDB, Nginx)

2. Start the backend service

3. Start the frontend application

4. _(Optional)_ Run simulators and load tests

Detailed instructions for each step are available in the corresponding subproject README files.

## Available Roles and Credentials

The system supports the following predefined roles for development and testing purposes:

- **Administrator**
  - Email: `admin@gmail.com`
  - Password: _generated on first application startup and stored in the backend project root (first-password.txt)_

- **Manager**
  - Email: `manager@gmail.com`
  - Password: `pera`

- **Customer**
  - Email: `customer@gmail.com`
  - Password: `pera`

> These credentials are intended **for local development only**.

[Locust-img]: https://img.shields.io/badge/Locust-Load%20Testing-00c853?logo=locust&logoColor=white
[Locust-url]: https://locust.io/

[Java-img]: https://img.shields.io/badge/Java-17+-red?logo=java&logoColor=white
[Java-url]: https://www.oracle.com/java/

[SpringBoot-img]: https://img.shields.io/badge/Spring%20Boot-3.3.5-success?logo=springboot
[SpringBoot-url]: https://spring.io/projects/spring-boot

[PostgreSQL-img]: https://img.shields.io/badge/Database-PostgreSQL-336791?logo=postgresql&logoColor=white
[PostgreSQL-url]: https://www.postgresql.org/

[React-img]: https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=black
[React-url]: https://react.dev/

[Nginx-img]: https://img.shields.io/badge/Nginx-Reverse%20Proxy-009639?logo=nginx&logoColor=white
[Nginx-url]: https://nginx.org/

[Go-img]: https://img.shields.io/badge/Go-1.22-00ADD8?logo=go&logoColor=white
[Go-url]: https://go.dev/

[Redis-img]: https://img.shields.io/badge/Redis-Cache%20%26%20Sessions-dc382d?logo=redis&logoColor=white
[Redis-url]: https://redis.io/

[InfluxDB-img]: https://img.shields.io/badge/InfluxDB-Time%20Series-22ADF6?logo=influxdb&logoColor=white
[InfluxDB-url]: https://www.influxdata.com/

[RabbitMQ-img]: https://img.shields.io/badge/RabbitMQ-AMQP%20Broker-ff6600?logo=rabbitmq&logoColor=white
[RabbitMQ-url]: https://www.rabbitmq.com/

[TypeScript-img]: https://img.shields.io/badge/TypeScript-5.5-blue?logo=typescript
[TypeScript-url]: https://www.typescriptlang.org/

[Tailwind-img]: https://img.shields.io/badge/Tailwind%20CSS-3-38bdf8?logo=tailwindcss&logoColor=white
[Tailwind-url]: https://tailwindcss.com/

[contributors-shield]: https://img.shields.io/gitlab/contributors/lazarnagulov/euro-supply?style=for-the-badge
[contributors-url]: https://gitlab.com/lazarnagulov/euro-supply/-/project_members

[last-commit-shield]: https://img.shields.io/gitlab/last-commit/lazarnagulov/euro-supply?style=for-the-badge
[last-commit-url]: https://gitlab.com/lazarnagulov/euro-supply/-/commits/main