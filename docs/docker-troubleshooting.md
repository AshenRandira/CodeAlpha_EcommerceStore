# Docker Troubleshooting Evidence

This document records real troubleshooting scenarios encountered while containerizing the CodeAlpha E-commerce Store.

The Dockerized architecture is:

```text
Browser
  -> http://localhost:8080
  -> Nginx web container
       -> serves the React production build
       -> handles React SPA fallback
       -> proxies /api requests
  -> Express API container on port 5000
  -> MongoDB container on port 27017
```

## Verified environment

The M6 Docker work was performed with:

```text
Operating system: Windows with PowerShell
Docker CLI: 29.6.1
Docker Engine: 29.6.1
Docker Compose: v5.1.4
Docker context: desktop-linux
Docker backend: Docker Desktop with WSL 2
Container architecture: linux/amd64
Frontend build image: node:24-alpine
Frontend runtime image: nginx:stable-alpine
API image: node:24-alpine
Database image: mongo:8.0.26
```

---

# Scenario 1 — Docker commands installed, but the Docker Engine was unavailable

## Symptom

The Docker CLI and Docker Compose commands were installed successfully:

```text
Docker version 29.6.1
Docker Compose version v5.1.4
```

However, commands that required the Docker Engine failed.

Examples:

```powershell
docker info
docker ps -a
docker compose ls
```

The commands returned an error similar to:

```text
failed to connect to the docker API at
npipe:////./pipe/dockerDesktopLinuxEngine

The system cannot find the file specified.
```

## Diagnosis

The active Docker context was checked:

```powershell
docker context show
```

Result:

```text
desktop-linux
```

Docker Desktop status was then checked:

```powershell
docker desktop status
```

Result:

```text
Could not retrieve status. Is Docker Desktop running?
```

The system was also inspected for Docker-related processes.

Result:

```text
No Docker-related processes are running.
```

The Docker Desktop Windows service was present but stopped:

```text
com.docker.service
Status: Stopped
StartType: Manual
```

The WSL configuration itself was available:

```text
Default Distribution: Ubuntu
Default Version: 2

Ubuntu          Stopped    2
docker-desktop  Stopped    2
```

## Root cause

Docker was installed correctly, but Docker Desktop and its Linux backend were not running.

The failure was not caused by:

- the application code;
- Docker Compose configuration;
- a Dockerfile;
- MongoDB;
- the active Docker context.

The Docker Engine itself was unavailable.

## Recovery

Docker Desktop was started with:

```powershell
docker desktop start
```

The command reported that Docker Desktop was starting.

## Verification

Docker Desktop status was checked again:

```powershell
docker desktop status
```

Result:

```text
Status: running
```

`docker info` then returned a complete Server section instead of a named-pipe connection error.

Additional engine-dependent commands also succeeded:

```powershell
docker ps -a
docker compose ls
```

The environment was then ready for Docker builds and Compose operations.

## Lesson

The presence of the Docker CLI does not prove that the Docker Engine is running.

When Docker commands fail to connect to `dockerDesktopLinuxEngine`, first verify:

```powershell
docker desktop status
docker info
```

Do not immediately reinstall Docker, reset Docker Desktop, delete data, or rewrite project configuration.

---

# Scenario 2 — Frontend Docker build failed at `npm ci`

## Symptom

The first frontend image build was started with:

```powershell
docker build `
    --file .\client\Dockerfile `
    --tag codealpha-ecommerce-web:m6 `
    .\client
```

The build successfully:

- loaded the Dockerfile;
- loaded `.dockerignore`;
- downloaded the Node image;
- downloaded the Nginx image;
- copied `package.json` and `package-lock.json`.

It then failed at:

```dockerfile
RUN npm ci
```

The important error was:

```text
npm ci can only install packages when your package.json
and package-lock.json are in sync.
```

The missing package records were:

```text
@emnapi/core@1.11.2
@emnapi/runtime@1.11.2
```

No frontend image was produced.

## Diagnosis

The local and container npm versions were inspected:

```text
Local npm: 11.6.1
Container npm: 11.16.0
```

The client lockfile was then analyzed directly.

The dependency tree contained references to:

```text
@emnapi/core
@emnapi/runtime
```

from packages including:

```text
@napi-rs/wasm-runtime
@rolldown/binding-wasm32-wasi
@tailwindcss/oxide-wasm32-wasi
```

However, the corresponding package entries were missing from `package-lock.json`.

The diagnostic result was:

```text
TARGET: @emnapi/core
Lock entry: MISSING

TARGET: @emnapi/runtime
Lock entry: MISSING
```

## Root cause

The client `package-lock.json` contained an incomplete dependency tree.

Packages in the lockfile referenced `@emnapi/core` and `@emnapi/runtime`, but the lockfile did not contain the required package records.

A clean `npm ci` installation correctly rejected the inconsistent lockfile instead of silently producing a different dependency tree.

The Dockerfile and Nginx configuration were not the cause of the failure.

## Controlled fix

The Dockerfile was not weakened, and `npm ci` was not replaced with `npm install`.

Instead, only the lockfile metadata was repaired using the same Node container environment used for the Docker build:

```powershell
docker run --rm `
    --mount "type=bind,source=<client-path>,target=/app" `
    --workdir /app `
    node:24-alpine `
    npm install `
        --package-lock-only `
        --ignore-scripts `
        --no-audit `
        --no-fund
```

The repair changed:

```text
client/package-lock.json
```

but did not change:

```text
client/package.json
```

The previously missing records then appeared:

```text
@emnapi/core     1.11.2
@emnapi/runtime  1.11.2
```

A semantic comparison against the committed lockfile showed:

```text
Added package entries: 8
Removed package entries: 0
Root dependency declarations: UNCHANGED
```

The added records were all within the dependency chain associated with the original build failure.

## Verification

The frontend image was rebuilt with the original Dockerfile.

The previously failing step succeeded:

```text
RUN npm ci
```

The remaining stages also succeeded:

```text
npm run build
copy /app/dist into Nginx
export final image
```

The completed image was:

```text
codealpha-ecommerce-web:m6
```

The final runtime image was then inspected and verified:

```text
Nginx configuration syntax: valid
Compiled React files: present
Node runtime: absent
npm runtime: absent
Nginx runtime: present
```

The runtime Nginx version was also verified:

```text
nginx/1.30.3
```

## Lesson

Do not hide a lockfile problem by changing a production Docker build from:

```dockerfile
RUN npm ci
```

to:

```dockerfile
RUN npm install
```

A clean container build is useful because it exposes dependency-reproducibility problems that may remain hidden in an existing local `node_modules` directory.

Diagnose the dependency tree first, repair the lockfile deliberately, and then prove that `npm ci` succeeds.

---

# Lifecycle observation — intentional API stop signals

During:

```powershell
docker compose restart api
```

and normal lifecycle operations, the old API npm process logged:

```text
npm error signal SIGTERM
```

This occurred while Docker intentionally stopped the running API process.

It was not treated as an unresolved application crash because the following recovery evidence passed:

```text
API container StartedAt timestamp changed
API health returned to healthy
MongoDB reconnected
/api/health returned status ok
/api/products returned all 24 products
My Orders still worked
Order Details still worked
```

The observed lifecycle sequence was:

```text
API running
-> intentional SIGTERM during restart
-> npm start runs again
-> MongoDB reconnects
-> API returns to healthy
```

A later full `docker compose stop` also showed the API container as exited after the intentional stop. The lifecycle test still passed because:

- `docker compose stop` completed successfully;
- no Compose containers remained running;
- `docker compose start` succeeded;
- the API returned to healthy;
- the database reconnected;
- all application data remained available.

The shutdown log was therefore kept as lifecycle evidence rather than treated as an unresolved application failure.

---

# Database safety note

The Docker MongoDB database uses the named volume:

```text
codealpha_ecommercestore_mongo_data
```

Normal lifecycle commands preserve the data:

```powershell
docker compose stop
docker compose start
docker compose down
docker compose up -d
```

The following command is intentionally destructive and should only be used when resetting Docker database data:

```powershell
docker compose down -v
```

The `-v` flag removes named volumes associated with the Compose project.

During normal M6 testing, `docker compose down -v` was not used.

## Persistence verification

Persistence was verified across normal `docker compose down` and `docker compose up -d`.

Before container removal:

```text
products: 24
users: 1
orders: 1
```

The following resources were removed by normal `docker compose down`:

```text
web container
api container
mongo container
Compose network
```

The MongoDB named volume remained:

```text
codealpha_ecommercestore_mongo_data
```

All three containers were then recreated with new container IDs.

After recreation, the database still contained:

```text
products: 24
users: 1
orders: 1
```

The public application entry point also remained healthy:

```text
API status: ok
Database status: connected
Products returned: 24
```

This proved that the MongoDB named volume persisted data independently of the MongoDB container lifecycle.

---

# Additional verified Docker evidence

## Health-gated startup

The first full stack startup followed this sequence:

```text
mongo
  -> healthy

api
  -> healthy

web
  -> healthy
```

The final service state showed:

```text
mongo   healthy
api     healthy
web     healthy
```

Only the web service published a host port:

```text
http://localhost:8080
```

The API and MongoDB ports remained internal to the Compose network.

## Nginx reverse proxy

The API health endpoint was successfully requested through the public Nginx entry point:

```text
http://localhost:8080/api/health
```

The response confirmed:

```text
status: ok
database: connected
```

This verified the request path:

```text
Browser or host
-> Nginx
-> Express API
-> MongoDB
```

## React SPA fallback

Direct requests to nested React routes succeeded.

Examples included:

```text
/cart
/products/<product-id>
/orders/<order-id>
```

The routes returned the React application instead of an Nginx 404.

This verified the Nginx SPA fallback configuration.

## Docker database seeding

The Docker MongoDB database was initially empty:

```text
Docker database product count: 0
```

The existing project seed script was then run deliberately inside the API container:

```powershell
docker compose exec -T api npm run seed
```

The seed output confirmed:

```text
Cleared 0 existing product(s).
Seeded 24 product(s).
Product collection count: 24
Product seed completed successfully.
```

The result was independently verified in two ways:

```text
Products returned through Nginx: 24
Products stored directly in Docker MongoDB: 24
```

The seed script was not tied to normal API startup or container restart.

## API restart recovery

The API container was deliberately restarted with:

```powershell
docker compose restart api
```

The API health state changed from:

```text
starting
```

to:

```text
healthy
```

The container `StartedAt` timestamp changed, proving the API process actually restarted.

After recovery:

```text
/api/health returned status ok
MongoDB status was connected
/api/products returned 24 products
My Orders worked
Order Details worked
Direct route refresh worked
```

## Logs inspection

Service logs were inspected with:

```powershell
docker compose logs api
docker compose logs web
```

The API logs showed:

```text
MongoDB connected: mongo/codealpha_store
API running on http://localhost:5000
```

The Nginx logs included successful requests for:

```text
POST /api/auth/register    201
POST /api/auth/login       200
POST /api/orders           201
GET  /api/orders/my        200
GET  /api/orders/<id>      200
GET  /api/health           200
```

## Resource monitoring

A one-shot resource snapshot was captured with:

```powershell
docker stats --no-stream
```

All three containers were visible with:

```text
CPU %
MEM USAGE / LIMIT
MEM %
NET I/O
BLOCK I/O
PIDS
```

This demonstrated live container resource monitoring for:

```text
web
api
mongo
```

---

# Troubleshooting approach used during M6

For each issue:

1. Capture the exact error.
2. Identify the precise failing layer.
3. Inspect the real environment and configuration.
4. Avoid broad rewrites.
5. Apply the narrowest justified fix.
6. Repeat the failed operation.
7. Verify both infrastructure health and application behavior.
8. Preserve useful logs as DevOps evidence.

This approach kept the existing application behavior unchanged while adding the Docker deployment layer.