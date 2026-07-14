# CodeAlpha E-commerce Store

A complete full-stack e-commerce application and Dockerized web-server deployment :

- **1: Simple E-commerce Store**
- **2: Web Server using Docker**

The application allows users to browse products, view product details, manage a persistent cart, register or log in, place orders, and view their order history. The production build runs as a multi-container Docker Compose stack with Nginx serving the React application and reverse-proxying API requests to Express.

## Project Links

- Repository: https://github.com/AshenRandira/CodeAlpha_EcommerceStore
- Docker application URL: http://localhost:8080
- Local frontend URL: http://localhost:5173
- Local API URL: http://localhost:5000

### 1

This repository demonstrates:

- Database-backed product listings
- Product details pages
- Persistent shopping cart
- User registration and login
- JWT-protected routes
- Checkout and order processing
- My Orders page
- Owner-protected Order Details page
- MongoDB storage for products, users, and orders

### 2

This repository demonstrates:

- Docker containerization
- Multi-stage frontend image builds
- Nginx running as the production web server
- Nginx reverse proxying `/api` requests
- Docker Compose service orchestration
- Health-gated container startup
- Container lifecycle commands
- Logs and resource monitoring
- MongoDB named-volume persistence
- Troubleshooting and recovery documentation
- Production-focused container practices

## Features

### Storefront

- Responsive product catalog
- 24 seeded products with LKR pricing
- Product images, categories, prices, descriptions, and stock information
- Product details page
- Loading, empty, error, and not-found states

### Authentication

- User registration
- User login and logout
- Password hashing with bcrypt
- JWT authentication
- Restored login sessions after refresh
- Authenticated profile page
- Protected checkout and order routes

### Shopping Cart

- Add products to the cart
- Merge repeated product additions
- Update quantities
- Enforce available-stock limits
- Remove individual products
- Clear the cart
- Display item count and subtotal
- Persist cart data in `localStorage`

### Orders

- Protected checkout
- Shipping-address form
- Server-side product and quantity validation
- Server-side price recalculation from MongoDB
- Order creation linked to the authenticated user
- My Orders history
- Owner-only Order Details
- Order status, items, totals, shipping information, and timestamps

### Docker Deployment

- React production build generated in a Node build stage
- Static frontend served by Nginx
- React SPA route fallback
- `/api` reverse proxy to Express
- Express API running as a non-root user
- MongoDB database container
- Persistent MongoDB named volume
- Health checks for all three services
- Only the Nginx service exposed to the host

## Architecture

### Local Development

```text
Browser
  |
  +-- http://localhost:5173
  |       React + Vite development server
  |       |
  |       +-- /api requests
  |               |
  v               v
             Express API
             localhost:5000
                  |
                  v
               MongoDB
```

### Dockerized Deployment

```text
Browser
  |
  v
http://localhost:8080
  |
  v
Nginx web container
  |-- serves the React production build
  |-- supports React SPA route fallback
  |-- exposes /health
  |
  +-- proxies /api
          |
          v
     Express API container
     port 5000 inside Docker
          |
          v
     MongoDB container
     port 27017 inside Docker
          |
          v
     Persistent named volume
```

## Technology Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, Vite 8 |
| Routing | React Router |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Backend | Node.js, Express 5 |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcrypt |
| Development tooling | npm, nodemon, Oxlint |
| Web server | Nginx |
| Containers | Docker, Docker Compose |

## Repository Structure

```text
CodeAlpha_EcommerceStore/
|-- client/
|   |-- public/
|   |-- src/
|   |   |-- components/
|   |   |-- context/
|   |   |-- pages/
|   |   |-- App.jsx
|   |   `-- main.jsx
|   |-- .dockerignore
|   |-- Dockerfile
|   |-- nginx.conf
|   |-- package.json
|   `-- package-lock.json
|
|-- server/
|   |-- src/
|   |   |-- config/
|   |   |-- controllers/
|   |   |-- middleware/
|   |   |-- models/
|   |   |-- routes/
|   |   |-- scripts/
|   |   |-- app.js
|   |   `-- server.js
|   |-- .dockerignore
|   |-- .env.example
|   |-- Dockerfile
|   |-- package.json
|   `-- package-lock.json
|
|-- docs/
|   |-- demo-script.md
|   |-- docker-troubleshooting.md
|   |-- submission-checklist.md
|   `-- screenshots/
|
|-- .gitignore
|-- docker-compose.yml
`-- README.md
```

## Prerequisites

For local development:

- Git
- Node.js 20.19 or newer
- npm
- MongoDB Community Server or another MongoDB connection

For Docker deployment:

- Docker Desktop
- Docker Engine
- Docker Compose

## Environment Variables

The safe environment template is located at `server/.env.example`.

Create the local environment file:

```powershell
Copy-Item .\server\.env.example .\server\.env
```

Environment variables:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/codealpha_store
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5173
NODE_ENV=development
```

Replace `JWT_SECRET` with a long random value before running the application.

Never commit `server/.env`.

## Local Development Setup

### 1. Clone the repository

```powershell
git clone https://github.com/AshenRandira/CodeAlpha_EcommerceStore.git
Set-Location .\CodeAlpha_EcommerceStore
```

### 2. Install dependencies

```powershell
Set-Location .\client
npm install
Set-Location ..\server
npm install
Set-Location ..
```

### 3. Create the server environment file

```powershell
Copy-Item .\server\.env.example .\server\.env
```

Edit `server/.env` with a working MongoDB URI and a secure JWT secret.

### 4. Seed the product catalog

```powershell
Set-Location .\server
npm run seed
Set-Location ..
```

The seed script clears only the Product collection, inserts 24 products, and verifies the final count.

### 5. Start the API

```powershell
Set-Location .\server
npm run dev
```

API: `http://localhost:5000`

Health: `http://localhost:5000/api/health`

### 6. Start the frontend

In a second PowerShell terminal:

```powershell
Set-Location .\client
npm run dev
```

Frontend: `http://localhost:5173`

## Docker Setup

The Docker Compose stack contains:

| Service | Responsibility | Host exposure |
| --- | --- | --- |
| `web` | Nginx, React static files, API reverse proxy | `8080:80` |
| `api` | Express REST API | Internal only |
| `mongo` | MongoDB database | Internal only |

### 1. Create `server/.env`

```powershell
Copy-Item .\server\.env.example .\server\.env
```

Set a secure JWT secret. Docker Compose overrides the MongoDB URI, client origin, API port, and runtime mode for the containers.

### 2. Build and start

```powershell
docker compose build
docker compose up -d
docker compose ps
```

### 3. Seed Docker MongoDB

```powershell
docker compose exec -T api npm run seed
```

### 4. Open the application

- Application: `http://localhost:8080`
- API health through Nginx: `http://localhost:8080/api/health`
- Nginx health: `http://localhost:8080/health`

## Docker Lifecycle and Monitoring

```powershell
docker compose ps
docker compose logs api
docker compose logs web
docker compose logs -f api
docker stats --no-stream
docker compose restart api
docker compose stop
docker compose start
docker compose down
docker compose up -d
```

To intentionally remove the MongoDB named volume:

```powershell
docker compose down -v
```

Warning: `-v` deletes stored Docker database data.

## Application Routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/` | Public | Product catalog |
| `/products/:id` | Public | Product details |
| `/cart` | Public | Persistent shopping cart |
| `/register` | Public | User registration |
| `/login` | Public | User login |
| `/profile` | Protected | Authenticated user profile |
| `/checkout` | Protected | Shipping details and order placement |
| `/orders` | Protected | Current user's order history |
| `/orders/:id` | Protected | Owner-only order details |
| `*` | Public | Not-found page |

## API Overview

| Method | Endpoint | Authentication | Purpose |
| --- | --- | --- | --- |
| GET | `/api/health` | No | API and database health |
| POST | `/api/auth/register` | No | Register a user |
| POST | `/api/auth/login` | No | Log in and receive a JWT |
| GET | `/api/auth/me` | Yes | Return the current user |
| GET | `/api/products` | No | Return all products |
| GET | `/api/products/:id` | No | Return one product |
| POST | `/api/orders` | Yes | Validate and create an order |
| GET | `/api/orders/my` | Yes | Return the current user's orders |
| GET | `/api/orders/:id` | Yes | Return an owner-authorized order |

Protected endpoints require:

```http
Authorization: Bearer <token>
```

## Verification Checklist

### Full-Stack Application

- [x] Products load from MongoDB
- [x] Product details work
- [x] Registration and login work
- [x] Authentication survives refresh
- [x] Cart add, update, remove, clear, and persistence work
- [x] Checkout creates an order
- [x] Server recalculates order prices
- [x] My Orders works
- [x] Order Details is owner-protected
- [x] Local development setup works

### Docker and DevOps

- [x] Docker images build
- [x] Compose starts all services
- [x] All services become healthy
- [x] Nginx serves the React build
- [x] Nginx proxies `/api`
- [x] React nested-route refresh works
- [x] API restart recovery works
- [x] Logs and resource monitoring work
- [x] MongoDB data survives normal `docker compose down`
- [x] Troubleshooting evidence is documented

### Client Quality Checks

```powershell
Set-Location .\client
npm run lint
npm run build
Set-Location ..
```

## Screenshots

Recommended submission screenshots:

1. Home/product listing
2. Product details
3. Cart
4. Checkout
5. My Orders
6. Order Details
7. `docker compose ps` with healthy services
8. Application at `http://localhost:8080`
9. Docker logs or `docker stats --no-stream`

Store screenshots under `docs/screenshots/`.

Do not include passwords, JWTs, `.env` contents, or secrets.

## Troubleshooting

See [Docker Troubleshooting Guide](docs/docker-troubleshooting.md).

It documents Docker Engine availability, lockfile repair, lifecycle behavior, health checks, Nginx proxying, SPA fallback, logs, monitoring, and MongoDB persistence.

## Demo and Submission Notes

The final demo should show both CodeAlpha tasks:

1. Introduce the repository and both task requirements.
2. Explain the React, Express, MongoDB, Nginx, and Docker architecture.
3. Demonstrate products, product details, cart, authentication, checkout, My Orders, and Order Details.
4. Show `docker compose ps`, health, logs, and resource monitoring.
5. Mention MongoDB named-volume persistence.
6. Show the troubleshooting guide and final README.

## Security and Repository Hygiene

- `server/.env` is ignored by Git.
- `.env.example` contains placeholders only.
- Passwords are stored as bcrypt hashes.
- Protected endpoints use verified JWT identity.
- Client-provided order totals are not trusted.
- `node_modules` and `dist` are not committed.
- The API container runs as the non-root `node` user.
- API and MongoDB ports are internal to Docker.

## Known Scope

Not included:

- Real payment gateway
- Admin dashboard
- Reviews and ratings
- Coupons
- Wishlists
- Real-time notifications
- Kubernetes
- Terraform
- Public cloud deployment

Order placement records an order in MongoDB without processing a real payment.

## Project Status

- [x] M0 — Project setup
- [x] M1 — Product catalog
- [x] M2 — Authentication
- [x] M3 — Persistent shopping cart
- [x] M4 — Checkout and order history
- [x] M5 — Storefront polish and expanded LKR catalog
- [x] M6 — Dockerized deployment
- [ ] M7 — Final documentation and submission preparation

## Author

**Ashen Randira**

