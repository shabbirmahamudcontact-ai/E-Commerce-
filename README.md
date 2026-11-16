# Fokirer Bajar

A React + TypeScript storefront served by Vite and an Express API, with Tailwind CSS v4 and a JSON-backed mock marketplace database.

## Requirements

- Node.js 20.19+ or 22.12+ (required by the installed Vite version)
- npm

## Run locally

```bash
npm install
npm run dev
```

Open the URL printed by the server (usually `http://localhost:3000`). Express serves the API and mounts Vite in middleware mode, so the frontend and API share one origin.

## Scripts

- `npm run dev` — start Express with the Vite development middleware.
- `npm run build` — build the frontend into `dist/`.
- `npm start` — start Express; set `NODE_ENV=production` to serve the built frontend.
- `npm run preview` — preview the Vite build directly.
- `npm run typecheck` — run the TypeScript compiler without emitting files (`npm run lint` is an alias).

For a production-style local run, build first and then start the server with `NODE_ENV=production` set in the environment.

## Marketplace API

- `GET /api/info` — store metadata and delivery information.
- `GET /api/categories` — marketplace categories.
- `GET /api/products` — products; accepts `category`, `search`, `cyclone=true`, and `sort` query parameters.
- `GET /api/products/:id` — product details and related products.

The mock database is initialized from `data/db.json` and writes changes there. Keep a backup before resetting or editing its contents. The optional `GEMINI_API_KEY` enables the AI assistant; the store and catalog APIs do not require it.

> **Demo only:** Authentication, admin access, OTP/payment, and marketplace data are simulated. Do not use this scaffold to process real customer credentials, payments, or personal data without replacing the demo flows with production-grade services and security controls.
