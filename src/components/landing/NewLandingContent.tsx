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

export function NewLandingContent({
  freeCount = 358,
}: {
  freeCount?: number;
}) {
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
    <div className="home-page-wrapper">
      <style>{`
        .home-page-wrapper {
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
            
            font-family: var(--font-sans);
            background-color: var(--bg-ground);
            color: var(--text-primary);
            line-height: 1.6;
            font-size: 16px;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        
        .home-page-wrapper * {
            box-sizing: border-box;
        }

        /* Scoped to wrapper to not affect the header */
        .home-page-wrapper h1,
        .home-page-wrapper h2,
        .home-page-wrapper h3,
        .home-page-wrapper p {
            margin: 0;
            padding: 0;
        }
        
        .home-page-wrapper .hero {
            min-height: 70vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: var(--space-2xl) var(--space-xl);
            background: var(--bg-surface);
        }
        
        .home-page-wrapper .hero-badge {
            font-size: 13px;
            font-family: var(--font-mono);
            color: var(--accent-terracotta);
            letter-spacing: 0.05em;
            text-transform: uppercase;
            margin-bottom: var(--space-lg);
            opacity: 0.9;
        }
        
        .home-page-wrapper .hero-title {
            font-family: var(--font-serif);
            font-size: clamp(42px, 6vw, 72px);
            font-weight: 400;
            line-height: 1.1;
            letter-spacing: -0.03em;
            text-align: center;
            max-width: 900px;
            margin-bottom: var(--space-md);
        }
        
        .home-page-wrapper .hero-title .accent {
            color: var(--accent-terracotta);
        }
        
        .home-page-wrapper .hero-subtitle {
            font-size: 18px;
            line-height: 1.6;
            opacity: 0.7;
            text-align: center;
            max-width: 600px;
            margin-bottom: var(--space-xl);
        }
        
        /* Search Component */
        .home-page-wrapper .search-wrapper {
            width: 100%;
            max-width: 720px;
            position: relative;
            margin-bottom: var(--space-lg);
            z-index: 9999;
        }

        .home-page-wrapper .search-container {
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04),
                      0 4px 12px rgba(0, 0, 0, 0.06);
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: box-shadow 0.2s ease, border-color 0.2s ease;
          position: relative;
        }

        .home-page-wrapper .search-container:focus-within {
          border-color: #D1D5DB;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04),
                      0 4px 16px rgba(0, 0, 0, 0.10);
        }

        .home-page-wrapper .search-icon {
          color: #6B7280;
          flex-shrink: 0;
          width: 20px;
          height: 20px;
        }

        .home-page-wrapper .search-input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          font-family: 'Inter', 'SF Pro Display', system-ui, sans-serif;
          font-size: 15px;
          font-weight: 400;
          color: #111827;
          width: 100%;
          padding: 0;
          margin: 0;
        }

        .home-page-wrapper .search-input::placeholder {
          color: #9CA3AF;
        }

        .home-page-wrapper .search-shortcut {
          background: #F3F4F6;
          border: 1px solid #E5E7EB;
          border-radius: 6px;
          padding: 4px 8px;
          font-size: 12px;
          font-weight: 500;
          color: #6B7280;
          flex-shrink: 0;
        }
        
        .home-page-wrapper .search-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: var(--space-sm);
            padding: 0 var(--space-sm);
        }
        
        .home-page-wrapper .search-stats {
            font-size: 13px;
            font-family: var(--font-mono);
            opacity: 0.5;
        }
        
        .home-page-wrapper .search-cta {
            font-size: 13px;
            color: var(--accent-terracotta);
            text-decoration: none;
            opacity: 0.9;
            transition: opacity 0.2s;
        }
        
        .home-page-wrapper .search-cta:hover {
            opacity: 1;
            text-decoration: underline;
        }
        
        .home-page-wrapper .search-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          z-index: 9999;
          margin-top: 8px;
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12);
          max-height: 400px;
          overflow-y: auto;
        }

        .home-page-wrapper .search-result {
          padding: 12px 16px;
          font-size: 14px;
          color: var(--text-primary);
          border-bottom: 1px solid var(--border-light);
          cursor: pointer;
          display: block;
          text-decoration: none;
          transition: background 0.15s;
        }

        .home-page-wrapper .search-result:last-child { border-bottom: none; }
        .home-page-wrapper .search-result:hover { background: var(--bg-ground); }

        .home-page-wrapper .search-result-cat {
          font-size: 11px;
          font-family: var(--font-mono);
          color: var(--accent-terracotta);
          margin-top: 3px;
          opacity: 0.8;
        }

        .home-page-wrapper .search-empty {
          padding: 14px 16px;
          font-size: 13px;
          color: var(--text-primary);
          opacity: 0.5;
          text-align: center;
        }

        /* Popular Calculations */
        .home-page-wrapper .feature-cards-container {
          position: relative;
          z-index: 1;
          margin-top: 24px;
        }

        .home-page-wrapper .popular-section {
            width: 100%;
            max-width: 900px;
        }
        
        .home-page-wrapper .section-label {
            font-size: 12px;
            font-family: var(--font-mono);
            text-transform: uppercase;
            letter-spacing: 0.1em;
            opacity: 0.5;
            margin-bottom: var(--space-md);
            text-align: center;
        }
        
        .home-page-wrapper .popular-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: var(--space-md);
        }
        
        .home-page-wrapper .popular-item {
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
        
        .home-page-wrapper .popular-item:hover {
            border-color: var(--accent-terracotta);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(26, 25, 21, 0.08);
        }
        
        .home-page-wrapper .popular-item-title {
            font-size: 15px;
            font-weight: 500;
            margin-bottom: var(--space-xs);
        }
        
        .home-page-wrapper .popular-item-meta {
            font-size: 12px;
            font-family: var(--font-mono);
            opacity: 0.6;
        }
        
        /* Value Proposition */
        .home-page-wrapper .value-section {
            padding: var(--space-2xl) var(--space-xl);
            background: var(--bg-ground);
            border-top: 1px solid var(--border-light);
        }
        
        .home-page-wrapper .value-container {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .home-page-wrapper .value-header {
            text-align: center;
            margin-bottom: var(--space-2xl);
        }
        
        .home-page-wrapper .value-title {
            font-family: var(--font-serif);
            font-size: clamp(32px, 4vw, 48px);
            font-weight: 400;
            letter-spacing: -0.02em;
            margin-bottom: var(--space-md);
        }
        
        .home-page-wrapper .value-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: var(--space-xl);
        }
        
        .home-page-wrapper .value-card {
            padding: var(--space-lg);
            background: var(--bg-surface);
            border-radius: 8px;
            border: 1px solid var(--border-light);
        }
        
        .home-page-wrapper .value-card-icon {
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
        
        .home-page-wrapper .value-card-title {
            font-family: var(--font-serif);
            font-size: 24px;
            font-weight: 400;
            margin-bottom: var(--space-sm);
            letter-spacing: -0.01em;
        }
        
        .home-page-wrapper .value-card-description {
            font-size: 15px;
            line-height: 1.6;
            opacity: 0.7;
        }
        
        .home-page-wrapper .value-card-metric {
            font-family: var(--font-mono);
            font-size: 13px;
            color: var(--accent-terracotta);
            margin-top: var(--space-md);
            padding-top: var(--space-md);
            border-top: 1px solid var(--border-light);
        }
        
        /* Footer */
        .home-page-wrapper .footer {
            padding: var(--space-2xl) var(--space-xl);
            background: var(--bg-surface);
            border-top: 1px solid var(--border-light);
            text-align: center;
        }
        
        .home-page-wrapper .footer-text {
            font-size: 13px;
            opacity: 0.5;
            font-family: var(--font-mono);
        }
        
        /* Responsive */
        @media (max-width: 768px) {
            .home-page-wrapper .hero {
                padding: var(--space-xl) var(--space-lg);
            }
            
            .home-page-wrapper .search-input-wrapper {
                padding: var(--space-sm) var(--space-md);
            }
            
            .home-page-wrapper .search-input {
                font-size: 16px;
            }
            
            .home-page-wrapper .search-shortcut {
                display: none;
            }
            
            .home-page-wrapper .popular-grid {
                grid-template-columns: 1fr;
            }
            
            .home-page-wrapper .value-grid {
                grid-template-columns: 1fr;
            }
            
            .home-page-wrapper .value-section {
                padding: var(--space-xl) var(--space-lg);
            }
        }
        
        /* Animations */
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(8px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .home-page-wrapper .hero-badge,
        .home-page-wrapper .hero-title,
        .home-page-wrapper .hero-subtitle,
        .home-page-wrapper .search-container,
        .home-page-wrapper .popular-section {
            animation: fadeIn 0.6s ease-out forwards;
        }
        
        .home-page-wrapper .hero-badge { animation-delay: 0.1s; }
        .home-page-wrapper .hero-title { animation-delay: 0.2s; }
        .home-page-wrapper .hero-subtitle { animation-delay: 0.3s; }
        .home-page-wrapper .search-container { animation-delay: 0.4s; }
        .home-page-wrapper .popular-section { animation-delay: 0.5s; }
      `}</style>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-badge">Industrial Engineering Calculators</div>
        
        <h1 className="hero-title">
          Stop guessing.<br />Start <span className="accent">calculating.</span>
        </h1>
        
        <p className="hero-subtitle">
          Audit-proof engineering calculations built on VDI, ISO, and DIN standards. 
          See your losses before they compound.
        </p>
        
        {/* Central Search Component */}
        <div className="search-wrapper">
          <div className="search-container">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input 
              id="hero-search-input"
              type="text" 
              className="search-input" 
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
            <span className="search-shortcut">⌘K</span>
          </div>
          
          {showDropdown && results.length > 0 && (
            <div className="search-dropdown">
              {results.map((tool, i) => (
                <a key={i} href="#" className="search-result">
                  {tool.name}
                  <div className="search-result-cat">{tool.cat}</div>
                </a>
              ))}
            </div>
          )}

          {showDropdown && query.trim() && results.length === 0 && (
            <div className="search-dropdown">
              <div className="search-empty">No calculators found</div>
            </div>
          )}

          <div className="search-meta">
            <span className="search-stats">{freeCount} calculators available</span>
            <a href="#all" className="search-cta">Browse all →</a>
          </div>
        </div>
        
        {/* Popular Calculations */}
        <div className="popular-section feature-cards-container">
          <div className="section-label">Most Used This Week</div>
          
          <div className="popular-grid">
            <a href="#scrap" className="popular-item">
              <div className="popular-item-title">Scrap Rate Analysis</div>
              <div className="popular-item-meta">3 inputs · 60 seconds</div>
            </a>
            
            <a href="#vdi" className="popular-item">
              <div className="popular-item-title">VDI 2067 Compliance</div>
              <div className="popular-item-meta">Building services · Audit-ready</div>
            </a>
            
            <a href="#tolerance" className="popular-item">
              <div className="popular-item-title">Tolerance Stack-up</div>
              <div className="popular-item-meta">GD&T · ISO 286</div>
            </a>
            
            <a href="#cost" className="popular-item">
              <div className="popular-item-title">Cost Recovery Model</div>
              <div className="popular-item-meta">Annual loss projection</div>
            </a>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="value-section">
        <div className="value-container">
          <div className="value-header">
            <h2 className="value-title">Why engineers choose SectorCalc</h2>
          </div>
          
          <div className="value-grid">
            <div className="value-card">
              <div className="value-card-icon">⚡</div>
              <h3 className="value-card-title">Instant Results</h3>
              <p className="value-card-description">
                Three inputs. Sixty seconds. See your annual scrap cost and recovery potential 
                without wrestling with spreadsheet formulas.
              </p>
              <div className="value-card-metric">40% faster quotation cycles</div>
            </div>
            
            <div className="value-card">
              <div className="value-card-icon">📐</div>
              <h3 className="value-card-title">Standards-Verified</h3>
              <p className="value-card-description">
                Every calculation strictly verified against VDI, ISO, and DIN standards. 
                Audit-proof accuracy you can defend in front of stakeholders.
              </p>
              <div className="value-card-metric">100% standards compliance</div>
            </div>
            
            <div className="value-card">
              <div className="value-card-icon">🎯</div>
              <h3 className="value-card-title">Decision-Ready</h3>
              <p className="value-card-description">
                Free tools give you numbers. Pro tells you what the numbers mean and what 
                you need to do next. No more analysis paralysis.
              </p>
              <div className="value-card-metric">From data to action</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p className="footer-text">
          Built for engineers who refuse to leave money on the table.
        </p>
      </footer>
    </div>
  );
}
