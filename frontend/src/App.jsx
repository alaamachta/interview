import React from "react";
import { ChatKit, useChatKit } from "@openai/chatkit-react";
import { createChatKitOptions } from "./chatkit/options";
import "./App.css";
import {
  buildEscalationPayload,
  ESCALATION_ACTION,
  postEscalation,
} from "./chatkit/escalationPayload";
import { ESCALATION_SUCCESS_EVENT } from "./chatkit/events";

const SUCCESS_ASSISTANT_MESSAGE =
  "Ihre Nachricht wurde an Alaa gesendet.\n" +
  "Vielen\u00a0Dank! 😊\n" +
  "Wenn Sie weitere Fragen haben, können Sie sie einfach hier im Chat stellen.";

const ERROR_ASSISTANT_MESSAGE =
  "❌ Die Nachricht konnte leider nicht gesendet werden.\n" +
  "Bitte versuchen Sie es später erneut.";

const SESSION_EXPIRED_TITLE = "Die Sitzung ist abgelaufen";
const SESSION_EXPIRED_TEXT = [
  "Aus Sicherheitsgründen endet eine Unterhaltung nach ca. 10 Minuten.",
  "Ihre bisherigen Chats werden im Chatverlauf gespeichert und sind nur auf Ihrem Gerät sichtbar.",
  "Sie können dort frühere Gespräche öffnen oder mit einem neuen Chat fortfahren.",
];
const SESSION_RESTART_BUTTON = "Neuen Chat starten";
const SESSION_EXPIRY_MS = 570 * 1000;
const USER_ID_STORAGE_KEY = "landki_user_id";
const TECHNICAL_ERROR_TEXT = {
  rate_limit:
    "Aktuell gibt es ein Nutzungs-Limit oder eine kurzzeitige Begrenzung. Ihre bisherigen Nachrichten bleiben erhalten – bitte versuchen Sie es in kurzer Zeit erneut.",
  quota:
    "Aktuell gibt es ein Nutzungs-Limit oder eine kurzzeitige Begrenzung. Ihre bisherigen Nachrichten bleiben erhalten – bitte versuchen Sie es in kurzer Zeit erneut.",
  network:
    "Es ist ein technischer Fehler aufgetreten. Ihre bisherigen Nachrichten bleiben erhalten – bitte laden Sie die Seite neu oder versuchen Sie es später erneut.",
  server:
    "Es ist ein technischer Fehler aufgetreten. Ihre bisherigen Nachrichten bleiben erhalten – bitte laden Sie die Seite neu oder versuchen Sie es später erneut.",
  unknown:
    "Es ist ein technischer Fehler aufgetreten. Ihre bisherigen Nachrichten bleiben erhalten – bitte laden Sie die Seite neu oder versuchen Sie es später erneut.",
};
const SESSION_ERROR_KINDS = new Set([
  "session_expired",
  "invalid_ephemeral_key",
]);
const SESSION_ERROR_CODES = [
  "session_expired",
  "client_secret_expired",
  "client_secret_invalid",
  "client_secret_revoked",
  "invalid_ephemeral_key",
  "invalid_client_secret",
];
const RATE_LIMIT_ERROR_CODES = [
  "rate_limit_exceeded",
  "requests_rate_exceeded",
  "requests_per_minute_exceeded",
];
const QUOTA_ERROR_CODES = ["insufficient_quota", "insufficient_quota_exceeded"];
const NETWORK_ERROR_MARKERS = [
  "failed to fetch",
  "networkerror",
  "load failed",
  "network request failed",
];
const SUBMIT_TICKET_TOOL_NAME = "submit_ticket";
const SUBMIT_TICKET_ENDPOINT = "/interview/api/tools/submit_ticket";
const ESCALATION_SUCCESS_TOAST_DURATION_MS = 10000;

const generateUserId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `landki_${Math.random().toString(36).slice(2)}${Date.now()}`;
};

const getOrCreateUserId = () => {
  if (typeof window === "undefined" || !window.localStorage) {
    return null;
  }
  try {
    const existing = window.localStorage.getItem(USER_ID_STORAGE_KEY);
    if (existing && existing.trim()) {
      return existing;
    }
    const newId = generateUserId();
    window.localStorage.setItem(USER_ID_STORAGE_KEY, newId);
    return newId;
  } catch (error) {
    console.warn("[Interview] Failed to access localStorage for userId", error);
    return null;
  }
};

const pickString = (...values) => {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }
  return null;
};

const pickNumber = (...values) => {
  for (const value of values) {
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
  }
  return null;
};

const isPlainObject = (value) =>
  Boolean(value && typeof value === "object" && !Array.isArray(value));

const parseJsonValue = (value) => {
  if (typeof value !== "string") return null;
  try {
    const parsed = JSON.parse(value);
    return isPlainObject(parsed) ? parsed : null;
  } catch (error) {
    console.warn("[Interview] Failed to parse submit_ticket arguments", error);
    return null;
  }
};

const extractSubmitTicketParams = (toolCall) => {
  if (isPlainObject(toolCall?.params)) {
    return toolCall.params;
  }
  const directArguments = toolCall?.arguments ?? toolCall?.args;
  if (typeof directArguments === "string") {
    const parsed = parseJsonValue(directArguments);
    if (parsed) return parsed;
  } else if (isPlainObject(directArguments)) {
    return directArguments;
  }
  const payloadSource =
    toolCall?.params?.payload ??
    toolCall?.action?.payload ??
    toolCall?.payload ??
    null;
  if (isPlainObject(payloadSource)) {
    return payloadSource;
  }
  return null;
};

const submitTicketViaBackend = async (payload) => {
  const response = await fetch(SUBMIT_TICKET_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload ?? {}),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(
      data?.detail ?? "submit_ticket request failed"
    );
    error.status = response.status;
    error.body = data;
    throw error;
  }
  return data;
};

const isNetworkError = (error) => {
  const source = error?.error ?? error;
  if (!source) return false;
  const message = pickString(
    source?.message,
    source?.error?.message,
    source?.cause?.message
  );
  const normalizedMessage = message?.toLowerCase();
  if (!normalizedMessage) {
    return Boolean(
      source?.name === "TypeError" || source?.cause?.name === "TypeError"
    );
  }
  return NETWORK_ERROR_MARKERS.some((marker) =>
    normalizedMessage.includes(marker)
  );
};

const classifyChatError = (detail) => {
  const source = detail?.error ?? detail ?? null;
  if (!source) return "unknown";
  const status = pickNumber(
    source.status,
    source?.response?.status,
    source?.error?.status,
    source?.cause?.status,
    source?.data?.status
  );
  const rawCode = pickString(
    source.code,
    source?.error?.code,
    source?.cause?.code,
    source?.response?.data?.error?.code,
    source?.data?.error?.code,
    source?.body?.error?.code
  );
  const normalizedCode = rawCode?.toLowerCase() ?? null;
  const message = pickString(
    source.message,
    source?.error?.message,
    source?.cause?.message,
    typeof source?.body === "string" ? source.body : null,
    typeof source?.response?.body === "string" ? source.response.body : null
  );
  const normalizedMessage = message?.toLowerCase() ?? "";
  const messageHasSessionMarker = SESSION_ERROR_CODES.some(
    (marker) =>
      normalizedMessage.includes(marker) ||
      normalizedMessage.includes(marker.replace(/_/g, "-"))
  );
  if (
    status === 401 ||
    status === 403 ||
    (normalizedCode &&
      SESSION_ERROR_CODES.some((marker) =>
        normalizedCode.includes(marker)
      )) ||
    messageHasSessionMarker
  ) {
    return normalizedCode === "invalid_ephemeral_key"
      ? "invalid_ephemeral_key"
      : "session_expired";
  }
  if (
    status === 429 ||
    (normalizedCode &&
      (RATE_LIMIT_ERROR_CODES.includes(normalizedCode) ||
        normalizedCode.includes("rate_limit")))
  ) {
    if (
      normalizedCode &&
      (QUOTA_ERROR_CODES.includes(normalizedCode) ||
        normalizedCode.includes("quota"))
    ) {
      return "quota";
    }
    return "rate_limit";
  }
  if (
    normalizedCode &&
    (QUOTA_ERROR_CODES.includes(normalizedCode) ||
      normalizedCode.includes("quota"))
  ) {
    return "quota";
  }
  if (status && status >= 500) {
    return "server";
  }
  if (isNetworkError(source)) {
    return "network";
  }
  return "unknown";
};

function useHostedChatKit(baseOptions, resetNonce = 0) {
  const [status, setStatus] = React.useState("initializing");
  const [error, setError] = React.useState(null);
  const [errorDetail, setErrorDetail] = React.useState(null);
  const clientToolHandlerRef = React.useRef(null);
  const baseOptionsWithNonce = React.useMemo(() => {
    // Touch resetNonce to ensure useMemo reruns when we remount ChatKit.
    void resetNonce;
    return { ...baseOptions };
  }, [baseOptions, resetNonce]);

  const onClientTool = React.useCallback((handler) => {
    clientToolHandlerRef.current = handler;
  }, []);

  const clientToolBridge = React.useCallback((toolCall) => {
    const handler = clientToolHandlerRef.current;
    if (typeof handler === "function") {
      return handler(toolCall);
    }
    console.warn("[Interview] Received client tool call without handler", toolCall);
    return undefined;
  }, []);

  const wrappedOptions = React.useMemo(() => {
    const handleReady = (detail) => {
      setStatus("ready");
      setError(null);
      setErrorDetail(null);
      if (typeof baseOptionsWithNonce.onReady === "function") {
        baseOptionsWithNonce.onReady(detail);
      }
    };

    const handleError = (detail) => {
      const err =
        detail?.error ?? detail ?? new Error("Unbekannter ChatKit-Fehler");
      setError(err);
      setStatus("error");
      setErrorDetail(detail ?? err);
      if (typeof baseOptionsWithNonce.onError === "function") {
        baseOptionsWithNonce.onError(detail);
      }
    };

    return {
      ...baseOptionsWithNonce,
      onClientTool: clientToolBridge,
      onReady: handleReady,
      onError: handleError,
    };
  }, [baseOptionsWithNonce, clientToolBridge]);

  React.useEffect(() => {
    setStatus("initializing");
    setError(null);
    setErrorDetail(null);
  }, [resetNonce]);

  const chatkit = useChatKit(wrappedOptions);
  return {
    ...chatkit,
    status,
    error,
    lastErrorDetail: errorDetail,
    elementRef: chatkit.ref,
    onClientTool,
  };
}

const handleClientTool = async (toolCall, callbacks) => {
  const { onSuccess, onError } = callbacks ?? {};
  const params = toolCall?.params ?? {};
  const actionSource = params.action ?? toolCall?.action ?? {};
  const payloadSource = actionSource.payload ?? params.payload;
  const toolName =
    toolCall?.name ??
    actionSource.type ??
    toolCall?.type ??
    null;

  if (toolName === SUBMIT_TICKET_TOOL_NAME) {
    const submitPayload = extractSubmitTicketParams(toolCall);
    if (
      !submitPayload ||
      typeof submitPayload.message !== "string" ||
      typeof submitPayload.category !== "string"
    ) {
      console.warn("[Interview] submit_ticket payload missing fields", toolCall);
      throw new Error("submit_ticket payload missing required fields");
    }

    try {
      const result = await submitTicketViaBackend(submitPayload);
      return result;
    } catch (error) {
      console.error("[Interview] submit_ticket request failed", error);
      throw error;
    }
  }

  if (toolName !== ESCALATION_ACTION) {
    return undefined;
  }

  const payload = buildEscalationPayload(payloadSource, {
    source: "interview_assistant",
    language: "de",
  });
  if (!payload) {
    console.warn(
      "[Interview] Escalation payload missing required fields",
      payloadSource
    );
    if (onError) {
      await onError();
    }
    return;
  }

  try {
    const response = await postEscalation(payload);
    const body = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error(
        "[Interview] Escalation POST failed",
        response.status,
        body
      );
      if (onError) {
        await onError();
      }
      throw new Error("Escalation POST failed");
    }

    console.info("[Interview] Escalation ticket sent");
    if (onSuccess) {
      await onSuccess();
    }
    return body;
  } catch (err) {
    console.error("[Interview] Escalation POST error", err);
    if (onError) {
      await onError();
    }
    throw err;
  }
};

export default function App() {
  const [userId, setUserId] = React.useState(() => getOrCreateUserId());
  const [chatInstanceId, setChatInstanceId] = React.useState(0);
  const [sessionExpired, setSessionExpired] = React.useState(false);
  const [chatErrorKind, setChatErrorKind] = React.useState(null);
  const [isEscalationToastVisible, setIsEscalationToastVisible] =
    React.useState(false);
  const [escalationToastTimer, setEscalationToastTimer] = React.useState(null);
  const [sessionCreatedAt, setSessionCreatedAt] = React.useState(null);
  const sessionTimerRef = React.useRef(null);
  React.useEffect(() => {
    if (userId) return;
    const id = getOrCreateUserId();
    if (id) {
      setUserId(id);
    }
  }, [userId]);

  React.useEffect(() => {
    if (userId) {
      console.log("[Interview] ChatKit userId:", userId);
    }
  }, [userId]);
  const clearSessionTimer = React.useCallback(() => {
    if (typeof window === "undefined") {
      sessionTimerRef.current = null;
      return;
    }
    if (sessionTimerRef.current) {
      window.clearTimeout(sessionTimerRef.current);
      sessionTimerRef.current = null;
    }
  }, []);

  const startSessionTimer = React.useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }
    clearSessionTimer();
    const startedAt = Date.now();
    setSessionCreatedAt(startedAt);
    sessionTimerRef.current = window.setTimeout(() => {
      setSessionExpired(true);
      sessionTimerRef.current = null;
    }, SESSION_EXPIRY_MS);
  }, [clearSessionTimer]);
  const chatKitOptions = React.useMemo(
    () => createChatKitOptions(userId),
    [userId]
  );
  const chatkit = useHostedChatKit(chatKitOptions, chatInstanceId);
  const {
    status,
    error,
    control,
    elementRef,
    onClientTool,
    lastErrorDetail,
  } = chatkit;
  const showSessionExpiredBanner = sessionExpired;
  const technicalErrorMessage =
    chatErrorKind && !SESSION_ERROR_KINDS.has(chatErrorKind)
      ? TECHNICAL_ERROR_TEXT[chatErrorKind] ?? TECHNICAL_ERROR_TEXT.unknown
      : null;

  const handleRestartChat = React.useCallback(() => {
    clearSessionTimer();
    setSessionExpired(false);
    setChatErrorKind(null);
    setSessionCreatedAt(null);
    setChatInstanceId((prev) => prev + 1);
  }, [clearSessionTimer]);

  const sendAssistantMessage = React.useCallback(
    async (text) => {
      const chatkitElement = elementRef?.current ?? null;
      const messagePayload = {
        role: "assistant",
        content: [
          {
            type: "text",
            text,
          },
        ],
      };

      if (
        !chatkitElement ||
        typeof chatkitElement.sendMessage !== "function"
      ) {
        console.warn(
          "[Interview] ChatKit sendMessage API not available; skipping status message"
        );
        return;
      }

      try {
        await chatkitElement.sendMessage(messagePayload);
      } catch (err) {
        console.error(
          "[Interview] Failed to send assistant status message",
          err
        );
      }
    },
    [elementRef]
  );

  const handleEscalationTool = React.useCallback(
    (toolCall) =>
      handleClientTool(toolCall, {
        onSuccess: () => sendAssistantMessage(SUCCESS_ASSISTANT_MESSAGE),
        onError: () => sendAssistantMessage(ERROR_ASSISTANT_MESSAGE),
      }),
    [sendAssistantMessage]
  );

  React.useEffect(() => {
    onClientTool(handleEscalationTool);
  }, [onClientTool, handleEscalationTool]);

  React.useEffect(() => {
    if (!sessionCreatedAt) {
      return;
    }
    console.log(
      "[Interview] Chat session refreshed at",
      new Date(sessionCreatedAt).toISOString()
    );
  }, [sessionCreatedAt]);

  React.useEffect(() => {
    return () => {
      clearSessionTimer();
    };
  }, [clearSessionTimer]);

  React.useEffect(() => {
    if (!lastErrorDetail) {
      return;
    }
    const kind = classifyChatError(lastErrorDetail);
    setChatErrorKind(kind);
    if (SESSION_ERROR_KINDS.has(kind)) {
      setSessionExpired(true);
    }
  }, [lastErrorDetail]);

  React.useEffect(() => {
    if (status === "ready") {
      setSessionExpired(false);
      setChatErrorKind(null);
    }
  }, [status]);

  React.useEffect(() => {
    if (status !== "ready" || sessionExpired) {
      return;
    }
    startSessionTimer();
  }, [status, sessionExpired, startSessionTimer]);

  React.useEffect(() => {
    if (sessionExpired) {
      clearSessionTimer();
    }
  }, [sessionExpired, clearSessionTimer]);

  React.useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }
    const handleEscalationSuccess = () => {
      if (escalationToastTimer) {
        window.clearTimeout(escalationToastTimer);
      }
      setIsEscalationToastVisible(true);
      const timer = window.setTimeout(() => {
        setIsEscalationToastVisible(false);
        setEscalationToastTimer(null);
      }, ESCALATION_SUCCESS_TOAST_DURATION_MS);
      setEscalationToastTimer(timer);
    };

    window.addEventListener(
      ESCALATION_SUCCESS_EVENT,
      handleEscalationSuccess
    );

    return () => {
      window.removeEventListener(
        ESCALATION_SUCCESS_EVENT,
        handleEscalationSuccess
      );
      if (escalationToastTimer) {
        window.clearTimeout(escalationToastTimer);
      }
    };
  }, [escalationToastTimer]);

  return (
    <div className="app-root">
      {isEscalationToastVisible && (
        <div className="escalation-toast" role="status" aria-live="polite">
          {SUCCESS_ASSISTANT_MESSAGE.split("\n").map((line, index) => (
            <p key={`escalation-toast-line-${index}`}>{line}</p>
          ))}
        </div>
      )}
      <main className="app-main">
        {status !== "ready" && !error && (
          <div className="app-loading">
            <p>Lädt Chat-Assistent…</p>
          </div>
        )}

        <div className="chat-shell">
          <div className="chat-container">
            {technicalErrorMessage && !showSessionExpiredBanner && (
              <div
                className="chat-status-toast"
                role="status"
                aria-live="polite"
              >
                <p>{technicalErrorMessage}</p>
              </div>
            )}
            {showSessionExpiredBanner && (
              <div className="chat-error-overlay">
                <h3>{SESSION_EXPIRED_TITLE}</h3>
                {SESSION_EXPIRED_TEXT.map((line, index) => (
                  <p key={`session-expired-line-${index}`}>{line}</p>
                ))}
                <button type="button" onClick={handleRestartChat}>
                  {SESSION_RESTART_BUTTON}
                </button>
              </div>
            )}
            {!showSessionExpiredBanner && (
              <ChatKit
                key={chatInstanceId}
                ref={elementRef}
                control={control}
                className="chatkit-element"
                data-theme="dark"
                style={{ height: "100%", width: "100%" }}
                data-color-scheme="dark"
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
