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

function useHostedChatKit(baseOptions) {
  const [status, setStatus] = React.useState("initializing");
  const [error, setError] = React.useState(null);
  const [clientToolHandler, setClientToolHandler] = React.useState();

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
      if (typeof baseOptions.onReady === "function") {
        baseOptions.onReady(detail);
      }
    };

    const handleError = (detail) => {
      const err =
        detail?.error ?? detail ?? new Error("Unbekannter ChatKit-Fehler");
      setError(err);
      setStatus("error");
      if (typeof baseOptions.onError === "function") {
        baseOptions.onError(detail);
      }
    };

    return {
      ...baseOptions,
      onClientTool: clientToolHandler,
      onReady: handleReady,
      onError: handleError,
    };
  }, [baseOptions, clientToolHandler]);

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
  const chatkit = useHostedChatKit(chatKitOptions);
  const { status, error, control, elementRef, onClientTool } = chatkit;

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

        {error && (
          <div className="app-error">
            <p>Fehler beim Laden des Chat-Assistenten.</p>
            <pre>{String(error?.message ?? error)}</pre>
          </div>
        )}

        <div className="chat-shell">
          <div className="chat-container">
            <ChatKit
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
