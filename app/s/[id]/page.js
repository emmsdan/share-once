"use client";

import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import React from "react";

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

export default function SharedSnippetPage({ params }) {
  const unwrappedParams = React.use(params);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/view/${unwrappedParams.id}`);
        if (!response.ok) {
          setData(null);
        } else {
          const result = await response.json();
          setData(result);
        }
      } catch (err) {
        setData(null);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [unwrappedParams.id]);

  if (loading) return null;
  if (!data) return notFound();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(data.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  return (
    <main className="container">
      <div className="card" style={{ maxWidth: '1300px', width: '100%'}}>
        <div className="brand-header">
          <div className="brand-logo">L</div>
          <span className="brand-name">Limit.less</span>
        </div>

        <div className="snippet-header">
          <h1>Secure<br />Payload.</h1>
          <div className="result-link-container">
              <span className="result-link">
                { copied ? 'Content copied!' : 'Click to copy content'}</span>
              <button 
                onClick={copyToClipboard} 
                className="copy-btn" 
                title="Copy to clipboard"
                aria-label="Copy link"
              >
                {copied ? <CheckIcon /> : <CopyIcon />}
              </button>
            </div>
        </div>
        
        <div className="snippet-container">
          <pre className="snippet">{data.text}</pre>
        </div>

        <div className="share-meta">
          <span>Views remaining:</span>
          <span className="meta-count">{data.remainingAfterView}</span>
        </div>

        <a href="/" className="btn-secondary">New Secret</a>
      </div>

      <footer className="footer">
         <span>Built by <a href="https://github.com/emmsdan" target="_blank" rel="noopener">EMMSDAN</a></span>
      </footer>
    </main>
  );
}
