# Interview Assistant – LandKI Demo

AI-powered interview companion for **Alaa Mashta**. This repo contains the FastAPI backend, Vite/React widget, dashboard, and knowledge base that power the public demo embedded at `https://landki.com/interview/` (and `/interview/dashboard/`).

The assistant mirrors Alaa's profile and answers in real time via OpenAI Agent Builder + ChatKit. Escalations are stored locally so Alaa can follow up with real people from the dashboard.

## Repository structure

- `server.py` – FastAPI service for health checks, ChatKit session bootstrap, escalation CRUD, and admin utilities (`/interview/api/...`).
- `frontend/` – Vite + React codebase for the embedded widget (`src/App.jsx`) and the admin dashboard (`src/dashboard/`).
- `_logs/` – Runtime JSONL logs (chat + feedback) born at runtime and ignored by Git.
- `_backups/` – Historical snapshots of frontend/backend files kept instead of deleting older iterations.
- `Knowledge Base v5.1. – Interview Assistant.md` – Canonical design + persona document used by the OpenAI workflow.
- [`REPO_STRUCTURE.md`](REPO_STRUCTURE.md) – Expanded tree of every directory and key file for quick onboarding (**see this file for the full breakdown**).

## Getting started (local dev)

### Prerequisites

- Python **3.10+** (FastAPI + SQLAlchemy code uses modern typing).
- Node.js **20+** (Vite 7 and React 19 requirements) with npm 10.
- OpenAI Agent Builder workflow + API keys (never committed; supply them via `.env`).

### Backend quick start

```bash
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\\Scripts\\activate
pip install -r requirements.txt
cp .env.example .env
# fill in OPENAI_* keys, CHATKIT ids, ADMIN_TOKEN, ALLOWED_ORIGINS, etc.
uvicorn server:app --reload --host 0.0.0.0 --port 3001
```

Key details:

- `server.py` loads env vars via `python-dotenv` and exposes all endpoints under `/interview/api/...`.
- `ADMIN_TOKEN` gates admin endpoints (logs, ticket list, status changes). Without it, admin routes return 503/401.
- `OPENAI_API_KEY`, `OPENAI_PROJECT_ID`, `OPENAI_WORKFLOW_ID`, and `OPENAI_DOMAIN_PUBLIC_KEY` are required for ChatKit session bootstrap.
- `escalations.db` (SQLite) and `_logs/` are created automatically; both stay local and are gitignored.

### Frontend quick start

```bash
cd frontend
npm install
npm run dev
```

- Vite serves `http://localhost:5173/interview/` by default (`vite.config.js` sets `base: '/interview/'`).
- The ChatKit widget fetches client secrets from `VITE_CHATKIT_API_URL` (defaults to the backend's `/interview/api/chatkit` route when the env var is unset).
- Escalation actions post directly to `/interview/api/escalations` (see `src/chatkit/escalationPayload.ts`). Ensure your dev server proxies to the running FastAPI instance or run both on the same host.

### Frontend ↔ Backend contract

- ChatKit session bootstrap: `POST /interview/api/chatkit/session` returns a client secret, domain public key, and metadata consumed by `chatKitOptions`.
- Escalations: widget/tool calls send sanitized payloads to `POST /interview/api/escalations`, which persists them via SQLAlchemy and responds with the ticket record.
- Dashboard API: React dashboard fetches `GET /interview/api/escalations` and uses `PATCH /interview/api/escalations/{id}/status` to mark tickets as `offen` or `erledigt` (requires the `x-admin-token` header matching `ADMIN_TOKEN`).

## Escalations & Dashboard

- FastAPI models (see `server.py`, lines ~90–180) define the `EscalationTicket` schema backed by `escalations.db`.
- Widget & ChatKit client tools leverage `frontend/src/chatkit/escalationPayload.ts` to sanitize inputs before hitting the backend.
- The dashboard UI under `frontend/src/dashboard/AdminDashboardApp.jsx` surfaces open tickets, allows filtering, and calls the admin endpoints with the configured token.
- `_logs/` is tailed via `/interview/api/admin/logs` for auditability; `/interview/api/admin/stats` exposes basic counters for the dashboard to plot.

## Production / Deployment overview

- The Hetzner VM runs this repo behind Nginx; FastAPI serves at `/interview/api/*` and also mounts `frontend/dist` for `/interview/` and `/interview/dashboard/`.
- Deployments build the frontend (`npm run build`) so Vite outputs land in `frontend/dist/` (served statically by FastAPI/Nginx) while the backend continues running via systemd or a process manager.
- Secrets (`.env`, database contents, logs) stay on the server only. The public GitHub repo contains code, templates, and documentation—never real API keys, client secrets, or production databases.
- Escalations and dashboard actions operate on the local SQLite database; swap it for Postgres/MySQL if multi-instance scaling is required.

## Live demo

The production instance is embedded at **https://landki.com/interview/** with the admin dashboard mirrored at `https://landki.com/interview/dashboard/`. This repository is the canonical source for that demo build.

## License / Usage

This is proprietary demo code authored by **Alaa Mashta**. It is published for transparency, learning, and portfolio review only and is **not** licensed for commercial reuse without written permission.
