import type { ChatKitOptions } from "@openai/chatkit";
import {
  ESCALATION_ACTION,
  ESCALATION_SOURCE_WIDGET,
  buildEscalationPayload,
  postEscalation,
} from "./escalationPayload";

const apiBase =
  import.meta.env.VITE_CHATKIT_API_URL ?? "/interview/api/chatkit";

export const chatKitOptions: ChatKitOptions = {
  api: {
    async getClientSecret(currentClientSecret) {
      if (currentClientSecret) return currentClientSecret;

      const response = await fetch(`${apiBase}/session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        console.error(
          "[ChatKit] Failed to fetch client_secret:",
          response.status,
          await response.text()
        );
        throw new Error("CHATKIT_CLIENT_SECRET_FETCH_FAILED");
      }

      const body = await response.json();
      return body.client_secret as string;
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
    placeholder: "Ihre Frage an Alaa…",
    attachments: {
      enabled: false,
    },
  },

  startScreen: {
    greeting: "👋 Willkommen beim Interview Assistent von Alaa Mashta!",
    prompts: [
      {
        icon: "circle-question",
        label: "Warum bin ich geeignet für eine KI-Position?",
        prompt:
          "Wie begründe ich überzeugend, warum ich gut für eine Rolle im Bereich KI und Automatisierung geeignet bin?",
      },
      {
        icon: "user",
        label: "Welche Erfahrungen bringe ich mit?",
        prompt:
          "Welche Erfahrungen habe ich in der Entwicklung und Integration von KI-Systemen gesammelt?",
      },
      {
        icon: "lightbulb",
        label: "Was sind meine Stärken in KI-Rollen?",
        prompt:
          "Welche meiner Fähigkeiten passen besonders gut zu KI-Integration und Automatisierung?",
      },
    ],
  },
};
