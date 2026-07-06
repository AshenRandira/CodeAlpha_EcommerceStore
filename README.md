# CodeAlpha E-commerce Store

A focused full-stack e-commerce MVP built for the CodeAlpha Full Stack Development and DevOps internship tasks.

This repository will cover:

* Full Stack Development Task 1: Simple E-commerce Store
* DevOps Task 4: Web Server using Docker

The project is being developed milestone by milestone with required features completed before optional features.

## Architecture

### Local development

```text
Browser
   |
   v
React + Vite
   |
   | /api requests
   v
Express REST API
   |
   v
MongoDB
```

### Dockerized submission

```text
Browser
   |
   v
Nginx
   |
   | /api
   v
Express API
   |
   v
MongoDB
```

The Dockerized architecture will be implemented after the required application user journey is complete.

## Technology Stack

### Frontend

* React
* Vite
* Tailwind CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

### Authentication

* JWT
* bcrypt

### DevOps

* Docker
* Docker Compose
* Nginx

## Current Milestone

### M0 — Setup

Current foundation:

* [x] Git repository
* [x] React/Vite client structure
* [x] Tailwind CSS setup
* [x] Express API structure
* [x] MongoDB connection structure
* [x] Environment variable example
* [x] API health endpoint
* [x] Git secret protection
* [ ] M0 verification complete

## Prerequisites

* Node.js 20.19+ or 22.12+
* npm
* Git
* MongoDB running locally or a MongoDB Atlas connection

## Local Development Setup

### 1. Install client dependencies

From the repository root:

```powershell
Set-Location client
npm install
Set-Location ..
```

### 2. Install server dependencies

```powershell
Set-Location server
npm install
Set-Location ..
```

### 3. Create the server environment file

```powershell
Copy-Item server\.env.example server\.env
```

Update `server/.env` with the correct MongoDB connection string.

Never commit `server/.env`.

### 4. Start the API

Open a PowerShell terminal:

```powershell
Set-Location server
npm run dev
```

The API runs at:

```text
http://localhost:5000
```

Health endpoint:

```text
http://localhost:5000/api/health
```

### 5. Start the client

Open a second PowerShell terminal:

```powershell
Set-Location client
npm run dev
```

The client runs at:

```text
http://localhost:5173
```

## API Available in M0

| Method | Endpoint      | Purpose                       |
| ------ | ------------- | ----------------------------- |
| GET    | `/api/health` | Check API and database health |

Additional endpoints will be added only in their planned milestones.

## Milestone Order

1. M0 — Setup
2. M1 — Products
3. M2 — Authentication
4. M3 — Cart
5. M4 — Orders
6. M5 — UI Finish
7. M6 — Docker
8. M7 — Documentation and Submission

## Security

* Local `.env` files are ignored by Git.
* `.env.example` contains placeholders only.
* Passwords and authentication will be implemented in M2.
* Secrets must never be committed to the repository.

## Project Status

Work in progress. The project is currently limited to the M0 foundation.
