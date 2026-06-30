"use client";

import { useEffect, useState } from "react";

const SAMPLE_TOOLS = [
  { name: "Scrap Rate Analysis", cat: "Manufacturing" },
  { name: "OEE Calculator", cat: "Manufacturing" },
  { name: "Machine Hour Rate", cat: "Manufacturing" },
  { name: "Route Cost Calculator", cat: "Logistics" },
  { name: "Deadhead Exposure", cat: "Logistics" },
  { name: "Concrete Volume", cat: "Construction" },
  { name: "kWh Cost Calculator", cat: "Energy" },
  { name: "Energy Savings Package", cat: "Energy" },
  { name: "Food Cost Calculator", cat: "Food & Beverage" },
  { name: "Portion Cost Variance", cat: "Food & Beverage" },
  { name: "VAT Calculator", cat: "Finance" },
  { name: "Break-Even Calculator", cat: "Workshop" },
  { name: "Quote Margin Calculator", cat: "Workshop" },
  { name: "Bolt Torque Calculator", cat: "Engineering" },
  { name: "Cutting Speed Calculator", cat: "Manufacturing" },
  { name: "VDI 2067 Compliance", cat: "Building Services" },
  { name: "Tolerance Stack-up", cat: "GD&T" },
  { name: "Cost Recovery Model", cat: "Finance" },
];

export function NewLandingContent() {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const results = query.trim()
    ? SAMPLE_TOOLS.filter(
        (t) =>
          t.name.toLowerCase().includes(query.toLowerCase()) ||
          t.cat.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : [];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("hero-search-input")?.focus();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <div>
      <style>{`
        .new-hero *,
        .new-value-section * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif;
          background-color: #F0EEE6;
          color: #1A1915;
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        :root {
          --bg-ground: #F0EEE6;
          --bg-surface: #FAF9F5;
          --text-primary: #1A1915;
          --accent-terracotta: #BD5D3A;
          --border-light: rgba(26, 25, 21, 0.10);
          --border-medium: rgba(26, 25, 21, 0.20);
          --font-serif: 'Georgia', 'Tiempos', 'Times New Roman', serif;
          --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif;
          --font-mono: 'SF Mono', 'Fira Code', 'Courier New', monospace;
          --space-unit: 8px;
          --space-xs: calc(var(--space-unit) * 0.5);
          --space-sm: var(--space-unit);
          --space-md: calc(var(--space-unit) * 2);
          --space-lg: calc(var(--space-unit) * 4);
          --space-xl: calc(var(--space-unit) * 8);
          --space-2xl: calc(var(--space-unit) * 12);
        }
        .new-hero {
          min-height: 70vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: var(--space-2xl) var(--space-xl);
          background: var(--bg-surface);
        }
        .new-hero-badge {
          font-size: 13px;
          font-family: var(--font-mono);
          color: var(--accent-terracotta);
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: var(--space-lg);
          opacity: 0.9;
        }
        .new-hero-title {
          font-family: var(--font-serif);
          font-size: clamp(42px, 6vw, 72px);
          font-weight: 400;
          line-height: 1.1;
          letter-spacing: -0.03em;
          text-align: center;
          max-width: 900px;
          margin-bottom: var(--space-md);
        }
        .new-hero-title .new-accent {
          color: var(--accent-terracotta);
        }
        .new-hero-subtitle {
          font-size: 18px;
          line-height: 1.6;
          opacity: 0.7;
          text-align: center;
          max-width: 600px;
          margin-bottom: var(--space-xl);
        }
        .new-search-container {
          width: 100%;
          max-width: 720px;
          position: relative;
          margin-bottom: var(--space-lg);
        }
        .new-search-input-wrapper {
          display: flex;
          align-items: center;
          background: var(--bg-ground);
          border: 2px solid var(--border-medium);
          border-radius: 8px;
          padding: var(--space-md) var(--space-lg);
          transition: all 0.3s;
          box-shadow: 0 2px 8px rgba(26, 25, 21, 0.04);
        }
        .new-search-input-wrapper:focus-within {
          border-color: var(--accent-terracotta);
          box-shadow: 0 4px 16px rgba(189, 93, 58, 0.12);
        }
        .new-search-icon {
          width: 24px;
          height: 24px;
          margin-right: var(--space-md);
          opacity: 0.4;
          flex-shrink: 0;
        }
        .new-search-input {
          flex: 1;
          border: none;
          background: transparent;
          font-size: 18px;
          font-family: var(--font-sans);
          color: var(--text-primary);
          outline: none;
        }
        .new-search-input::placeholder {
          color: var(--text-primary);
          opacity: 0.4;
        }
        .new-search-shortcut {
          font-size: 12px;
          font-family: var(--font-mono);
          padding: 4px 8px;
          background: var(--bg-surface);
          border: 1px solid var(--border-light);
          border-radius: 4px;
          color: var(--text-primary);
          opacity: 0.6;
          flex-shrink: 0;
        }
        .new-search-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: var(--space-sm);
          padding: 0 var(--space-sm);
        }
        .new-search-stats {
          font-size: 13px;
          font-family: var(--font-mono);
          opacity: 0.5;
        }
        .new-search-cta {
          font-size: 13px;
          color: var(--accent-terracotta);
          text-decoration: none;
          opacity: 0.9;
          transition: opacity 0.2s;
        }
        .new-search-cta:hover {
          opacity: 1;
          text-decoration: underline;
        }
        .new-search-dropdown {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          right: 0;
          background: var(--bg-surface);
          border: 1px solid var(--border-medium);
          border-radius: 8px;
          box-shadow: 0 8px 30px rgba(26, 25, 21, 0.10);
          max-height: 300px;
          overflow-y: auto;
          z-index: 100;
        }
        .new-search-result {
          padding: 12px 16px;
          font-size: 14px;
          color: var(--text-primary);
          border-bottom: 1px solid var(--border-light);
          cursor: pointer;
          display: block;
          text-decoration: none;
          transition: background 0.15s;
        }
        .new-search-result:last-child { border-bottom: none; }
        .new-search-result:hover { background: var(--bg-ground); }
        .new-search-result-cat {
          font-size: 11px;
          font-family: var(--font-mono);
          color: var(--accent-terracotta);
          margin-top: 3px;
          opacity: 0.8;
        }
        .new-search-empty {
          padding: 14px 16px;
          font-size: 13px;
          color: var(--text-primary);
          opacity: 0.5;
          text-align: center;
        }
        .new-popular-section {
          width: 100%;
          max-width: 900px;
          margin-top: var(--space-xl);
        }
        .new-section-label {
          font-size: 12px;
          font-family: var(--font-mono);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          opacity: 0.5;
          margin-bottom: var(--space-md);
          text-align: center;
        }
        .new-popular-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--space-md);
        }
        .new-popular-item {
          padding: var(--space-md) var(--space-lg);
          background: var(--bg-ground);
          border: 1px solid var(--border-light);
          border-radius: 6px;
          text-decoration: none;
          color: var(--text-primary);
          transition: all 0.2s;
          cursor: pointer;
          display: block;
        }
        .new-popular-item:hover {
          border-color: var(--accent-terracotta);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(26, 25, 21, 0.08);
        }
        .new-popular-item-title {
          font-size: 15px;
          font-weight: 500;
          margin-bottom: var(--space-xs);
        }
        .new-popular-item-meta {
          font-size: 12px;
          font-family: var(--font-mono);
          opacity: 0.6;
        }
        .new-value-section {
          padding: var(--space-2xl) var(--space-xl);
          background: var(--bg-ground);
          border-top: 1px solid var(--border-light);
        }
        .new-value-container {
          max-width: 1200px;
          margin: 0 auto;
        }
        .new-value-header {
          text-align: center;
          margin-bottom: var(--space-2xl);
        }
        .new-value-title {
          font-family: var(--font-serif);
          font-size: clamp(32px, 4vw, 48px);
          font-weight: 400;
          letter-spacing: -0.02em;
          margin-bottom: var(--space-md);
        }
        .new-value-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: var(--space-xl);
        }
        .new-value-card {
          padding: var(--space-lg);
          background: var(--bg-surface);
          border-radius: 8px;
          border: 1px solid var(--border-light);
        }
        .new-value-card-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-ground);
          border-radius: 6px;
          margin-bottom: var(--space-md);
          font-size: 24px;
        }
        .new-value-card-title {
          font-family: var(--font-serif);
          font-size: 24px;
          font-weight: 400;
          margin-bottom: var(--space-sm);
          letter-spacing: -0.01em;
        }
        .new-value-card-description {
          font-size: 15px;
          line-height: 1.6;
          opacity: 0.7;
        }
        .new-value-card-metric {
          font-family: var(--font-mono);
          font-size: 13px;
          color: var(--accent-terracotta);
          margin-top: var(--space-md);
          padding-top: var(--space-md);
          border-top: 1px solid var(--border-light);
        }
        @keyframes newFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .new-anim {
          animation: newFadeIn 0.6s ease-out forwards;
        }
        .new-anim-d1 { animation-delay: 0.1s; }
        .new-anim-d2 { animation-delay: 0.2s; }
        .new-anim-d3 { animation-delay: 0.3s; }
        .new-anim-d4 { animation-delay: 0.4s; }
        .new-anim-d5 { animation-delay: 0.5s; }
        @media (max-width: 768px) {
          .new-hero { padding: var(--space-xl) var(--space-lg); }
          .new-search-input-wrapper { padding: var(--space-sm) var(--space-md); }
          .new-search-input { font-size: 16px; }
          .new-search-shortcut { display: none; }
          .new-popular-grid { grid-template-columns: 1fr; }
          .new-value-grid { grid-template-columns: 1fr; }
          .new-value-section { padding: var(--space-xl) var(--space-lg); }
        }
      `}</style>

      {/* Hero Section */}
      <section className="new-hero">
        <div className="new-hero-badge new-anim new-anim-d1">
          Industrial Engineering Calculators
        </div>

        <h1 className="new-hero-title new-anim new-anim-d2">
          Stop guessing.
          <br />
          Start <span className="new-accent">calculating.</span>
        </h1>

        <p className="new-hero-subtitle new-anim new-anim-d3">
          Audit-proof engineering calculations built on VDI, ISO, and DIN
          standards. See your losses before they compound.
        </p>

        {/* Central Search Component */}
        <div className="new-search-container new-anim new-anim-d4">
          <div className="new-search-input-wrapper">
            <svg
              className="new-search-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              id="hero-search-input"
              type="text"
              className="new-search-input"
              placeholder="Search calculators: scrap rate, VDI 2067, tolerance analysis..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => query.trim() && setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              autoFocus
            />
            <span className="new-search-shortcut">⌘K</span>
          </div>

          {showDropdown && results.length > 0 && (
            <div className="new-search-dropdown">
              {results.map((tool, i) => (
                <a key={i} href="#" className="new-search-result">
                  {tool.name}
                  <div className="new-search-result-cat">{tool.cat}</div>
                </a>
              ))}
            </div>
          )}

          {showDropdown && query.trim() && results.length === 0 && (
            <div className="new-search-dropdown">
              <div className="new-search-empty">No calculators found</div>
            </div>
          )}

          <div className="new-search-meta">
            <span className="new-search-stats">47 calculators available</span>
            <a href="#all" className="new-search-cta">
              Browse all →
            </a>
          </div>
        </div>

        {/* Popular Calculations */}
        <div className="new-popular-section new-anim new-anim-d5">
          <div className="new-section-label">Most Used This Week</div>

          <div className="new-popular-grid">
            <a href="#scrap" className="new-popular-item">
              <div className="new-popular-item-title">
                Scrap Rate Analysis
              </div>
              <div className="new-popular-item-meta">
                3 inputs · 60 seconds
              </div>
            </a>

            <a href="#vdi" className="new-popular-item">
              <div className="new-popular-item-title">
                VDI 2067 Compliance
              </div>
              <div className="new-popular-item-meta">
                Building services · Audit-ready
              </div>
            </a>

            <a href="#tolerance" className="new-popular-item">
              <div className="new-popular-item-title">
                Tolerance Stack-up
              </div>
              <div className="new-popular-item-meta">GD&T · ISO 286</div>
            </a>

            <a href="#cost" className="new-popular-item">
              <div className="new-popular-item-title">
                Cost Recovery Model
              </div>
              <div className="new-popular-item-meta">
                Annual loss projection
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="new-value-section">
        <div className="new-value-container">
          <div className="new-value-header">
            <h2 className="new-value-title">
              Why engineers choose SectorCalc
            </h2>
          </div>

          <div className="new-value-grid">
            <div className="new-value-card">
              <div className="new-value-card-icon">⚡</div>
              <h3 className="new-value-card-title">Instant Results</h3>
              <p className="new-value-card-description">
                Three inputs. Sixty seconds. See your annual scrap cost and
                recovery potential without wrestling with spreadsheet formulas.
              </p>
              <div className="new-value-card-metric">
                40% faster quotation cycles
              </div>
            </div>

            <div className="new-value-card">
              <div className="new-value-card-icon">📐</div>
              <h3 className="new-value-card-title">Standards-Verified</h3>
              <p className="new-value-card-description">
                Every calculation strictly verified against VDI, ISO, and DIN
                standards. Audit-proof accuracy you can defend in front of
                stakeholders.
              </p>
              <div className="new-value-card-metric">
                100% standards compliance
              </div>
            </div>

            <div className="new-value-card">
              <div className="new-value-card-icon">🎯</div>
              <h3 className="new-value-card-title">Decision-Ready</h3>
              <p className="new-value-card-description">
                Free tools give you numbers. Pro tells you what the numbers
                mean and what you need to do next. No more analysis paralysis.
              </p>
              <div className="new-value-card-metric">
                From data to action
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
