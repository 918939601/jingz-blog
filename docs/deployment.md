# Deployment Guide

This repository is designed to be deployed as two services:

- Next.js frontend
- Go API backend

Your local setup can stay as-is. These files only add a separate production
configuration path.

## Recommended Topology

- `https://blog.example.com` -> Next.js
- `https://api.example.com` -> Go API
- managed PostgreSQL -> shared database

## Frontend Deployment

Deploy the repository root as the Next.js app.

Suggested target:

- Vercel

Use `.env.production.example` as the reference for production environment
variables.

Required variables:

- `SITE_URL`
- `NEXT_PUBLIC_ADMIN_EMAILS`
- `AUTH_SECRET`
- `AUTH_GITHUB_ID`
- `AUTH_GITHUB_SECRET`
- `NEXT_PUBLIC_GO_API_BASE`
- `GO_API_BASE`
- `REVALIDATE_SECRET`
- `UPLOADTHING_TOKEN`
- `DATABASE_URL`

Important values:

- `SITE_URL=https://blog.example.com`
- `NEXT_PUBLIC_GO_API_BASE=https://api.example.com`
- `GO_API_BASE=https://api.example.com`

GitHub OAuth callback:

- `https://blog.example.com/api/auth/callback/github`

## Backend Deployment

Deploy `server/blogapi` as the Go web service.

Suggested targets:

- Render
- Fly.io
- VPS

Start command example:

```bash
cd server
go run ./blogapi -f blogapi/etc/blogapi.deploy.yaml
```

Use `server/blogapi/etc/blogapi.deploy.yaml.example` as the reference for your
production config.

Required runtime environment variables:

- `REVALIDATE_SECRET`

Optional runtime override:

- `NEXT_SITE_URL`

If `NEXT_SITE_URL` is set, it overrides `NextSiteURL` in the Go YAML config.
If neither is set, the Go service falls back to `http://localhost:3000`, which
keeps local development working.

## Revalidate Flow

After write operations, the Go backend calls:

- `POST {NEXT_SITE_URL}/api/revalidate`

To make that work in production:

- Next.js and Go must share the same `REVALIDATE_SECRET`
- `NextSiteURL` or `NEXT_SITE_URL` must point to the deployed frontend domain

## Production Checklist

1. Deploy PostgreSQL and run Prisma migrations against the production database.
2. Deploy the Go API and confirm the API domain is reachable.
3. Deploy the Next.js frontend and confirm it can read from the Go API.
4. Configure GitHub OAuth callback URL for the production domain.
5. Create or update DNS records for both domains.
6. Verify create/update/delete actions in admin trigger page revalidation.

## Ubuntu Docker Deployment

If you are deploying the Go backend on your own Ubuntu server, use:

- Docker Compose to run the Go API
- Nginx on the host machine for reverse proxy and TLS

Reference files:

- `server/Dockerfile.blogapi`
- `deploy/docker-compose.api.yml`
- `deploy/blogapi.deploy.yaml.example`
- `deploy/nginx.api.conf.example`

Suggested runtime topology:

- `127.0.0.1:8080` -> Docker container
- `https://api.example.com` -> Nginx -> Docker container

Basic steps:

1. Copy the repository to the server.
2. Copy `deploy/blogapi.deploy.yaml.example` to `deploy/blogapi.deploy.yaml`.
3. Edit `deploy/blogapi.deploy.yaml` with the production values:
   - `DatabaseDSN`
   - `Cors`
   - `NextSiteURL`
   - `AmapKey`
   - optional AI config
4. Edit `deploy/docker-compose.api.yml` and replace:
   - `REVALIDATE_SECRET`
   - `NEXT_SITE_URL`
5. Start the backend:

```bash
docker compose -f deploy/docker-compose.api.yml up -d --build
```

6. Verify the container is running:

```bash
docker compose -f deploy/docker-compose.api.yml ps
docker compose -f deploy/docker-compose.api.yml logs -f
```

7. Copy `deploy/nginx.api.conf.example` to an Nginx site config and replace the
   domain with your real API domain.
8. Reload Nginx.
9. Add TLS with Certbot if needed.

## Full Ubuntu Deployment

If you want to skip Vercel completely, you can run both services on the same
Ubuntu server with Docker Compose.

Reference files:

- `Dockerfile.web`
- `server/Dockerfile.blogapi`
- `deploy/docker-compose.full.yml`
- `deploy/blogapi.deploy.yaml.example`

Suggested runtime topology:

- `http://SERVER_IP:3000` -> Next.js frontend
- `http://SERVER_IP:8080` -> Go API backend
- Next.js server-side requests -> `http://blogapi:8080`

Basic steps:

1. Copy the repository to the server.
2. Copy `deploy/blogapi.deploy.yaml.example` to `deploy/blogapi.deploy.yaml`.
3. Edit `deploy/blogapi.deploy.yaml` with the production values:
   - `DatabaseDSN`
   - `Cors`
   - `AmapKey`
   - optional AI config
4. Edit `deploy/docker-compose.full.yml` and replace:
   - `SITE_URL`
   - `NEXT_PUBLIC_ADMIN_EMAILS`
   - `AUTH_SECRET`
   - `AUTH_GITHUB_ID`
   - `AUTH_GITHUB_SECRET`
   - `NEXT_PUBLIC_GO_API_BASE`
   - `REVALIDATE_SECRET`
   - `UPLOADTHING_TOKEN`
   - `DATABASE_URL`
5. Keep these two values as-is unless you know you need something else:
   - `GO_API_BASE=http://blogapi:8080`
   - `NEXT_SITE_URL=http://blogweb:3000`
6. Start both services:

```bash
docker compose -f deploy/docker-compose.full.yml up -d --build
```

7. Check status and logs:

```bash
docker compose -f deploy/docker-compose.full.yml ps
docker compose -f deploy/docker-compose.full.yml logs -f blogweb
docker compose -f deploy/docker-compose.full.yml logs -f blogapi
```

8. Verify:
   - open `http://SERVER_IP:3000`
   - open `http://SERVER_IP:8080/api/blogs`

This deployment path does not affect local development. Your local `.env`,
`pnpm dev`, and local Go service can remain unchanged.
