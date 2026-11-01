# SYNAPSE – AICTE Institution Intelligence & Coordination Engine

## Overview
A full‑stack prototype for the Smart India Hackathon 2026 that provides:
- Institution‑centric 360° view.
- Cross‑bureau case registry.
- Explainable overlap detection.
- Coordination workflow with audit trail.
- Secure role‑based access.

The stack:
- **Backend** – FastAPI (Python 3.12), PostgreSQL, Alembic, JWT auth.
- **Frontend** – React 18, Vite, TypeScript, Tailwind CSS, shadcn/ui.
- **Dev environment** – Docker Compose (postgres, backend, frontend).

## Quick start (development)
```bash
# 1. Clone the repository (already done in this workspace)
# 2. Copy env template and adjust if needed
cp .env.example .env

# 3. Build & start containers
docker compose up --build -d

# 4. Run migrations
docker compose exec backend alembic upgrade head

# 5. Seed synthetic data
docker compose exec backend python -m scripts.seed_data

# 6. Open the app
#    Frontend: http://localhost:5173
#    Backend health: http://localhost:8000/health
```

## Login credentials (seeded)
| Role | Email | Password |
|------|---------------------------|----------|
| System Administrator | admin@example.com | admin123 |
| Bureau Officer | officer1@example.com | officer123 |
| Reviewing Officer | reviewer@example.com | review123 |
| Coordination Officer | coord@example.com | coord123 |
| Management Viewer | viewer@example.com | viewer123 |

## Backend API
- Docs: http://localhost:8000/docs
- Auth: `POST /api/v1/auth/login` → returns access & refresh JWT.
- Users: `GET /api/v1/users/me` (auth required).
- Placeholder routes: `/api/v1/cases/ping`, `/api/v1/institutions/ping`, etc.

## Development notes
- **Database** – runs in a PostgreSQL container. Data lives in a Docker volume (`pgdata`).
- **Hot reload** – backend uses `uvicorn --reload`; frontend Vite provides live reload.
- **Testing** – see `backend/tests/` (pytest) and `frontend` (Vitest, Playwright) – not yet populated.
- **Further work** – implement full CRUD, dashboards, overlap engine, coordination workflow, audit logging, reports, CSV export, and comprehensive tests.

## License
MIT – see LICENSE file.
