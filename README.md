# EduFind — College Discovery Platform

## LIVE: [EduFind](https://nextgenedufind.vercel.app/)

EduFind is a production-oriented college discovery and decision-making platform focused on Indian higher education. It pairs a robust, query-efficient college data model and UX (search, detail pages, compare, saved items) with a grounded AI Counselor powered by Gemini (Gemini 2.5 Flash) that provides personalized shortlists, cutoff safety assessments, and follow-up guidance.

This repository contains the full Next.js App Router application used for the internship demo and a production-ready reference implementation of the described features.

## Key Features

- College listing with multi-dimensional filters, full-text search, and cursor-based pagination
- Rich college detail pages (ISR with 60s revalidation) showing courses, placements, and reviews
- Side-by-side comparison (up to 3 colleges) persisted to `localStorage` via a Zustand store
- Authentication with JWT + refresh token rotation and a user dashboard for saved items
- AI Counselor (/counselor): streaming Gemini-powered chat grounded using a RAG-lite context from the real database

## Tech Stack

- Next.js 14 (App Router) — React Server Components + client components
- TypeScript, Tailwind CSS, Shadcn UI primitives
- Prisma ORM + PostgreSQL (Neon)
- Gemini (Google) via server-side AI SDK for streaming responses
- Upstash Redis for rate-limiting and short-lived caches
- Zustand for small client state (compare, auth memory cache)

## Repo Layout (important paths)

- `app/` — Next.js routes and layouts (landing, `/colleges`, `/compare`, `/counselor`, `/dashboard`)
- `components/` — UI components and domain composites (CollegeCard, CounselorChat)
- `lib/` — helpers: `prisma.ts`, `gemini.ts`, `auth.ts`, `validations.ts`
- `prisma/` — `schema.prisma` and seeds
- `app/api/ai/counsel/route.ts` — streaming Gemini endpoint
- `app/api/ai/counsel/history/route.ts` — per-user chat history API (requires migration)

## Local Development — Quickstart

Prerequisites:

- Node 18+ / npm
- PostgreSQL (or Neon) — make a `DATABASE_URL`
- Upstash Redis (optional for rate-limiting) — `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`
- Gemini / Google AI credentials (see notes below)

1. Install dependencies

```bash
npm install
# if you added new deps during development
npm install react-markdown remark-gfm
```

2. Create a `.env` at the project root with the required variables (example below).

3. Run Prisma migrations and generate the client

```bash
npx prisma migrate dev -n init
npx prisma generate
```

If you added the counselor chat history model in `prisma/schema.prisma` after cloning, run:

```bash
npx prisma migrate dev -n add-counselor-history
npx prisma generate
```

4. Start the dev server

```bash
npm run dev
```

Open http://localhost:3000

## Environment Variables

At minimum add the following to `.env`:

- `DATABASE_URL` — PostgreSQL connection string (Neon recommended for serverless)
- `NEXT_PUBLIC_SITE_URL` — e.g. `http://localhost:3000`
- `JWT_SECRET` — long random secret for signing access tokens
- `REFRESH_TOKEN_SECRET` — secret or key used to sign/validate refresh tokens
- `UPSTASH_REDIS_REST_URL` — (optional) Upstash REST URL for rate-limiter
- `UPSTASH_REDIS_REST_TOKEN` — (optional) Upstash REST token
- `GOOGLE_API_KEY` or `GOOGLE_APPLICATION_CREDENTIALS` — credentials for Gemini / Google AI SDK (depending on your SDK setup)

Note: variable names may differ slightly depending on how you provision Gemini/Google credentials. Check `lib/gemini.ts` and your AI SDK configuration for the exact environment names expected.

## Prisma & Database Notes

- The Prisma schema models include `College`, `Course`, `PlacementStat`, `User`, `SavedItem`, `Review`, and `RefreshToken`.
- If you add new models (for example, counselor chat history), create and apply a migration with `npx prisma migrate dev -n <name>` and run `npx prisma generate`.
- To seed the DB (if `prisma/seed.ts` exists), run `node prisma/seed.js` or the seed command defined in `package.json`.

## AI Counselor — important operational notes

- The AI Counselor uses a RAG-lite approach: server-side code queries the database for the top ~20 matching colleges for the user's profile, then injects that structured context into the Gemini prompt so recommendations are grounded in real data.
- The streaming AI endpoint is `POST /api/ai/counsel` and returns a streaming text response. The frontend consumes the stream and renders tokens as they arrive.
- Common troubleshooting:
	- Error "Module not found: ai/react": the `ai` SDK used in this project does not export `./react` in some versions. Do not import `ai/react`. The implemented approach uses server-side `streamText(...).toTextStreamResponse()` and a manual fetch reader on the client.
	- If AI responses appear as raw markdown, ensure `react-markdown` and `remark-gfm` are installed and `CounselorChat` renders markdown client-side.

## Rate Limiting & Security

- Upstash Redis enforces sliding-window rate limits: default API routes (~100 req/min/IP), AI routes (~10 req/hour/user). Adjust values in the rate-limiter config.
- Passwords are hashed with bcrypt (cost factor 12). Refresh tokens are rotated and stored server-side.
- All API inputs have Zod schemas; validation failures return structured 400 responses.

## Deployment

- Vercel is the recommended platform (App Router is fully supported). Before deployment:
	- Add all environment variables in the Vercel project settings
	- Run `npx prisma migrate deploy` as part of your deploy process or use a provider-managed DB
	- Add a bundle analyzer step in CI to catch large server/client imports

## Commands

```bash
# dev
npm run dev

# build
npm run build

# start (production)
npm run start

# prisma
npx prisma migrate dev -n <name>
npx prisma generate
```

## Troubleshooting — quick checklist

- Missing AI credentials → verify `GOOGLE_API_KEY` / `GOOGLE_APPLICATION_CREDENTIALS` and permissions.
- `ai/react` import error → remove usage and use server streaming as implemented.
- Missing chat history → run the migration that adds the counselor history models and `npx prisma generate`.
- Base UI console warnings about native buttons → add `nativeButton={false}` to `Button` usages that render non-`button` elements (Link render prop).

## Contributing

- Follow the existing component hierarchy: Shadcn primitives → domain composites → page layouts.
- Add Zod validation for any new API route inputs and tests where appropriate.

## License & Credits

This project was authored as an internship demo by Sahil (Full Stack Engineer). Check the repo owner for licensing preferences and attribution.




