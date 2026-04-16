# ISTE-CONNECTIONS-

Registration app for the Vigyaanrang event.

## Frontend

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server proxies `/api` requests to the backend on port `3001`.

## Backend

```bash
cd backend
npm install
npm run dev
```

The backend exposes:

- `GET /api/health`
- `GET /api/registrations`
- `POST /api/registrations`