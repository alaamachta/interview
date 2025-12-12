import type { ChatKitOptions } from "@openai/chatkit";
import {
  ESCALATION_ACTION,
  ESCALATION_SOURCE_WIDGET,
  buildEscalationPayload,
  postEscalation,
} from "./escalationPayload";
import { dispatchEscalationSuccessEvent } from "./events";

const apiBase =
  import.meta.env.VITE_CHATKIT_API_URL ?? "/interview/api/chatkit";
const sessionEndpoint = `${apiBase}/session`;

async function fetchClientSecret(
  userId: string | null,
  currentClientSecret: string | null
) {
  const body: Record<string, unknown> = {
    current_client_secret: currentClientSecret,
  };
  if (userId) {
    body.userId = userId;
  }

  const response = await fetch(sessionEndpoint, {
    method: "POST",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "(no body)");
    console.error(
      "[ChatKit] Failed to obtain client_secret",
      response.status,
      body
    );
    throw new Error(
      "Failed to obtain client_secret from /interview/api/chatkit/session"
    );
  }

  const payload = await response.json();
  if (!payload?.client_secret) {
    console.error(
      "[ChatKit] Session endpoint response missing client_secret",
      payload
    );
    throw new Error("Invalid response from ChatKit session endpoint");
  }
  const clientSecret = payload.client_secret as string;
  console.log(
    "[ChatKit] NEW SESSION SECRET:",
    clientSecret,
    userId ? `(userId: ${userId})` : ""
  );
  return clientSecret;
}

export const createChatKitOptions = (
  userId?: string | null
): ChatKitOptions => ({
  api: {
    async getClientSecret(currentClientSecret) {
      return fetchClientSecret(userId ?? null, currentClientSecret ?? null);
    },
  },

  widgets: {
    async onAction(event) {
      console.log("Widget Action Received:", event);

      const action = event?.action ?? (event?.type ? event : null);
      if (!action || action.type !== ESCALATION_ACTION) return;

      const payload = buildEscalationPayload(action.payload ?? event?.payload, {
        source: ESCALATION_SOURCE_WIDGET,
        language: "de",
      });
      if (!payload) {
        console.warn(
          "Escalation widget payload missing required fields",
          action.payload
        );
        return;
      }

      console.log("Escalation widget final payload:", payload);
      try {
        const response = await postEscalation(payload);
        const responseData = await response.json().catch(() => ({}));
        console.log(
          "Escalation widget POST response",
          response.status,
          responseData
        );

        if (!response.ok) {
          console.error(
            "Escalation widget POST failed",
            response.status,
            responseData
          );
        } else {
          console.log(
            "Escalation widget ticket successfully posted:",
            responseData
          );
          const ticketId = responseData?.ticket_id ?? null;
          dispatchEscalationSuccessEvent({
            ticketId,
            source: "widget",
          });
        }
      } catch (error) {
        console.error("Escalation widget POST error:", error);
      }
    },
  },

  theme: {
    colorScheme: "dark",
    radius: "pill",
    density: "compact",
    color: {
      grayscale: {
        hue: 231,
        tint: 6,
        shade: -3,
      },
      accent: {
        primary: "#e6ffe5",
        level: 2,
      },
    },
    typography: {
      baseSize: 16,
      fontFamily:
        '"OpenAI Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif',
      fontFamilyMono:
        'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "DejaVu Sans Mono", "Courier New", monospace',
      fontSources: [
        {
          family: "OpenAI Sans",
          src: "https://cdn.openai.com/common/fonts/openai-sans/v2/OpenAISans-Regular.woff2",
          weight: 400,
          style: "normal",
          display: "swap",
        },
        // ...and 7 more font sources
      ],
    },
  },

  composer: {
    placeholder: "Ask Alaa anything about the Interview Assistant…",
    attachments: {
      enabled: false,
    },
  },

  startScreen: {
    greeting: "👋 Welcome to the LandKI Interview Assistant",
    prompts: [
      {
        icon: "circle-question",
        label: "How does this assistant work behind the scenes?",
        prompt:
          "You are answering for an English-speaking recruiter. Please answer ONLY in English, even if the underlying knowledge base text is in German. Question: How does this interview assistant work behind the scenes? Translate any German content you use into clear English.",
      },
      {
        icon: "circle-question",
        label: "Wie funktioniert dieser Assistent im Hintergrund?",
        prompt:
          "Du antwortest für eine deutschsprachige Person. Antworte AUSSCHLIESSLICH auf Deutsch, auch wenn deine Knowledge Base in einer anderen Sprache vorliegt. Frage: Wie funktioniert dieser Interview Assistent im Hintergrund? Übersetze andere Sprachen sinngemäß ins Deutsche.",
      },
      {
        icon: "circle-question",
        label: "كيف يعمل هذا المساعد في الخلفية؟",
        prompt:
          "أنت تجيب لشخص يتحدث العربية. أجب باللغة العربية فقط وبأسلوب واضح ومهني، حتى لو كانت قاعدة المعرفة بالألمانية أو الإنجليزية. السؤال: كيف يعمل مساعد المقابلات هذا في الخلفية؟ إذا كانت المعرفة متاحة بلغة أخرى فاشرحها باللغة العربية.",
      },
    ],
  },
});
