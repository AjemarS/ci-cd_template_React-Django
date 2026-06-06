import { useState } from "react";
import "./App.css";

// ─────────────────────────────────────────────────────────
// VITE_API_URL is injected at build time from the GitHub
// Actions variable (Settings → Variables → Actions).
// Locally, create a frontend/.env.local file:
//   VITE_API_URL=http://localhost:8000
// ─────────────────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function App() {
  const [message, setMessage]   = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error,   setError]     = useState(null);

  async function callHello() {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch(`${API_BASE}/api/hello/`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setMessage(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container">
      <h1 className="title">Django + React Template</h1>
      <p className="subtitle">
        Click the button to call <code>GET /api/hello/</code> on the Django backend.
      </p>

      <button className="btn" onClick={callHello} disabled={loading}>
        {loading ? "Loading…" : "Say Hello"}
      </button>

      {message && (
        <div className="result success">
          <span className="label">Response:</span> {message}
        </div>
      )}

      {error && (
        <div className="result error">
          <span className="label">Error:</span> {error}
        </div>
      )}

      <footer className="footer">
        Backend → <a href={`${API_BASE}/api/hello/`} target="_blank" rel="noreferrer">
          {API_BASE}/api/hello/
        </a>
      </footer>
    </main>
  );
}