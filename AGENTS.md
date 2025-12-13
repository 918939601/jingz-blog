# Repository Guidelines

## Project Structure & Module Organization
- `app/`: Next.js App Router pages, layouts, and API routes; treat as the primary entry point.
- `components/` and `modules/`: Reusable UI and feature slices; prefer composing from `components` before adding to `modules`.
- `config/`: Constants, metadata, and UI assets (img/svg); update site copy here first.
- `lib/` and `hooks/`: Cross-cutting utilities and React hooks; keep side effects isolated.
- `prisma/`: Database schema and migrations; run Prisma commands from the repo root.
- `public/`: Static assets; favor WebP for large images.

## Build, Test, and Development Commands
- `pnpm dev` (or `pnpm dev:no`): Run the Next.js dev server (Turbopack by default).
- `pnpm build`: Production build; clears `.next/cache` via `prebuild`.
- `pnpm start`: Serve the production build locally.
- `pnpm lint` / `pnpm lint:es[:fix]`: Next.js/ESLint checks (optionally auto-fix).
- `pnpm ts:check`: TypeScript type-check without emit.
- `pnpm prisma generate` and `npx prisma migrate dev --name <tag>`: Refresh client and create migrations when schema changes.

## Coding Style & Naming Conventions
- TypeScript/React with functional components; prefer server components unless client-only is needed.
- CSS via Tailwind; keep class lists concise and use `tailwind-merge` for variants.
- Use PascalCase for components, camelCase for variables/functions, kebab-case for files; co-locate component styles/utilities in the same folder when scoped.
- Run `pnpm lint` and `pnpm ts:check` before pushing; do not commit lint/type errors.

## Testing Guidelines
- No dedicated test harness exists yet; add lightweight unit or integration tests alongside features when feasible.
- Name tests after the behavior under test (e.g., `component-name.behavior.test.tsx`).
- For data/model changes, validate Prisma migrations locally and ensure seeded data (if any) still works.

## Commit & Pull Request Guidelines
- Use clear, imperative commit messages (e.g., `feat: add bio hero animation`, `fix: handle null session`).
- Scope commits narrowly: one concern per commit; include migration files when schema changes.
- Pull requests should describe the change, list commands run, and note risk areas; attach screenshots/gifs for UI changes.
- Link related issues if they exist; call out breaking changes or required env updates explicitly.

## Security & Configuration Tips
- Copy `.env.example` to `.env` (or `.env.local`) and fill required secrets before running Prisma or Next.
- Keep `AUTH_*`, `GO_API_BASE`, `REVALIDATE_SECRET`, `JWT_SECRET`, and `UPLOADTHING_TOKEN` private; never commit `.env*` files.
- If adding new environment keys, document them in `README.md` and update `.env.example`.
