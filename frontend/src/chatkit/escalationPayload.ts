const ESCALATION_ENDPOINT = "/interview/api/escalations"
export const ESCALATION_ACTION = "escalation.submit_ticket"
export const ESCALATION_SOURCE_WIDGET = "interview_widget"
const DEFAULT_SOURCE = "interview_assistant"
const DEFAULT_LANGUAGE = "de"

const sanitizeString = (value: unknown) => {
  if (typeof value === "string") return value.trim()
  if (typeof value === "number") return String(value).trim()
  return ""
}

const normalizeAllowContact = (value: unknown) => {
  if (typeof value === "boolean") return value
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase()
    if (normalized === "true") return true
    if (normalized === "false") return false
  }
  return false
}

type BuildOptions = {
  source?: string
  language?: string
}

export type EscalationPayload = {
  title: string
  category: string
  message: string
  language: string
  source: string
  version: number
  name?: string
  email?: string
  allow_contact?: boolean
  conversation_id?: string
}

export const buildEscalationPayload = (
  source: unknown,
  options?: BuildOptions,
): EscalationPayload | null => {
  if (!source || typeof source !== "object") return null
  const data = source as Record<string, unknown>

  const title = sanitizeString(data.title)
  const category = sanitizeString(data.category)
  const message = sanitizeString(data.message)

  if (!title || !category || !message) {
    return null
  }

  const languageInput = sanitizeString(data.language) || sanitizeString(options?.language)
  const language = languageInput || DEFAULT_LANGUAGE

  const versionValue = data.version ?? 1
  const parsedVersion = Number(versionValue)
  const version = Number.isNaN(parsedVersion) ? 1 : parsedVersion

  const payload: EscalationPayload = {
    title,
    category,
    message,
    language,
    source: options?.source ?? DEFAULT_SOURCE,
    version,
    allow_contact: normalizeAllowContact(data.allow_contact),
  }

  const name = sanitizeString(data.name)
  if (name) payload.name = name

  const email = sanitizeString(data.email)
  if (email) payload.email = email

  const conversationId = sanitizeString(data.conversation_id)
  if (conversationId) {
    payload.conversation_id = conversationId
  }

  return payload
}

export const postEscalation = (payload: EscalationPayload) => {
  return fetch(ESCALATION_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
}
