"use client";

import Link from "next/link";
import "@/styles/landing-page.css";

export function LandingPageContent() {
  return (
    <div className="claude-landing">
      <main>
        {/* ── HERO ── */}
        <section className="hero">
          <div className="wrap">
            <p className="eyebrow">INDUSTRIAL CALCULATORS FOR REAL OPERATING DECISIONS</p>
            <h1>Calculate cost, risk, downtime, and production decisions before they become expensive mistakes.</h1>
            <p className="subhead">
              Use SectorCalc to estimate shop-floor costs, compare scenarios, check margins, diagnose losses, and prepare decision-ready reports for manufacturing, finance, operations, and engineering work.
            </p>
            <div className="cta-row">
              <Link href="/free-tools" prefetch={true} className="btn-primary">Explore Free Calculators</Link>
              <Link href="/pro-tools" prefetch={true} className="btn-secondary">View Pro Tools</Link>
            </div>
            {/* FIX 1: Metrics band replaces empty proof-line — real inventory data */}
            <div className="trust-row">
              <span>50 free calculators</span>
              <span>20 Pro analyzers</span>
              <span>27 industry sectors</span>
              <span>ISO/ASME-referenced methods</span>
            </div>
          </div>
        </section>

        {/* ── OUTCOME CARDS (keep — direct, scannable) ── */}
        <section className="sec-section outcome-section">
          <div className="wrap">
            <div className="grid outcome-grid">
              <div className="outcome-card">
                <h3>Find the number behind the problem</h3>
                <p>Calculate machine cost, OEE, scrap, quote margin, energy loss, payback, downtime, FMEA RPN and engineering risk using structured inputs instead of rough guesses.</p>
                <Link href="/free-tools" prefetch={true} className="btn-link">Search calculators &rarr;</Link>
              </div>
              <div className="outcome-card">
                <h3>Decide what to do next</h3>
                <p>Each result must explain the decision: proceed, hold, reprice, inspect, repair, reduce risk, escalate or prepare a review-ready report.</p>
                <Link href="/pro-tools" prefetch={true} className="btn-link">Explore Pro Tools &rarr;</Link>
              </div>
              <div className="outcome-card">
                <h3>Diagnose field issues from evidence</h3>
                <p>Upload photos, add measurements, confirm context and generate an Engineering Diagnostics report with root-cause hypotheses, cost exposure, NCR/CAPA drafts and verification records.</p>
                <Link href="/engineering-diagnostics" prefetch={true} className="btn-link">Start Diagnostics &rarr;</Link>
              </div>
            </div>
          </div>
        </section>

        {/* FIX 2: Merged product paths + problem areas (one section instead of two separate ones) */}
        <section className="sec-section product-system-section">
          <div className="wrap">
            <h2>One platform. Three decision paths.</h2>
            <div className="grid product-grid">
              <div className="product-card"><h3>Free Tools</h3><p>Start with fast industrial calculators for everyday checks: cost, margin, energy, production, logistics, finance and basic engineering questions.</p><Link href="/free-tools" prefetch={true} className="btn-link">Browse Free Tools &rarr;</Link></div>
              <div className="product-card"><h3>Pro Tools</h3><p>Use deeper calculators when the decision needs sensitivity, tolerance guidance, business impact, scenario comparison, uncertainty notes, PDF output or review-ready documentation.</p><Link href="/pro-tools" prefetch={true} className="btn-link">Explore Pro Tools &rarr;</Link></div>
              <div className="product-card"><h3>Engineering Diagnostics</h3><p>Use photos, measurements and field context to create structured diagnostic reports for visible defects, failures, quality issues, maintenance problems and corrective-action discussions.</p><Link href="/engineering-diagnostics" prefetch={true} className="btn-link">Start Engineering Diagnostics &rarr;</Link></div>
            </div>
            {/* Compressed sector reference strip — preserves SEO keywords without a separate section */}
            <div className="sector-strip">
              <span className="sector-strip-label">Sectors:</span>
              <span>CNC / machining</span><span>Welding / fabrication</span><span>Quality / maintenance</span>
              <span>Construction / engineering</span><span>Energy / facilities</span>
              <span>Logistics / inventory</span><span>Finance / controlling</span>
            </div>
          </div>
        </section>

        {/* FIX 3: Case study cards with real anonymized figures */}
        <section className="sec-section casestudies-section">
          <div className="wrap">
            <h2>Real calculation workflows, real operational impact</h2>
            <p className="section-intro">SectorCalc case studies show how calculation-backed decisions exposed wasted cost, weak process controls, quote leakage and avoidable operational losses.</p>
            <div className="grid cs-grid">
              <div className="cs-card"><h4>CNC workshop (Turkey)</h4><p>OEE gap and quote leakage identified via machining cost and scrap-rate analysis — <strong>€85K/yr</strong> savings.</p></div>
              <div className="cs-card"><h4>Energy / carbon (Turkey)</h4><p>Carbon reporting automation reduced manual compliance overhead — <strong>€32K/yr</strong> efficiency gain.</p></div>
              <div className="cs-card"><h4>Welding / metal (Turkey)</h4><p>Weld cost reduction and rework prevention through consumable and process optimization — <strong>€45K/yr</strong> savings.</p></div>
              <div className="cs-card"><h4>Automotive supply chain (Germany)</h4><p>5S audit score improved through OEE, SMED and scrap optimization — <strong>€1.23M/yr</strong> operational savings.</p></div>
            </div>
            <div className="cta-center"><Link href="/case-studies" prefetch={true} className="btn-primary">View Case Studies</Link></div>
          </div>
        </section>

        {/* FIX 4: Methodology with visual icons — no longer pure text wall */}
        <section className="sec-section methodology-section">
          <div className="wrap">
            <h2>What every serious calculation should show</h2>
            <div className="grid meth-grid">
              <div className="meth-card"><span className="meth-icon meth-icon-calc">#</span>What was calculated</div>
              <div className="meth-card"><span className="meth-icon meth-icon-io">&#8597;</span>Which inputs changed the result</div>
              <div className="meth-card"><span className="meth-icon meth-icon-risk">&#9888;</span>Where the tolerance or risk zone starts</div>
              <div className="meth-card"><span className="meth-icon meth-icon-flip">&#9889;</span>What can flip the decision</div>
              <div className="meth-card"><span className="meth-icon meth-icon-evidence">&#10067;</span>What evidence is missing</div>
              <div className="meth-card"><span className="meth-icon meth-icon-action">&#9654;</span>What action should be taken next</div>
              <div className="meth-card meth-card-wide"><span className="meth-icon meth-icon-review">&#9878;</span>When qualified professional review is required</div>
            </div>
          </div>
        </section>

        {/* FIX 5: Diagnostics section with a report preview mockup (no more bullet-only) + FMEA integrated into outcome cards */}
        <section className="sec-section diagnostics-section">
          <div className="wrap">
            <h2>From field evidence to structured reports</h2>
            <p className="section-intro">Upload photos, add measurements, describe the issue. SectorCalc generates structured diagnostic reports with root-cause hypotheses, cost exposure, NCR/CAPA drafts and verification records.</p>
            <div className="diagnostics-preview">
              <div className="diagnostics-preview-card">
                <div className="diagnostics-preview-ribbon">SAMPLE REPORT</div>
                <div className="diagnostics-preview-header">Engineering Diagnostics Report</div>
                <div className="diagnostics-preview-ref">REF: ED-2026-0042 &middot; v1.0 &middot; ISO 9001</div>
                <div className="diagnostics-preview-body">
                  <div className="diagnostics-preview-row"><span className="dpr-key">Issue</span><span className="dpr-val">Weld porosity on ISO 5817 B</span></div>
                  <div className="diagnostics-preview-row"><span className="dpr-key">Root cause</span><span className="dpr-val">Shielding gas flow below 12 L/min range</span></div>
                  <div className="diagnostics-preview-row"><span className="dpr-key">Cost exposure</span><span className="dpr-val">EUR 4,200</span></div>
                  <div className="diagnostics-preview-row"><span className="dpr-key">NCR draft</span><span className="dpr-val">Available</span></div>
                  <div className="diagnostics-preview-row"><span className="dpr-key">CAPA proposal</span><span className="dpr-val">Flow meter calibration + operator retraining</span></div>
                  <div className="diagnostics-preview-row"><span className="dpr-key">Verification</span><span className="dpr-val">SHA-256: a3f2...c8e1</span></div>
                </div>
              </div>
              <div className="diagnostics-preview-text">
                <ul className="feature-bullets" style={{ margin: 0 }}>
                  <li>CNC, welding, steel, concrete, electrical and mechanical domains</li>
                  <li>Photo-based issue capture with measurement and calibration context</li>
                  <li>NCR / CAPA draft support</li>
                  <li>PDF report with verification hash</li>
                  <li>Decision-support only; qualified review required</li>
                </ul>
              </div>
            </div>
            <div className="cta-center"><Link href="/engineering-diagnostics" prefetch={true} className="btn-primary">Start Engineering Diagnostics</Link></div>
          </div>
        </section>

        {/* ── FINAL CTA (single, non-duplicated) ── */}
        <section className="sec-section cta-band">
          <div className="wrap text-center">
            <h2>Start with the decision you need to make today.</h2>
            <p className="cta-band-text">Use a free calculator for a quick check. Use Pro when the result affects price, production, quality, energy cost, rework, downtime, safety margin or customer commitment.</p>
            <div className="cta-row main-actions center">
              <Link href="/free-tools" prefetch={true} className="btn-primary">Browse Free Tools</Link>
              <Link href="/pro-tools" prefetch={true} className="btn-secondary">Explore Pro Tools</Link>
            </div>
          </div>
        </section>

        {/* FIX 6: SEO block condensed from 5 lines to 2 — no visible keyword stuffing */}
        <section className="seo-block">
          <div className="wrap">
            <p>Industrial calculators for manufacturing, energy, quality, logistics, and engineering decisions. Decision-support reports — not financial, legal, or engineering advice.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
