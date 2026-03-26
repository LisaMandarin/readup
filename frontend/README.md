# ReadUp Frontend

This is the **frontend** for the ReadUp project, built with:

- **React + TypeScript + Vite**
- **Tailwind CSS** for utility‑first styling
- **Ant Design (antd)** for UI components

It is intended to work together with the **FastAPI** backend in `../backend`.

---

## Prerequisites

- Node.js 20 (or a recent 20.x version)
- npm (comes with Node)

For the backend (optional but recommended for full functionality), see the backend `README.md`.

---

## Install dependencies

From the project root:

```bash
cd frontend
cp .env.example .env
npm install
```

Then edit `.env` and replace the example values with your real frontend environment variables.

On Windows PowerShell, use `Copy-Item .env.example .env` instead of `cp`.

---

## Run the frontend dev server

```bash
cd frontend
npm run dev
```

By default Vite runs at:

- `http://localhost:5173`

You should see the ReadUp landing page with Ant Design components and Tailwind styling.  
If the backend is also running, the home page will show whether the frontend can reach the backend API and whether the backend can reach the database.

---

## Building for production

```bash
cd frontend
npm run build
```

This outputs the production build into the `dist` directory.

To preview the production build locally:

```bash
npm run preview
```

## Environment variables

- `VITE_API_BASE_URL`: backend API base URL
- `VITE_SUPABASE_URL`: Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Supabase anon key

For Vercel production, set these in the Vercel dashboard instead of creating a `.env` file on the server.
