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
