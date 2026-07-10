# CodeAlpha E-commerce Store — Demo Script

This script is designed for one video that demonstrates both CodeAlpha submissions:

- Full Stack Development — Task 1: Simple E-commerce Store
- DevOps — Task 4: Web Server using Docker

## 1. Introduction

Hello, I am Ashen DC.

This project is my CodeAlpha E-commerce Store. It covers both the Full Stack Development Task 1 and the DevOps Task 4 in one repository.

The application is built with React, Vite, Tailwind CSS, Node.js, Express, MongoDB, Mongoose, JWT authentication, Docker, Docker Compose, and Nginx.

## 2. Show the GitHub Repository

Open the GitHub repository:

https://github.com/AshenRandira/CodeAlpha_EcommerceStore

Briefly show:

- `client`
- `server`
- `docs`
- `docker-compose.yml`
- `README.md`

Explain that the repository contains the full-stack application and the Docker deployment configuration.

## 3. Explain the Architecture

Explain the Docker request flow:

```text
Browser
  -> http://localhost:8080
  -> Nginx web container
       -> serves the React production build
       -> supports SPA route fallback
       -> proxies /api requests
  -> Express API container
  -> MongoDB container
  -> persistent MongoDB named volume
```

Mention that only the Nginx web service exposes a host port.

## 4. Show the Docker Compose Stack

In PowerShell, run:

```powershell
docker compose ps
```

Show that the following services are healthy:

- `web`
- `api`
- `mongo`

Briefly explain:

- `web` serves the React build through Nginx
- `api` runs the Express backend
- `mongo` stores products, users, and orders

## 5. Open the Application

Open:

```text
http://localhost:8080
```

Explain that this is the Dockerized production-style entry point.

## 6. Product Listing

On the home page:

- Show the product catalog
- Show LKR prices
- Show product categories
- Show stock information
- Mention that products are loaded from MongoDB through the Express API

## 7. Product Details

Open one product.

Show:

- Product image
- Product name
- Description
- Price
- Category
- Stock
- Quantity controls
- Add to Cart button

Add the product to the cart.

## 8. Shopping Cart

Open the Cart page.

Show:

- Added product
- Quantity controls
- Item count
- Line total
- Subtotal
- Remove action
- Clear cart action

Change the quantity and explain that the cart is persistent across browser refreshes using `localStorage`.

## 9. Registration and Login

Open the registration page.

Register a new test user, or use an existing test account.

Then show:

- Successful authentication
- Authenticated navigation
- Profile access
- Session restoration after refresh

Do not reveal passwords, JWT values, or `.env` contents.

## 10. Checkout

Return to the cart and proceed to checkout.

Show:

- Protected checkout route
- Shipping form
- Order summary
- Place Order button

Complete the order.

Explain that the backend:

- Validates the cart
- Loads products from MongoDB
- Recalculates prices
- Validates stock and quantities
- Creates the order for the authenticated user

## 11. My Orders

Open the My Orders page.

Show:

- The newly created order
- Order date
- Status
- Item count
- Total

Explain that users only see their own orders.

## 12. Order Details

Open the new order.

Show:

- Order ID
- Status
- Ordered items
- Product names
- Quantities
- Prices
- Shipping address
- Final subtotal

Explain that Order Details is protected and owner-authorized.

## 13. React Route Refresh

Refresh a nested route such as:

```text
/orders/<order-id>
```

Explain that Nginx SPA fallback returns the React application instead of a 404 page.

## 14. API Health

Open:

```text
http://localhost:8080/api/health
```

Show that:

- API status is `ok`
- Database status is `connected`

Explain that this request passes through Nginx to Express and then verifies MongoDB connectivity.

## 15. Container Logs

In PowerShell, run:

```powershell
docker compose logs api
docker compose logs web
```

Briefly show:

- API startup
- MongoDB connection
- Successful API requests
- Nginx request logs

## 16. Resource Monitoring

Run:

```powershell
docker stats --no-stream
```

Show the `web`, `api`, and `mongo` containers.

Mention:

- CPU usage
- Memory usage
- Network I/O
- Process count

## 17. API Restart Recovery

Run:

```powershell
docker compose restart api
docker compose ps
```

Wait until the API becomes healthy again.

Refresh:

```text
http://localhost:8080/api/health
```

Explain that the API reconnects to MongoDB and recovers successfully after a controlled restart.

## 18. MongoDB Persistence

Explain that Docker MongoDB uses a named volume.

Mention that normal commands preserve data:

```powershell
docker compose stop
docker compose start
docker compose down
docker compose up -d
```

Warn that this command deletes the database volume:

```powershell
docker compose down -v
```

State that products, users, and orders were verified to persist across normal `docker compose down` and `docker compose up -d`.

## 19. Troubleshooting Documentation

Open:

```text
docs/docker-troubleshooting.md
```

Briefly show the documented scenarios:

- Docker CLI installed while Docker Engine was unavailable
- Frontend `npm ci` failure caused by an incomplete lockfile
- Controlled lockfile repair
- API lifecycle `SIGTERM` during intentional restart
- Health checks
- Logs
- Resource monitoring
- MongoDB persistence

## 20. Final Repository and README

Return to the repository and show:

- Final `README.md`
- Docker setup instructions
- Local development setup
- API overview
- Application routes
- Screenshots section
- Troubleshooting guide link
- Submission checklist

## 21. Closing Statement

This project demonstrates a complete full-stack e-commerce workflow and a Dockerized web-server deployment.

The full-stack task includes products, authentication, cart, checkout, and order history.

The DevOps task includes Nginx, Docker Compose, health checks, lifecycle commands, logs, monitoring, restart recovery, persistence, and troubleshooting.

Thank you.
