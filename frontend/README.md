# Frontend Application

This directory contains the **React frontend application** for the EuroSupply system.
The frontend provides a responsive and user-friendly interface for interacting with the backend API, enabling users to manage companies, vehicles, and supply-chain–related data based on their assigned roles.

The application is built using **React**, **TypeScript**, and **Tailwind CSS**, with a focus on modularity, maintainability, and clear separation of concerns.

## Features

The frontend supports the following core features:

- User authentication and role-based access
- Company management and moderation workflows
- Vehicle browsing, searching, and filtering
- Reference data visualization (countries, cities, brands, models)
- Responsive UI suitable for desktop and smaller screens
- Integration with secured backend REST APIs
...

UI behavior and available actions dynamically adapt based on the authenticated user role (Administrator, Manager, Customer).

## Technology Stack

- **React** – Component-based UI framework
- **TypeScript** – Static typing and improved developer experience
- **Tailwind CSS** – Utility-first styling
- **Vite** – Fast development server and build tool
- **Axios** – Backend communication (depending on implementation)

## Requirements

Before running the frontend application, ensure the following are installed:

- Node.js 18+
- npm (comes with Node.js)
- Running backend application (see backend `README.md`)

## Setup

1. Navigate to the frontend directory

```bash
cd frontend
```
2. Install dependencies
```bash
npm install
```
3. Start the development server
```bash
npm run dev
```
or Build for Production
```bash
npm run build
```
The generated static files will be located in the dist/ directory and can be served using Nginx or another web server.

## Notes

- This frontend is designed to be used together with the EuroSupply backend.
- For API contracts and data models, refer to backend OpenAPI documentation.
- For production deployments, ensure environment variables and Nginx configuration are properly aligned.