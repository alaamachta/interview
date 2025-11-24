# Interview Assistant Repo Structure

Dies ist der Code- und Dokumentationsstand der Interview Assistant Demo, die auf https://landki.com/interview/ und /interview/dashboard/ eingebettet ist.

## Übersicht

```
/var/www/landki/interview
├── server.py                      # FastAPI backend + escalation API
├── requirements.txt               # Python backend dependencies
├── .env.example                   # Template for backend + widget secrets
├── frontend/                      # Vite + React UI & ChatKit widget/dashboard
│   ├── src/
│   │   ├── App.jsx                # Landing page ChatKit wrapper
│   │   ├── chatkit/               # Widget config + escalation payload helpers
│   │   └── dashboard/             # React dashboard for escalation review
│   ├── index.html                 # Root app entry served at /interview/
│   ├── dashboard.html             # Standalone dashboard build entry
│   └── dist/                      # Production build artifacts (Vite)
├── Knowledge Base v5.1. – Interview Assistant.md
│                                   # Canonical knowledge + persona document
├── _logs/                         # Runtime JSONL logs (chat + feedback)
├── _backups/                      # Archived legacy sources & snapshots
├── escalations.db                 # SQLite DB storing escalation tickets
├── favicon.png                    # Shared icon referenced by frontend
├── README.md                      # Public-facing project overview
└── REPO_STRUCTURE.md              # (this file) explains repo layout
```

## Wichtige Verzeichnisse und Dateien

- `server.py`
  - FastAPI application exposing health, admin, escalation, and ChatKit bootstrap endpoints.
  - Serves built frontend assets under `/interview/` when `frontend/dist` exists.
  - Uses `escalations.db` (SQLite) plus `_logs/` JSONL files for chat + feedback storage.
- `frontend/`
  - Vite + React code for the embedded Interview Assistant (`src/App.jsx`) and the admin dashboard (`src/dashboard/`).
  - `src/chatkit/` contains ChatKit options (`options.ts`) and `escalationPayload.ts` helper to format POST bodies.
  - `vite.config.js` builds both the main widget (`index.html`) and dashboard (`dashboard.html`) with base path `/interview/`.
- `_logs/`
  - Created on demand by `server.py`; collects `chat.jsonl`, `feedback.jsonl`, etc. for admin review (never committed).
- `_backups/`
  - Holds historical versions of frontend/back-end files plus `chatkit_original/` snapshots; keeps legacy records instead of deleting.
- `frontend/dist/`
  - Vite production output served by FastAPI + Nginx. Contains `assets/` bundle and `dashboard.html` for `/interview/dashboard/`.
- `Knowledge Base v5.1. – Interview Assistant.md`
  - Authoritative knowledge base feeding the OpenAI Agent Builder workflow used by ChatKit.
- `requirements.txt`
  - Python dependency pinning for FastAPI, Uvicorn, SQLAlchemy, pydantic, OpenAI SDK, and dotenv loader.
- `README.md`
  - Public documentation for setup, deployment strategy, and links to the live demo.
- `.env.example`
  - Lists all env vars required by backend + ChatKit domain allowlisting (copy to `.env` locally).
- `escalations.db`
  - SQLite database storing escalation tickets + status for the dashboard (`server.py` SQLAlchemy models).
- `_logs/`, `_backups/`, `_logs`' sister directories
  - Operational data directories retained locally but ignored in Git.

Weitere Details sind in `README.md` sowie in `Knowledge Base v5.1. – Interview Assistant.md` dokumentiert.
