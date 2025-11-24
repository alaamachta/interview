#!/usr/bin/env python3
"""
Interview Assistant API

Exposes:
- GET /interview/api/health                     -> health check
- GET /interview/api/admin/logs                 -> tail JSONL logs (chat|feedback)
- GET /interview/api/admin/stats                -> simple counters
- POST /interview/api/admin/feedback            -> append feedback to JSONL
- POST /interview/api/chatkit/session           -> client token/session bootstrap (domain-allowlist mode)

Notes:
- Never exposes OpenAI API keys to the client.
- CORS restricted to ALLOWED_ORIGINS.
"""
import json
import os
from datetime import datetime, timedelta
from enum import Enum
from pathlib import Path
from typing import Generator, List, Optional
import logging

from fastapi import Depends, FastAPI, HTTPException, Header, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
from sqlalchemy import Boolean, Column, DateTime, Integer, String, Text, create_engine, select
from sqlalchemy.orm import Session, declarative_base, sessionmaker
from dotenv import load_dotenv
import openai

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Minimal config
ADMIN_TOKEN = os.getenv("ADMIN_TOKEN")  # Optional; if unset, auth is disabled
ALLOWED_ORIGINS = [o.strip() for o in (os.getenv("ALLOWED_ORIGINS", "").split(",")) if o.strip()]
PORT = int(os.getenv("PORT", "3001"))
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_WORKFLOW_ID = os.getenv("OPENAI_WORKFLOW_ID") or os.getenv("OPENAI_WORKFLOW_ID") or os.getenv("OPENAI_WORKFLOW_ID")
OPENAI_PROJECT_ID = os.getenv("OPENAI_PROJECT_ID")
DOMAIN_PUBLIC_KEY = os.getenv("OPENAI_DOMAIN_PUBLIC_KEY") or os.getenv("DOMAIN_PUBLIC_KEY")

# Initialize OpenAI client
if OPENAI_API_KEY:
    openai.api_key = OPENAI_API_KEY
    client = openai.OpenAI(api_key=OPENAI_API_KEY)
else:
    client = None
    logger.warning("OPENAI_API_KEY not set - chat functionality will be disabled")

# Paths
BASE_DIR = Path(__file__).parent
LOGS_DIR = BASE_DIR / "_logs"
LOGS_DIR.mkdir(exist_ok=True)

ADMIN_HEADER = "x-admin-token"
DATABASE_FILE = BASE_DIR / "escalations.db"
FRONTEND_DIST = BASE_DIR / "frontend" / "dist"
ASSETS_DIR = FRONTEND_DIST / "assets"
DASHBOARD_HTML = FRONTEND_DIST / "dashboard.html"

# App
app = FastAPI(title="Interview API", version="1.2.0")

if ASSETS_DIR.exists():
    app.mount("/interview/assets", StaticFiles(directory=ASSETS_DIR), name="assets")
engine = create_engine(
    f"sqlite:///{DATABASE_FILE}",
    connect_args={"check_same_thread": False},
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class EscalationStatus(str, Enum):
    offen = "offen"
    erledigt = "erledigt"


class EscalationTicket(Base):
    __tablename__ = "escalations"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    title = Column(String(255), nullable=False)
    category = Column(String(128), nullable=False)
    message = Column(Text, nullable=False)
    language = Column(String(16), nullable=False)
    name = Column(String(128), nullable=True)
    email = Column(String(192), nullable=True)
    allow_contact = Column(Boolean, nullable=False, default=False)
    conversation_id = Column(String(128), nullable=True)
    source = Column(String(64), nullable=False, default="interview_assistant")
    version = Column(Integer, nullable=False, default=1)
    status = Column(String(32), nullable=False, default=EscalationStatus.offen.value)


class EscalationCreate(BaseModel):
    title: str
    category: str
    message: str
    language: str = Field(default="de")
    source: str = Field(default="interview_assistant")
    version: int = Field(default=1)
    name: Optional[str] = None
    email: Optional[str] = None
    allow_contact: bool = False
    conversation_id: Optional[str] = None


class EscalationResponse(BaseModel):
    id: int
    created_at: datetime
    title: str
    category: str
    message: str
    language: str
    name: Optional[str] = None
    email: Optional[str] = None
    allow_contact: bool
    conversation_id: Optional[str] = None
    source: str
    version: int
    status: EscalationStatus

    class Config:
        orm_mode = True


class EscalationStatusUpdate(BaseModel):
    status: EscalationStatus


Base.metadata.create_all(engine)


def get_db() -> Generator[Session, None, None]:
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


def sanitize_text(value: Optional[str]) -> Optional[str]:
    if value is None:
        return None
    trimmed = value.strip()
    return trimmed or None


def admin_required(x_admin_token: Optional[str] = Header(None)) -> str:
    if not ADMIN_TOKEN:
        raise HTTPException(status_code=503, detail="Admin token not configured")
    if x_admin_token != ADMIN_TOKEN:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return x_admin_token

# CORS
if ALLOWED_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"]
    )

@app.get("/interview/api/health")
async def health():
    return {
        "status": "ok",
        "service": "interview-api",
        "time": datetime.utcnow().isoformat() + "Z",
        "workflow_configured": bool(OPENAI_WORKFLOW_ID),
    }

@app.get("/interview/api/admin/logs")
async def get_logs(
    x_admin_token: Optional[str] = Header(None),
    log_type: str = "chat",
    limit: int = 100
):
    """Return the last N log entries from the JSONL file."""
    if ADMIN_TOKEN and x_admin_token != ADMIN_TOKEN:
        raise HTTPException(status_code=401, detail="Unauthorized")

    log_file = LOGS_DIR / f"{log_type}.jsonl"
    if not log_file.exists():
        return {"entries": []}

    entries = []
    try:
        with open(log_file, "r", encoding="utf-8") as f:
            lines = f.readlines()
            for line in reversed(lines[-limit:]):
                if line.strip():
                    entries.append(json.loads(line))
    except Exception as e:
        logger.error(f"Failed to read logs: {e}")
        raise HTTPException(status_code=500, detail="Failed to read logs")

    return {"entries": entries}

@app.get("/interview/api/admin/stats")
async def get_stats(x_admin_token: Optional[str] = Header(None)):
    """Return simple counters for chats and feedback (total and today)."""
    if ADMIN_TOKEN and x_admin_token != ADMIN_TOKEN:
        raise HTTPException(status_code=401, detail="Unauthorized")

    stats = {
        "total_chats": 0,
        "total_feedback": 0,
        "today_chats": 0,
        "today_feedback": 0
    }

    today = datetime.now().date().isoformat()

    # Count chat logs
    chat_log = LOGS_DIR / "chat.jsonl"
    if chat_log.exists():
        with open(chat_log, "r", encoding="utf-8") as f:
            for line in f:
                if line.strip():
                    stats["total_chats"] += 1
                    if today in line:
                        stats["today_chats"] += 1

    # Count feedback logs
    feedback_log = LOGS_DIR / "feedback.jsonl"
    if feedback_log.exists():
        with open(feedback_log, "r", encoding="utf-8") as f:
            for line in f:
                if line.strip():
                    stats["total_feedback"] += 1
                    if today in line:
                        stats["today_feedback"] += 1

    return stats


@app.get("/interview/api/admin/ping")
async def admin_ping(_: str = Depends(admin_required)):
    """Simple admin probe to validate the provided token."""
    return {"ok": True}


@app.get("/interview/dashboard/", include_in_schema=False)
async def serve_dashboard():
    if not DASHBOARD_HTML.exists():
        raise HTTPException(status_code=404, detail="Dashboard build not found")
    return FileResponse(DASHBOARD_HTML, media_type="text/html")


@app.post("/interview/api/escalations")
async def create_escalation(payload: EscalationCreate, db: Session = Depends(get_db)):
    """Receive escalation tickets from ChatKit message actions."""
    logger.info(
        "Escalation payload received: %s",
        payload.dict(exclude_none=True),
    )
    ticket = EscalationTicket(
        title=sanitize_text(payload.title) or payload.title,
        category=sanitize_text(payload.category) or payload.category,
        message=sanitize_text(payload.message) or payload.message,
        language=sanitize_text(payload.language) or payload.language,
        name=sanitize_text(payload.name),
        email=sanitize_text(payload.email),
        allow_contact=bool(payload.allow_contact),
        conversation_id=sanitize_text(payload.conversation_id),
        source=sanitize_text(payload.source) or "interview_assistant",
        version=payload.version or 1,
        status=EscalationStatus.offen.value,
    )

    try:
        db.add(ticket)
        db.commit()
        db.refresh(ticket)
        logger.info(f"Escalation ticket stored: id={ticket.id} category={ticket.category}")
    except Exception as process_error:
        logger.exception("Failed to store escalation ticket")
        raise HTTPException(status_code=500, detail="Failed to store escalation ticket") from process_error

    return {"ok": True, "ticket_id": ticket.id}


@app.get("/interview/api/escalations", response_model=List[EscalationResponse])
async def list_escalations(
    period: str = "7d",
    category: Optional[str] = None,
    db: Session = Depends(get_db),
    _: str = Depends(admin_required),
):
    """List escalation tickets for admins."""
    periods = {
        "24h": timedelta(hours=24),
        "7d": timedelta(days=7),
        "all": None,
    }

    normalized_period = (period or "7d").lower()
    if normalized_period not in periods:
        raise HTTPException(status_code=400, detail="Invalid period")

    query = select(EscalationTicket)
    threshold = periods[normalized_period]
    if threshold:
        query = query.where(EscalationTicket.created_at >= datetime.utcnow() - threshold)

    if category:
        query = query.where(EscalationTicket.category == category)

    query = query.order_by(EscalationTicket.created_at.desc())
    results = db.execute(query).scalars().all()
    return results


@app.patch("/interview/api/escalations/{ticket_id}/status", response_model=EscalationResponse)
async def update_escalation_status(
    ticket_id: int,
    payload: EscalationStatusUpdate,
    db: Session = Depends(get_db),
    _: str = Depends(admin_required),
):
    ticket = db.get(EscalationTicket, ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    ticket.status = payload.status.value
    db.add(ticket)
    db.commit()
    db.refresh(ticket)

    return ticket

@app.post("/interview/api/admin/feedback")
async def submit_feedback(request: Request, x_admin_token: Optional[str] = Header(None)):
    """Append feedback entry to feedback.jsonl; auth optional via ADMIN_TOKEN.

    Expected JSON body example:
    {
      "session_id": "abc123",
      "rating": 5,               # or "thumbs_up"/"thumbs_down"
      "comment": "...",
      "message_id": "msg_...",  # optional
      "metadata": { ... }        # optional
    }
    """
    # Feedback is allowed without admin token; if you want to restrict, uncomment below
    # if ADMIN_TOKEN and x_admin_token != ADMIN_TOKEN:
    #     raise HTTPException(status_code=401, detail="Unauthorized")

    try:
        payload = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON")

    entry = {
        "type": "feedback",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "session_id": payload.get("session_id") or payload.get("sessionId"),
        "rating": payload.get("rating"),
        "comment": payload.get("comment"),
        "message_id": payload.get("message_id") or payload.get("messageId"),
        "metadata": payload.get("metadata") or {},
        "user_agent": request.headers.get("user-agent"),
        "ip": request.client.host if request.client else None,
    }

    feedback_log = LOGS_DIR / "feedback.jsonl"
    try:
        with open(feedback_log, "a", encoding="utf-8") as f:
            f.write(json.dumps(entry, ensure_ascii=False) + "\n")
    except Exception as e:
        logger.error(f"Failed to write feedback: {e}")
        raise HTTPException(status_code=500, detail="Failed to write feedback")

    return {"ok": True}

@app.post("/interview/api/chatkit/session")
async def chatkit_session():
    """Create a ChatKit session using the official ChatKit API.
    
    This endpoint follows the pattern from openai-chatkit-starter-app.
    It creates a session with the OpenAI ChatKit API for the workflow.
    """
    if not OPENAI_API_KEY:
        raise HTTPException(status_code=500, detail="Missing OPENAI_API_KEY")
    
    workflow_id = OPENAI_WORKFLOW_ID or "wf_6910af26c670819097b24c11ebbe0b380a5bfa9945431f22"
    
    if not workflow_id:
        raise HTTPException(status_code=400, detail="Missing workflow id")
    
    try:
        # Call OpenAI ChatKit Sessions API
        chatkit_api_base = "https://api.openai.com"
        url = f"{chatkit_api_base}/v1/chatkit/sessions"
        
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {OPENAI_API_KEY}",
            "OpenAI-Beta": "chatkit_beta=v1",
        }
        
        # Add domain public key to headers if available
        if DOMAIN_PUBLIC_KEY:
            headers["OpenAI-Domain-Public-Key"] = DOMAIN_PUBLIC_KEY
        
        # Generate a user ID (in production, this should be a real user ID)
        import uuid
        user_id = str(uuid.uuid4())
        
        payload = {
            "workflow": {"id": workflow_id},  # Use latest/default version
            "user": user_id,
            "chatkit_configuration": {
                "file_upload": {
                    "enabled": False
                }
            }
        }
        
        logger.info(f"Creating ChatKit session for workflow: {workflow_id}")
        
        import httpx
        async with httpx.AsyncClient(timeout=30.0) as http_client:
            response = await http_client.post(url, headers=headers, json=payload)
            
            if response.status_code != 200:
                logger.error(f"ChatKit session creation failed: {response.status_code} - {response.text}")
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"ChatKit API error: {response.text}"
                )
            
            session_data = response.json()
            logger.info(f"ChatKit session created successfully")
            
            return session_data
            
    except httpx.HTTPError as e:
        error_msg = f"HTTP error creating ChatKit session: {str(e)}"
        logger.error(error_msg, exc_info=True)
        raise HTTPException(status_code=500, detail=error_msg)
    except HTTPException:
        raise
    except Exception as e:
        error_msg = f"Error creating ChatKit session: {str(e) or repr(e)}"
        logger.error(error_msg, exc_info=True)
        raise HTTPException(status_code=500, detail=error_msg)


@app.post("/interview/api/log")
async def ingest_log(request: Request):
    """Ingest generic client log events (chat + telemetry).

    Body is stored as-is with server-side timestamp. This endpoint is
    intentionally permissive to allow capturing events posted by ChatKit
    via postMessage hooks from the frontend without exposing secrets.
    """
    try:
        payload = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON")

    entry = {
        "type": payload.get("type") or payload.get("event") or "event",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        **payload,
        "user_agent": request.headers.get("user-agent"),
        "ip": request.client.host if request.client else None,
    }

    chat_log = LOGS_DIR / "chat.jsonl"
    try:
        with open(chat_log, "a", encoding="utf-8") as f:
            f.write(json.dumps(entry, ensure_ascii=False) + "\n")
    except Exception as e:
        logger.error(f"Failed to write chat log: {e}")
        raise HTTPException(status_code=500, detail="Failed to write log")

    return {"ok": True}


@app.post("/interview/api/feedback")
async def public_feedback(request: Request):
    """Public feedback endpoint (no admin token required).

    Expected JSON body:
    {
      "session_id": "...",          # optional
      "user_question": "...",       # original user prompt (optional)
      "assistant_reply": "...",     # assistant answer snippet (optional)
      "category": "out_of_scope" | "general" | "error",  # optional tag
      "comment": "..."              # freeform user comment
    }
    """
    try:
        payload = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON")

    entry = {
        "type": "public_feedback",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "session_id": payload.get("session_id") or payload.get("sessionId"),
        "user_question": payload.get("user_question"),
        "assistant_reply": payload.get("assistant_reply"),
        "category": payload.get("category") or "general",
        "comment": payload.get("comment"),
        "user_agent": request.headers.get("user-agent"),
        "ip": request.client.host if request.client else None,
    }

    feedback_log = LOGS_DIR / "feedback.jsonl"
    try:
        with open(feedback_log, "a", encoding="utf-8") as f:
            f.write(json.dumps(entry, ensure_ascii=False) + "\n")
    except Exception as e:
        logger.error(f"Failed to write public feedback: {e}")
        raise HTTPException(status_code=500, detail="Failed to write feedback")

    return {"ok": True}


@app.get("/interview/api/feedback/list")
async def list_public_feedback(limit: int = 100):
    """List recent public feedback entries (most recent first)."""
    feedback_log = LOGS_DIR / "feedback.jsonl"
    if not feedback_log.exists():
        return {"entries": []}
    entries = []
    try:
        with open(feedback_log, "r", encoding="utf-8") as f:
            lines = f.readlines()
        for line in reversed(lines[-limit:]):
            if line.strip():
                try:
                    obj = json.loads(line)
                    if obj.get("type") in ("public_feedback", "feedback"):
                        entries.append(obj)
                except Exception:
                    continue
    except Exception as e:
        logger.error(f"Failed to read feedback list: {e}")
        raise HTTPException(status_code=500, detail="Failed to read feedback")
    return {"entries": entries}


if __name__ == "__main__":
    import uvicorn
    # Single uvicorn run (duplicate removed)
    uvicorn.run(app, host="127.0.0.1", port=PORT, log_level="info")
