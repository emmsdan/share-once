export default function NotFound() {
  return (
    <main className="container">
      <div className="card">
        <div className="brand-header">
          <div className="brand-logo">L</div>
          <span className="brand-name">Limit.less</span>
        </div>

        <h1>404.<br />Expired or<br />Missing.</h1>
        <p className="hero-desc">This link has either been viewed the maximum number of times or never existed in the first place.</p>
        
        <a href="/" className="btn-primary">Return Home</a>
      </div>

      <footer className="footer">
        <span>Built by <a href="https://github.com/emmsdan" target="_blank" rel="noopener">EMMSDAN</a></span>
      </footer>
    </main>
  );
}
