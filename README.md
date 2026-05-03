# Beit Al Siyana - Monorepo Layout

This project is now split into:

- `front/` -> React + Vite frontend (deploy to Vercel)
- `back/` -> Express + MongoDB backend API (deploy to Railway)

## Local Run

### Quick run from project root

```bash
npm run dev:back
npm run dev:front
```

Or install both dependencies from root:

```bash
npm run install:all
```

### 1) Run backend

```bash
cd back
npm install
npm run dev
```

Backend runs on `http://localhost:5000`.

### 2) Run frontend

```bash
cd front
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Deployment

### Backend (Railway)

1. Deploy folder: `back`
2. Set env vars from `back/.env.example`:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN`
   - `NODE_ENV=production`
   - `CORS_ORIGIN=https://your-frontend.vercel.app`
3. Start command:

```bash
npm start
```

### Frontend (Vercel)

1. Deploy folder: `front`
2. Set env var from `front/.env.example`:
   - `VITE_API_BASE_URL=https://your-backend.up.railway.app`

`front/vercel.json` already rewrites routes to `index.html`.

## Post Deploy (Admin)

After backend is live, create/update admin account:

```bash
cd back
npm run create-admin
```

Optional seed command:

```bash
npm run seed-plans
```
