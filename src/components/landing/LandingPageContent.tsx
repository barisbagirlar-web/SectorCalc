import Link from "next/link";
import "@/styles/landing-page.css";

/* ── Inline SVG icon components (outline, consistent 24px family) ── */
function BuildingIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h1m4 0h1M9 13h1m4 0h1M9 17h1m4 0h1" />
    </svg>
  );
}

function CurrencyIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function ArrowRight({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

/* ── Data ── */
const featuredSectors = [
  {
    slug: "manufacturing",
    count: 51,
    label: "models",
    title: "Manufacturing",
    description: "Machine hour rate, OEE, scrap cost, setup time, throughput, production cost. Built for plant managers and operations engineers.",
    href: "/free-tools/manufacturing",
  },
  {
    slug: "finance-controlling",
    count: 66,
    label: "models",
    title: "Finance & Controlling",
    description: "VAT, payroll, depreciation, loan amortization, margin, break-even, cash impact. For controllers and CFO offices.",
    href: "/free-tools/finance",
  },
];

const compactSectors = [
  { name: "Workshops & Fabrication", count: 28, href: "/free-tools/welding-fabrication" },
  { name: "Engineering", count: 4, href: "/free-tools/engineering" },
  { name: "Construction", count: 7, href: "/free-tools/construction" },
  { name: "Energy", count: 2, href: "/free-tools/energy-facilities" },
  { name: "Logistics", count: 14, href: "/free-tools/logistics" },
  { name: "Retail & Business", count: 89, href: "/free-tools/retail" },
];

export function LandingPageContent() {
  return (
    <div className="sc-landing">
      {/* ══════════════ HERO ══════════════ */}
      <section className="sc-hero" aria-labelledby="hero-title">
        <div className="sc-shell sc-hero-grid">
          <div>
            <p className="sc-eyebrow">310 calculation models · 11 sectors</p>
            <h1 id="hero-title">
              Your next industrial decision is <em>4 minutes</em> away.
            </h1>
            <p className="sc-hero-lead">
              Stop guessing from spreadsheets. Input your operating numbers, get a
              decision-ready report backed by ISO, ASME, VDI and DIN references —
              with sensitivity analysis and audit-transparent formula logic.
            </p>

            {/* Proof stripe — real numbers, no "trusted by" */}
            <div className="sc-proof-stripe">
              <div className="sc-proof-item">
                <span className="sc-proof-num">310</span>
                <span className="sc-proof-label">models live</span>
              </div>
              <div className="sc-proof-item">
                <span className="sc-proof-num">47</span>
                <span className="sc-proof-label">standards cited</span>
              </div>
              <div className="sc-proof-item">
                <span className="sc-proof-num">11</span>
                <span className="sc-proof-label">sectors covered</span>
              </div>
              <div className="sc-proof-item">
                <span className="sc-proof-num">4 min</span>
                <span className="sc-proof-label">avg. report time</span>
              </div>
            </div>

            <Link href="/free-tools" className="sc-cta-primary">
              Find your model
              <ArrowRight />
            </Link>
          </div>

          {/* Live calculator preview card */}
          <div className="sc-calc-preview" aria-label="Live calculator preview — Machine Hour Rate">
            <div className="sc-calc-header">
              <span className="sc-calc-title">Machine Hour Rate · ISO 22400-2</span>
              <span className="sc-calc-badge">Live Preview</span>
            </div>
            <div className="sc-calc-row">
              <span className="sc-calc-row-label">Productive hours / year</span>
              <span className="sc-calc-row-value">2,500 h</span>
            </div>
            <div className="sc-calc-row">
              <span className="sc-calc-row-label">Actual hours</span>
              <span className="sc-calc-row-value">2,400 h</span>
            </div>
            <div className="sc-calc-row">
              <span className="sc-calc-row-label">Hourly rate</span>
              <span className="sc-calc-row-value">€48.00</span>
            </div>
            <div className="sc-calc-row">
              <span className="sc-calc-row-label">Scrap quantity</span>
              <span className="sc-calc-row-value">120 units</span>
            </div>
            <div className="sc-calc-row">
              <span className="sc-calc-row-label">Unit cost</span>
              <span className="sc-calc-row-value">€12.50</span>
            </div>
            <div className="sc-calc-row sc-highlight">
              <span className="sc-calc-row-label">Total monthly loss</span>
              <span className="sc-calc-row-value">€6,300</span>
            </div>
            <div className="sc-calc-meta">
              <span className="sc-calc-tag">Sensitivity: ±€420</span>
              <span className="sc-calc-tag">Closed-form verified</span>
              <span className="sc-calc-tag">ISO 22400-2</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ SECTORS ══════════════ */}
      <section className="sc-sectors" id="sectors" aria-labelledby="sectors-title">
        <div className="sc-shell">
          <div className="sc-sectors-header">
            <div>
              <p className="sc-eyebrow">Choose your sector</p>
              <h2 id="sectors-title">Every model is sector-specific. Pick yours.</h2>
            </div>
            <p>
              Each model is built around the inputs, units and failure modes of
              a single industry. No generic calculators — only tools that speak
              your operating language.
            </p>
          </div>

          {/* 2 Featured cards (asymmetric 7+5) */}
          <div className="sc-featured-grid">
            {featuredSectors.map((s) => (
              <Link key={s.slug} href={s.href} className="sc-featured-card">
                <div className="sc-featured-icon">
                  {s.slug === "manufacturing" ? <BuildingIcon /> : <CurrencyIcon />}
                </div>
                <div className="sc-featured-count">
                  {s.count}<small>{s.label}</small>
                </div>
                <h3>{s.title}</h3>
                <p>{s.description}</p>
                <span className="sc-featured-arrow">
                  Browse {s.count} models
                  <ArrowRight />
                </span>
              </Link>
            ))}
          </div>

          {/* 6 Compact cards */}
          <div className="sc-compact-grid">
            {compactSectors.map((s) => (
              <Link key={s.name} href={s.href} className="sc-compact-card">
                <span className="sc-compact-name">{s.name}</span>
                <span className="sc-compact-count">{s.count} →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ CASE STUDY ══════════════ */}
      <section className="sc-case-study" id="case-study" aria-labelledby="case-title">
        <div className="sc-shell">
          <div className="sc-case-grid">
            <div>
              <p className="sc-eyebrow">Real workflow · Real result</p>
              <h2 id="case-title">
                A German automotive supplier cut scrap cost by 34% in one quarter.
              </h2>
              <p className="sc-case-meta">
                <strong>Inputs:</strong> 12 operating parameters from the shop floor.<br />
                <strong>Output:</strong> A 4-minute decision report with sensitivity bands.<br />
                <strong>Standard:</strong> ISO 22400-2, verified by in-house engineering.
              </p>
            </div>
            <div>
              <div className="sc-case-metrics">
                <div className="sc-case-metric">
                  <div className="sc-metric-value">−34%</div>
                  <div className="sc-metric-label">scrap cost</div>
                </div>
                <div className="sc-case-metric">
                  <div className="sc-metric-value">4 min</div>
                  <div className="sc-metric-label">report time</div>
                </div>
                <div className="sc-case-metric">
                  <div className="sc-metric-value">12</div>
                  <div className="sc-metric-label">parameters</div>
                </div>
                <div className="sc-case-metric">
                  <div className="sc-metric-value">±€420</div>
                  <div className="sc-metric-label">sensitivity band</div>
                </div>
              </div>
              <div className="sc-case-signature">
                Anonymized · Tier 1 automotive supplier · North Rhine-Westphalia · Q1 2026
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ PRICING ══════════════ */}
      <section className="sc-pricing" id="pricing" aria-labelledby="pricing-title">
        <div className="sc-shell">
          <div className="sc-pricing-header">
            <p className="sc-eyebrow">Two tiers, one standard</p>
            <h2 id="pricing-title">Free to start. Pro when the decision locks.</h2>
            <p>No credit card for free tools. Pro adds sensitivity analysis, tolerance zones and audit-ready export.</p>
          </div>

          <div className="sc-pricing-table">
            <div className="sc-pricing-row sc-header">
              <div>Feature</div>
              <div>Free</div>
              <div>Pro</div>
            </div>
            <div className="sc-pricing-row">
              <div className="sc-pricing-feature">Formula logic transparency</div>
              <div className="sc-pricing-check">✓</div>
              <div className="sc-pricing-check">✓</div>
            </div>
            <div className="sc-pricing-row">
              <div className="sc-pricing-feature">Sensitivity analysis</div>
              <div className="sc-pricing-dash">—</div>
              <div className="sc-pricing-check">✓</div>
            </div>
            <div className="sc-pricing-row">
              <div className="sc-pricing-feature">Tolerance & risk zones</div>
              <div className="sc-pricing-dash">—</div>
              <div className="sc-pricing-check">✓</div>
            </div>
            <div className="sc-pricing-row">
              <div className="sc-pricing-feature">Export-ready reports</div>
              <div className="sc-pricing-dash">—</div>
              <div className="sc-pricing-check">✓</div>
            </div>
            <div className="sc-pricing-row">
              <div className="sc-pricing-feature">Standards validation (ISO/ASME/VDI)</div>
              <div className="sc-pricing-dash">—</div>
              <div className="sc-pricing-check">✓</div>
            </div>
            <div className="sc-pricing-row sc-pricing-total">
              <div className="sc-pricing-feature">Price</div>
              <div className="sc-pricing-price">€0</div>
              <div className="sc-pricing-price">€29/mo</div>
            </div>
          </div>

          <div className="sc-pricing-cta">
            <Link href="/free-tools" className="sc-cta-primary">
              Start free — no card required
              <ArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════ SEO SUMMARY ══════════════ */}
      <section className="sc-section" aria-label="SectorCalc platform summary" style={{ paddingBlock: "var(--s-3)", borderBottom: "none" }}>
        <div className="sc-shell">
          <p style={{ color: "var(--sc-stone)", fontSize: "0.8125rem", lineHeight: 1.65, margin: 0 }}>
            SectorCalc provides industrial calculators and decision tools for manufacturing,
            machining, welding, quality, maintenance, construction, energy, logistics and finance.
            Use free calculators for fast operational checks, Pro tools for sensitivity and
            report-grade analysis, and Engineering Diagnostics for evidence-led issue investigation.
          </p>
        </div>
      </section>
    </div>
  );
}
