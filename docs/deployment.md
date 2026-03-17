# Deployment Guide

This repository is designed to run as two services on the same server:

- Next.js frontend
- Go API backend

The production deployment files in `deploy/` assume both services are hosted on
the same machine and exposed through one Nginx site.

## Recommended Topology

- `http://124.223.57.73/` -> Nginx -> Next.js on `127.0.0.1:3000`
- `http://124.223.57.73/goapi/` -> Nginx -> Go API on `127.0.0.1:8080`
- managed PostgreSQL -> shared database

## Revalidate Flow

After write operations, the Go backend calls:

- `POST {NEXT_SITE_URL}/api/revalidate`

To make that work in production:

- Next.js and Go must share the same `REVALIDATE_SECRET`
- `NextSiteURL` in YAML or `NEXT_SITE_URL` in the container must point to the
  frontend entry, for example `http://124.223.57.73`

## Production Checklist

1. Deploy PostgreSQL and run Prisma migrations against the production database.
2. Deploy the Go API and confirm `http://124.223.57.73/goapi/...` is reachable.
3. Deploy the Next.js frontend and confirm the homepage loads through Nginx.
4. Configure GitHub OAuth callback URL for the production domain or IP.
5. Verify create/update/delete actions in admin trigger page revalidation.

## Ubuntu Docker Deployment

Use Docker Compose to run both services and Nginx on the host machine for
reverse proxy.

Reference files:

- `Dockerfile.web`
- `server/Dockerfile.blogapi`
- `deploy/docker-compose.web.yml`
- `deploy/docker-compose.api.yml`
- `deploy/blogapi.deploy.yaml.example`
- `deploy/nginx.site.conf.example`

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
5. Edit `deploy/docker-compose.web.yml` and replace:
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
6. Keep these values aligned with the same-host deployment:
   - `SITE_URL=http://124.223.57.73`
   - `AUTH_URL=http://124.223.57.73`
   - `NEXTAUTH_URL=http://124.223.57.73`
   - `NEXT_PUBLIC_GO_API_BASE=/goapi`
   - `GO_API_BASE=http://host.docker.internal/goapi`
   - `NEXT_SITE_URL=http://124.223.57.73`
7. Start both services:

```bash
docker compose -f deploy/docker-compose.api.yml up -d --build
docker compose -f deploy/docker-compose.web.yml up -d --build
```

8. Check status and logs:

```bash
docker compose -f deploy/docker-compose.api.yml ps
docker compose -f deploy/docker-compose.web.yml ps
docker compose -f deploy/docker-compose.api.yml logs -f
docker compose -f deploy/docker-compose.web.yml logs -f
```

9. Copy `deploy/nginx.site.conf.example` to an Nginx site config and keep the
   upstreams as:
   - `/` -> `127.0.0.1:3000`
   - `/goapi/` -> `127.0.0.1:8080`
10. Reload Nginx.
11. Add TLS with Certbot if needed.

## Verify

- Open `http://124.223.57.73`
- Open `http://124.223.57.73/goapi/api/blogs`

This deployment path does not affect local development. Your local `.env`,
`pnpm dev`, and local Go service can remain unchanged.
