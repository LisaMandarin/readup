# ReadUp Frontend

ReadUp frontend is built with React 19, TypeScript, Vite, Tailwind CSS, and Ant Design.

It currently provides:

- sign up, email verification, sign in, and sign out flows
- protected app routing
- passage translation into supported target languages
- sentence-level word lookup UI
- comprehension check UI
- translation session history and reload/delete actions

This app is intended to run against the FastAPI backend in `../backend`.

## Prerequisites

- Node.js `>=20.19.0` or `>=22.12.0`
- npm

## Install

```bash
cd frontend
npm install
```

Create a local `.env` file in `frontend/` and set:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Notes:

- `VITE_API_BASE_URL` is used by the shared Axios client for all backend requests.
- `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are still required because `src/supabaseClient.ts` exists in the project, even though the active auth flow now goes through the backend `/auth` endpoints.

## Run locally

```bash
cd frontend
npm run dev
```

Default dev URL:

- `http://localhost:5173`

The main app route `/` is protected. Unauthenticated users are redirected to `/signin`.

## Build

```bash
cd frontend
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Current frontend structure

- `src/App.tsx`: routing and auth guard setup
- `src/context/AuthContext.tsx`: JWT persistence and `/auth/me` bootstrap
- `src/pages/Home.tsx`: translation workflow and session loading
- `src/api/translate.ts`: translation and supported-language requests
- `src/api/lookup.ts`: word lookup requests
- `src/api/session.ts`: session history/detail/delete requests
- `src/api/comprehension.ts`: summary evaluation request

## Backend expectations

The frontend expects the backend to expose at least:

- `POST /auth/signup`
- `POST /auth/verify`
- `POST /auth/resend`
- `POST /auth/signin`
- `GET /auth/me`
- `GET /api/translate/languages`
- `POST /api/translate`
- `POST /api/lookup`
- `POST /api/comprehension/`
- `GET /api/sessions`
- `GET /api/sessions/:session_id`
- delete session/sentence/lookup-result endpoints under `/api/sessions`
