"use client";

import { useMemo, useState } from "react";

const CopyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

export default function HomePage() {
  const [text, setText] = useState("");
  const [maxViews, setMaxViews] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sharePath, setSharePath] = useState("");
  const [copied, setCopied] = useState(false);

  const fullLink = useMemo(() => {
    if (!sharePath || typeof window === "undefined") {
      return "";
    }
    return `${window.location.origin}${sharePath}`;
  }, [sharePath]);

  async function onSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSharePath("");
    setCopied(false);

    try {
      const response = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, maxViews: Number(maxViews) }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Request failed");
      }

      setSharePath(data.path);
      setText("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(fullLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  return (
    <main className="container">
      <div className="card">
        <div className="brand-header">
          <div className="brand-logo">L</div>
          <span className="brand-name">Limit.less</span>
        </div>

        <h1>
          Secure
          <br />
          Ephemeral
          <br />
          Sharing.
        </h1>
        <p className="hero-desc">
          Create a self-destructing link for your sensitive text. Once the view
          limit is reached, the data is purged from memory forever.
        </p>

        <form onSubmit={onSubmit} className="form">
          <div className="field-group">
            <label htmlFor="text">Secret Content</label>
            <textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
              placeholder="Paste sensitive data here..."
            />
          </div>

          
          <label htmlFor="maxViews">Number of Views Allowed</label>
          <div className="controls-row">
            <div className="field-group">
              <input
                id="maxViews"
                type="number"
                min={1}
                max={10}
                value={maxViews}
                onChange={(e) => setMaxViews(e.target.value)}
                required
                className="input-number"
              />
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={maxViews}
              onChange={(e) => setMaxViews(e.target.value)}
              className="input-range"
            />
          </div>
        <p className="copy-hint">
          This link will expire after {maxViews} use{maxViews > 1 ? "s" : ""}.
        </p>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Processing..." : "Generate Secret Link"}
          </button>
        </form>

        {error && <p className="error">{error}</p>}

        {fullLink && (
          <div className="result">
            <p className="result-label">Secure Access Link</p>
            <div className="result-link-container">
              <span className="result-link">{copied ? 'Link copied!' : fullLink}</span>
              <button 
                onClick={copyToClipboard} 
                className="copy-btn" 
                title="Copy to clipboard"
                aria-label="Copy link"
              >
                {copied ? <CheckIcon /> : <CopyIcon />}
              </button>
            </div>
            <p className="copy-hint">
              This link will expire after {maxViews} use{maxViews > 1 ? "s" : ""}.
            </p>
          </div>
        )}
      </div>

      <footer className="footer">
        <span>
          Built by{" "}
          <a href="https://github.com/emmsdan" target="_blank" rel="noopener">
            EMMSDAN
          </a>{" "}
          &bull; {new Date().getFullYear()}
        </span>
      </footer>
    </main>
  );
}
