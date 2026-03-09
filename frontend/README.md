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
npm install
```

---

## Run the frontend dev server

```bash
cd frontend
npm run dev
```

By default Vite runs at:

- `http://localhost:5173`

You should see the ReadUp landing page with Ant Design components and Tailwind styling.  
If the backend is also running, the **“Call Backend Health Check”** button on the page will call the FastAPI `/health` endpoint.

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
