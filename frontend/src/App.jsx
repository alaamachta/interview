import React from "react";
import { ChatKit, useChatKit } from "@openai/chatkit-react";
import { chatKitOptions } from "./chatkit/options";
import "./App.css";
import {
  buildEscalationPayload,
  ESCALATION_ACTION,
  postEscalation,
} from "./chatkit/escalationPayload";

const SUCCESS_ASSISTANT_MESSAGE =
  "✅ Nachricht wurde an Alaa gesendet. Vielen Dank!\n" +
  "Wenn Sie weitere Fragen haben, können Sie sie gerne stellen.";

const ERROR_ASSISTANT_MESSAGE =
  "❌ Die Nachricht konnte leider nicht gesendet werden.\n" +
  "Bitte versuchen Sie es später erneut.";

const SESSION_INACTIVE_MESSAGE =
  "Ihre Sitzung war zu lange inaktiv und wurde beendet.";
const SESSION_RESTART_PROMPT = "Bitte starten Sie den Chat neu.";
const SESSION_RESTART_BUTTON = "Chat neu starten";

function useHostedChatKit(baseOptions, resetNonce = 0) {
  const [status, setStatus] = React.useState("initializing");
  const [error, setError] = React.useState(null);
  const [clientToolHandler, setClientToolHandler] = React.useState();
  const baseOptionsWithNonce = React.useMemo(() => {
    // Touch resetNonce to ensure useMemo reruns when we remount ChatKit.
    void resetNonce;
    return { ...baseOptions };
  }, [baseOptions, resetNonce]);

  const onClientTool = React.useCallback(
    (handler) => {
      if (handler === clientToolHandler) return;
      setClientToolHandler(() => handler);
    },
    [clientToolHandler]
  );

  const wrappedOptions = React.useMemo(() => {
    const handleReady = (detail) => {
      setStatus("ready");
      setError(null);
      if (typeof baseOptionsWithNonce.onReady === "function") {
        baseOptionsWithNonce.onReady(detail);
      }
    };

    const handleError = (detail) => {
      const err =
        detail?.error ?? detail ?? new Error("Unbekannter ChatKit-Fehler");
      setError(err);
      setStatus("error");
      if (typeof baseOptionsWithNonce.onError === "function") {
        baseOptionsWithNonce.onError(detail);
      }
    };

    return {
      ...baseOptionsWithNonce,
      onClientTool: clientToolHandler,
      onReady: handleReady,
      onError: handleError,
    };
  }, [baseOptionsWithNonce, clientToolHandler]);

  React.useEffect(() => {
    setStatus("initializing");
    setError(null);
  }, [resetNonce]);

  const chatkit = useChatKit(wrappedOptions);
  return {
    ...chatkit,
    status,
    error,
    elementRef: chatkit.ref,
    onClientTool,
  };
}

const handleClientTool = async (toolCall, callbacks) => {
  const { onSuccess, onError } = callbacks ?? {};
  const params = toolCall?.params ?? {};
  const actionSource = params.action ?? toolCall?.action ?? {};
  const payloadSource = actionSource.payload ?? params.payload;
  const type = actionSource.type ?? toolCall?.type;

  if (type !== ESCALATION_ACTION) {
    return;
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

    if (!response.ok) {
      console.error(
        "[Interview] Escalation POST failed",
        response.status,
        await response.text()
      );
      if (onError) {
        await onError();
      }
    } else {
      console.info("[Interview] Escalation ticket sent");
      if (onSuccess) {
        await onSuccess();
      }
    }
  } catch (err) {
    console.error("[Interview] Escalation POST error", err);
    if (onError) {
      await onError();
    }
  }
};

export default function App() {
  const [chatInstanceId, setChatInstanceId] = React.useState(0);
  const chatkit = useHostedChatKit(chatKitOptions, chatInstanceId);
  const { status, error, control, elementRef, onClientTool } = chatkit;
  const showChatErrorBanner = status === "error" || Boolean(error);

  const handleRestartChat = React.useCallback(() => {
    if (
      typeof window !== "undefined" &&
      typeof window.location?.reload === "function"
    ) {
      window.location.reload();
      return;
    }
    setChatInstanceId((prev) => prev + 1);
  }, [setChatInstanceId]);

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

  return (
    <div className="app-root">
      <main className="app-main">
        {status !== "ready" && !error && (
          <div className="app-loading">
            <p>Lädt Chat-Assistent…</p>
          </div>
        )}

        {showChatErrorBanner && (
          <div className="app-error">
            <p>{SESSION_INACTIVE_MESSAGE}</p>
            <p>{SESSION_RESTART_PROMPT}</p>
          </div>
        )}

        <div className="chat-shell">
          <div className="chat-container">
            {showChatErrorBanner && (
              <div className="chat-error-overlay">
                <p>{SESSION_INACTIVE_MESSAGE}</p>
                <p>{SESSION_RESTART_PROMPT}</p>
                <button type="button" onClick={handleRestartChat}>
                  {SESSION_RESTART_BUTTON}
                </button>
              </div>
            )}
            <ChatKit
              key={chatInstanceId}
              ref={elementRef}
              control={control}
              className="chatkit-element"
              data-theme="dark"
              style={{ height: "100%", width: "100%" }}
              data-color-scheme="dark"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
