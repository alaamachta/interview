import React from "react"
import { createRoot } from "react-dom/client"
import AdminDashboardApp from "./AdminDashboardApp"
import "./dashboard.css"

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AdminDashboardApp />
  </React.StrictMode>
)
