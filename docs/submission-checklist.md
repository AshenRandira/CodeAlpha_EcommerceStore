# CodeAlpha E-commerce Store — Submission Checklist

Use this checklist before submitting the project for both CodeAlpha tasks.

## Repository and Git

- [ ] GitHub repository is accessible:
  `https://github.com/AshenRandira/CodeAlpha_EcommerceStore`
- [ ] Final documentation branch is `feature/m7-final-docs`
- [ ] Final M7 commit is created only after verification
- [ ] Final commit message is:
  `docs: finalize project documentation and submission guide`
- [ ] M7 branch is merged into `main`
- [ ] `main` is pushed to GitHub
- [ ] `origin/main` matches local `main`
- [ ] Working tree is clean after the final push
- [ ] No required work exists only on the local machine

## README

- [ ] Project title is clear
- [ ] Both CodeAlpha tasks are identified
- [ ] Full-stack features are summarized
- [ ] Docker and DevOps work is summarized
- [ ] Technology stack is listed
- [ ] Architecture is explained
- [ ] Repository structure is included
- [ ] Environment variables are documented
- [ ] Local development setup is documented
- [ ] Docker setup is documented
- [ ] Product seed instructions are included
- [ ] Application routes are listed
- [ ] API endpoints are listed
- [ ] Verification checklist is included
- [ ] Screenshots section is included
- [ ] Troubleshooting guide is linked
- [ ] Demo and submission notes are included

## Full Stack Development — Task 1

- [ ] Product listing works
- [ ] Product details page works
- [ ] Cart add works
- [ ] Cart quantity update works
- [ ] Cart remove works
- [ ] Cart clear works
- [ ] Cart persists across refreshes
- [ ] User registration works
- [ ] User login works
- [ ] Authenticated session restores after refresh
- [ ] Protected routes redirect unauthenticated users
- [ ] Checkout accepts shipping details
- [ ] Backend validates order items
- [ ] Backend recalculates prices from MongoDB
- [ ] Order is stored in MongoDB
- [ ] My Orders shows the current user's orders
- [ ] Order Details is owner-protected
- [ ] Products, users, and orders are stored in MongoDB

## DevOps — Task 4

- [ ] Client Dockerfile uses a multi-stage build
- [ ] Nginx serves the React production build
- [ ] Nginx proxies `/api` requests to Express
- [ ] Nginx supports React SPA route fallback
- [ ] API container runs successfully
- [ ] MongoDB container runs successfully
- [ ] Docker Compose starts all three services
- [ ] `web` health check passes
- [ ] `api` health check passes
- [ ] `mongo` health check passes
- [ ] Only the Nginx service exposes a host port
- [ ] `docker compose ps` shows healthy services
- [ ] Container logs are demonstrated
- [ ] `docker stats --no-stream` is demonstrated
- [ ] API restart recovery is demonstrated
- [ ] Stop/start lifecycle is demonstrated
- [ ] Normal `docker compose down` preserves database data
- [ ] `docker compose down -v` is documented as destructive
- [ ] Troubleshooting scenarios are documented

## Local Development Verification

- [ ] MongoDB is available locally
- [ ] `server/.env` contains valid local values
- [ ] Server dependencies install successfully
- [ ] Client dependencies install successfully
- [ ] `npm run seed` succeeds
- [ ] API starts with `npm run dev`
- [ ] Client starts with `npm run dev`
- [ ] `http://localhost:5000/api/health` works
- [ ] `http://localhost:5173` loads the application
- [ ] Essential e-commerce flow works locally

## Docker Verification

- [ ] Docker Desktop is running
- [ ] `docker info` succeeds
- [ ] `docker compose build` succeeds
- [ ] `docker compose up -d` succeeds
- [ ] `docker compose ps` shows healthy services
- [ ] `docker compose exec -T api npm run seed` succeeds when needed
- [ ] `http://localhost:8080` loads the application
- [ ] `http://localhost:8080/api/health` reports API and database health
- [ ] Product listing works through Nginx
- [ ] Registration and login work through Docker
- [ ] Cart works through Docker
- [ ] Checkout creates an order through Docker
- [ ] My Orders works through Docker
- [ ] Order Details works through Docker
- [ ] Nested React route refresh works through Nginx
- [ ] API restart returns to healthy
- [ ] Data remains after normal Compose down/up

## Code Quality and Safety

- [ ] `npm run lint` passes in `client`
- [ ] `npm run build` passes in `client`
- [ ] `git diff --check` passes
- [ ] `server/.env` is not tracked
- [ ] No real JWT secret is committed
- [ ] No passwords or tokens appear in documentation
- [ ] `node_modules` is not tracked
- [ ] `client/dist` is not tracked
- [ ] No temporary debug files are tracked
- [ ] Screenshots do not expose secrets
- [ ] Demo video does not expose secrets

## Screenshots

Capture and store suitable evidence for:

- [ ] Home/product listing
- [ ] Product details
- [ ] Cart
- [ ] Checkout
- [ ] My Orders
- [ ] Order Details
- [ ] Docker Compose healthy stack
- [ ] Application running at `http://localhost:8080`
- [ ] Docker logs or resource monitoring

Suggested location:

```text
docs/screenshots/
```

## Demo Video

- [ ] Demo script has been reviewed
- [ ] GitHub repository is shown
- [ ] Technology stack is explained
- [ ] Docker architecture is explained
- [ ] Product listing is demonstrated
- [ ] Product details are demonstrated
- [ ] Cart is demonstrated
- [ ] Registration or login is demonstrated
- [ ] Checkout is demonstrated
- [ ] My Orders is demonstrated
- [ ] Order Details is demonstrated
- [ ] `docker compose ps` is shown
- [ ] Health endpoint is shown
- [ ] Logs are shown briefly
- [ ] Resource monitoring is shown briefly
- [ ] API restart recovery is mentioned or demonstrated
- [ ] MongoDB persistence is explained
- [ ] Troubleshooting documentation is shown
- [ ] Video does not reveal secrets
- [ ] Final video is uploaded or ready to submit

## LinkedIn Post

- [ ] Project title is included
- [ ] CodeAlpha is mentioned
- [ ] Full Stack Development Task 1 is mentioned
- [ ] DevOps Task 4 is mentioned
- [ ] Main technologies are mentioned
- [ ] Key full-stack features are mentioned
- [ ] Docker and Nginx work is mentioned
- [ ] GitHub repository link is included
- [ ] Demo video or screenshots are attached if appropriate
- [ ] No secrets or sensitive data are visible

## Submission Forms

- [ ] Full Stack submission form is ready
- [ ] DevOps submission form is ready
- [ ] Correct GitHub repository link is used
- [ ] Correct demo video link is used
- [ ] Correct LinkedIn post link is used if required
- [ ] Task names and numbers are correct
- [ ] Repository is public if required
- [ ] Final submission details have been reviewed

## Final Approval

Do not submit until all critical checks below pass:

- [ ] README is complete
- [ ] Demo script is complete
- [ ] Submission checklist is complete
- [ ] Screenshot guidance exists
- [ ] Client lint passes
- [ ] Client build passes
- [ ] Docker stack remains healthy
- [ ] No secrets or build artifacts are tracked
- [ ] Final M7 commit exists on `feature/m7-final-docs`
- [ ] M7 is merged into `main`
- [ ] Final `main` is pushed to GitHub
- [ ] Working tree is clean
