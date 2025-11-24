import React from "react"

const ADMIN_SESSION_KEY = "landki_admin_token"
const ADMIN_HEADER = "x-admin-token"
const PING_ENDPOINT = "/interview/api/admin/ping"
const ESCALATIONS_ENDPOINT = "/interview/api/escalations"

const berlinDateFormatter = new Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "2-digit",
  year: "2-digit",
  timeZone: "Europe/Berlin",
})
const berlinTimeFormatter = new Intl.DateTimeFormat("de-DE", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Europe/Berlin",
})

const truncateText = (text, length = 120) => {
  if (!text) return "-"
  return text.length > length ? `${text.slice(0, length)}…` : text
}

const parseTimestamp = (value) => {
  if (!value) return null
  const date = typeof value === "string" ? new Date(value) : new Date(String(value))
  return Number.isNaN(date.getTime()) ? null : date
}

const formatDate = (value) => {
  const date = parseTimestamp(value)
  if (!date) return "-"
  return berlinDateFormatter.format(date)
}

const formatTime = (value) => {
  const date = parseTimestamp(value)
  if (!date) return "-"
  return berlinTimeFormatter.format(date)
}

const formatStatusLabel = (status) => {
  if (!status) return "-"
  const map = {
    offen: "Offen",
    erledigt: "Erledigt",
  }
  return map[status] ?? status
}

const formatContactPreference = (value) => (value ? "ja" : "nein")

function AdminDashboardApp() {
  const storedToken = React.useMemo(
    () => (typeof sessionStorage !== "undefined" ? sessionStorage.getItem(ADMIN_SESSION_KEY) : null),
    [],
  )
  const [token, setToken] = React.useState(storedToken)
  const [tokenInput, setTokenInput] = React.useState(storedToken ?? "")
  const [isAuthenticating, setIsAuthenticating] = React.useState(false)
  const [loginError, setLoginError] = React.useState("")
  const [tickets, setTickets] = React.useState([])
  const [isLoadingTickets, setIsLoadingTickets] = React.useState(false)
  const [selectedTicket, setSelectedTicket] = React.useState(null)
  const [modalStatus, setModalStatus] = React.useState("offen")
  const [statusUpdating, setStatusUpdating] = React.useState(false)
  const [period, setPeriod] = React.useState("7d")

  const handleUnauthorized = React.useCallback(() => {
    if (typeof sessionStorage !== "undefined") {
      sessionStorage.removeItem(ADMIN_SESSION_KEY)
    }
    setToken(null)
    setTickets([])
    setSelectedTicket(null)
    setLoginError("Token ungültig oder abgelaufen. Bitte erneut anmelden.")
  }, [])

  const requestWithToken = React.useCallback(
    async (url, options = {}) => {
      if (!token) throw new Error("Token fehlt")
      const headers = {
        [ADMIN_HEADER]: token,
        ...(options.headers ?? {}),
      }
      if (!headers["Content-Type"] && (options.method ?? "GET") !== "GET") {
        headers["Content-Type"] = "application/json"
      }
      const response = await fetch(url, { ...options, headers })
      if (response.status === 401) {
        handleUnauthorized()
        throw new Error("Unauthorized")
      }
      if (!response.ok) {
        const message = await response.text()
        throw new Error(message || "Anfrage fehlgeschlagen")
      }
      return response
    },
    [handleUnauthorized, token],
  )

  const loadTickets = React.useCallback(async () => {
    if (!token) return
    setIsLoadingTickets(true)
    try {
      const params = new URLSearchParams({ period })
      const response = await requestWithToken(`${ESCALATIONS_ENDPOINT}?${params.toString()}`)
      const data = await response.json()
      setTickets(data)
    } catch (error) {
      if (error.message !== "Unauthorized") {
        setLoginError("Eskalationen konnten nicht geladen werden.")
      }
    } finally {
      setIsLoadingTickets(false)
    }
  }, [period, requestWithToken, token])

  React.useEffect(() => {
    if (token) {
      loadTickets()
    }
  }, [token, loadTickets])

  React.useEffect(() => {
    setModalStatus(selectedTicket?.status ?? "offen")
  }, [selectedTicket])

  const handleLogin = async (event) => {
    event.preventDefault()
    setLoginError("")
    if (!tokenInput) {
      setLoginError("Admin Token erforderlich.")
      return
    }
    setIsAuthenticating(true)
    try {
      const response = await fetch(PING_ENDPOINT, {
        headers: { [ADMIN_HEADER]: tokenInput },
      })
      if (response.status === 200) {
        if (typeof sessionStorage !== "undefined") {
          sessionStorage.setItem(ADMIN_SESSION_KEY, tokenInput)
        }
        setToken(tokenInput)
        return
      }
      if (response.status === 401) {
        throw new Error("Token ungültig")
      }
      const message = await response.text()
      throw new Error(message || "Server nicht erreichbar")
    } catch (error) {
      console.error("Admin ping error", error)
      setLoginError("Token ungültig.")
      if (typeof sessionStorage !== "undefined") {
        sessionStorage.removeItem(ADMIN_SESSION_KEY)
      }
    } finally {
      setIsAuthenticating(false)
    }
  }

  const handleLogout = () => {
    handleUnauthorized()
    setTokenInput("")
  }

  const handleStatusUpdate = async () => {
    if (!selectedTicket || !modalStatus || selectedTicket.status === modalStatus) return

    setStatusUpdating(true)
    try {
      const response = await requestWithToken(`${ESCALATIONS_ENDPOINT}/${selectedTicket.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: modalStatus }),
      })
      const updated = await response.json()
      setTickets((prev) => prev.map((ticket) => (ticket.id === updated.id ? updated : ticket)))
      setSelectedTicket(updated)
      setLoginError("")
    } catch (error) {
      if (error.message !== "Unauthorized") {
        setLoginError("Status konnte nicht aktualisiert werden.")
      }
    } finally {
      setStatusUpdating(false)
    }
  }

  if (!token) {
    return (
      <div className="dashboard-shell">
        <div className="login-panel">
          <div className="login-card">
            <h2>Admin Login</h2>
            <p>Bitte geben Sie Ihr Admin Token ein, um auf die Eskalationen zuzugreifen.</p>
            <form onSubmit={handleLogin}>
              <label htmlFor="admin-token">
                Admin Token
              </label>
              <input
                id="admin-token"
                type="password"
                placeholder="Admin Token"
                value={tokenInput}
                onChange={(event) => setTokenInput(event.target.value)}
              />
              <button type="submit" disabled={isAuthenticating}>
                {isAuthenticating ? "Prüfe Token…" : "Anmelden"}
              </button>
            </form>
            {loginError && <div className="error-message">{loginError}</div>}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-shell">
      <div className="dashboard-panel">
        <div className="dashboard-header">
          <div>
            <h1>Eskalationen</h1>
            <p>Tickets vom Interview Assistant</p>
          </div>
          <div className="filters">
            <label htmlFor="period-select">
              Zeitraum
            </label>
            <select
              id="period-select"
              value={period}
              onChange={(event) => setPeriod(event.target.value)}
            >
              <option value="24h">24 Stunden</option>
              <option value="7d">Letzte 7 Tage</option>
              <option value="all">Alles</option>
            </select>
            <button type="button" onClick={handleLogout}>
              Abmelden
            </button>
          </div>
        </div>
        {loginError && <div className="error-message" role="alert">{loginError}</div>}
        <div className="ticket-card">
          {isLoadingTickets ? (
            <div className="empty-state">Lade Tickets…</div>
          ) : tickets.length === 0 ? (
            <div className="empty-state">Noch keine Eskalationen eingegangen.</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Datum</th>
                  <th>Uhrzeit</th>
                  <th>Name</th>
                  <th>Kontakt</th>
                  <th>Kategorie</th>
                  <th>Nachricht</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket.id} onClick={() => setSelectedTicket(ticket)}>
                    <td>{formatDate(ticket.created_at)}</td>
                    <td>{formatTime(ticket.created_at)}</td>
                    <td>{ticket.name || "Anonym"}</td>
                    <td>{ticket.email || "-"}</td>
                    <td>
                      <div className="category-cell">
                        <span>{ticket.category}</span>
                        <span className={`status-badge ${ticket.status}`}>
                          {formatStatusLabel(ticket.status)}
                        </span>
                      </div>
                    </td>
                    <td>{truncateText(ticket.message)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {selectedTicket && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-card">
            <h2>Eskalation #{selectedTicket.id}</h2>
            <div className="modal-row">
              <label>Datum</label>
              <span>{formatDate(selectedTicket.created_at)}</span>
            </div>
            <div className="modal-row">
              <label>Uhrzeit</label>
              <span>{formatTime(selectedTicket.created_at)}</span>
            </div>
            <div className="modal-row">
              <label>Name</label>
              <span>{selectedTicket.name || "Anonym"}</span>
            </div>
            <div className="modal-row">
              <label>Kontakt</label>
              <span>{selectedTicket.email || "-"}</span>
            </div>
            <div className="modal-row">
              <label>Rückmeldung erwünscht</label>
              <span>{formatContactPreference(selectedTicket.allow_contact)}</span>
            </div>
            <div className="modal-row">
              <label>Kategorie</label>
              <span>{selectedTicket.category}</span>
            </div>
            <div className="modal-row">
              <label>Nachricht</label>
              <div className="message-content">
                {selectedTicket.message || "Keine Nachricht"}
              </div>
            </div>
            <div className="modal-row">
              <label>Status</label>
              <select value={modalStatus} onChange={(event) => setModalStatus(event.target.value)}>
                <option value="offen">Offen</option>
                <option value="erledigt">Erledigt</option>
              </select>
            </div>
            <div className="modal-actions">
              <button
                type="button"
                onClick={handleStatusUpdate}
                disabled={statusUpdating || modalStatus === selectedTicket.status}
              >
                {statusUpdating ? "Speichern…" : "Status speichern"}
              </button>
              <button type="button" onClick={() => setSelectedTicket(null)}>
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboardApp
