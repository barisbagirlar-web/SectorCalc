"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { CalculationFeedbackModal } from "@/components/feedback/CalculationFeedbackModal";
import "@/styles/landing-page.css";

interface Sector {
  k: string;
  name: string;
  n: number;
}

interface Tool {
  sec: string;
  name: string;
  eq: string;
  slug: string;
}

interface ApiTool {
  id: string;
  title: string;
  sector: string;
  slug: string;
  tags: string[];
}

export function NewLandingContent({
  freeCount = 358,
  sectors = [],
  tools = [],
}: {
  freeCount?: number;
  sectors?: Sector[];
  tools?: Tool[];
}) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [calculators, setCalculators] = useState<ApiTool[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [openFeedback, setOpenFeedback] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const getSectorToolCount = (sectorName: string): number => {
    const term = sectorName.toLowerCase();
    let sum = 0;
    
    sectors.forEach(s => {
      const name = s.name.toLowerCase();
      
      if (term === "manufacturing") {
        if (name.includes("manufacturing") || name.includes("production") || name.includes("imalat") || name.includes("uretim")) {
          sum += s.n;
        }
      } else if (term === "workshops") {
        if (name.includes("workshop") || name.includes("atolye") || name.includes("repair") || name.includes("tamir")) {
          sum += s.n;
        }
      } else if (term === "engineering") {
        if (name.includes("engineering") || name.includes("design") || name.includes("tasarim") || name.includes("technical") || name.includes("mechanical") || name.includes("makine") || name.includes("metal")) {
          sum += s.n;
        }
      } else if (term === "construction") {
        if (name.includes("construction") || name.includes("building") || name.includes("insaat") || name.includes("yapi")) {
          sum += s.n;
        }
      } else if (term === "energy") {
        if (name.includes("energy") || name.includes("enerji") || name.includes("electricity") || name.includes("power") || name.includes("carbon")) {
          sum += s.n;
        }
      } else if (term === "logistics") {
        if (name.includes("logistics") || name.includes("shipping") || name.includes("freight") || name.includes("transport") || name.includes("kargo") || name.includes("sevkiyat") || name.includes("routing")) {
          sum += s.n;
        }
      } else if (term === "finance") {
        if (name.includes("finance") || name.includes("accounting") || name.includes("finans") || name.includes("muhasebe") || name.includes("cost") || name.includes("maliyet") || name.includes("budget")) {
          sum += s.n;
        }
      } else if (term === "business") {
        if (name.includes("business") || name.includes("retail") || name.includes("commerce") || name.includes("perakende") || name.includes("store") || name.includes("hr") || name.includes("personnel") || name.includes("other") || name.includes("diger")) {
          sum += s.n;
        }
      }
    });
    
    return sum;
  };

  useEffect(() => {
    if (tools && tools.length > 0) {
      const mappedTools = tools.map((t) => ({
        id: t.slug,
        title: t.name,
        sector: t.sec,
        slug: t.slug,
        tags: [t.eq].filter(Boolean),
      }));
      setCalculators(mappedTools);
    }
  }, [tools]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 200);
    return () => clearTimeout(timer);
  }, [query]);

  const fuzzyMatch = (q: string, text: string) => {
    const qLower = q.toLowerCase().trim();
    const tLower = text?.toLowerCase() || "";
    return qLower.split(/\s+/).every((word) => tLower.includes(word));
  };

  const matches = useMemo(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) return [];
    return calculators.filter((c) =>
      fuzzyMatch(debouncedQuery, c.title) ||
      fuzzyMatch(debouncedQuery, c.sector) ||
      (c.tags && c.tags.some((t) => fuzzyMatch(debouncedQuery, t)))
    );
  }, [debouncedQuery, calculators]);

  const highlight = (text: string, q: string) => {
    if (!q.trim()) return text;
    const words = q.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return text;
    const regex = new RegExp(`(${words.join('|')})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape") {
        setQuery("");
        inputRef.current?.blur();
        setIsFocused(false);
      }
    };
    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, []);

  return (
    <div className="claude-landing">
      <main>
        {/* HERO */}
        <section className="hero">
          <div className="wrap">
            <p className="eyebrow">Trusted by engineers in 40+ countries</p>
            <h1>Engineering Calculators for Mechanical, Civil &amp; Electrical Teams</h1>
            <p className="subhead">
              {freeCount}+ standards-based calculators. ISO, ASME, VDI, DIN, IEC, EN references.
              Free to use, auditable, exportable.
            </p>

            <div className="search-wrapper" id="searchWrapper" ref={wrapperRef}>
              <input
                ref={inputRef}
                type="text"
                id="searchInput"
                placeholder={`Search ${freeCount}+ engineering calculators...`}
                autoComplete="off"
                aria-label="Search calculators"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setExpanded(false);
                  setIsFocused(true);
                }}
                onFocus={() => setIsFocused(true)}
              />
              <span className="search-kbd">/</span>
              {isFocused && debouncedQuery.length >= 2 && (
                <div id="searchResults" className="search-results">
                  {matches.length === 0 ? (
                    <div className="search-result-item">
                      <span className="result-title">No results found</span>
                    </div>
                  ) : (
                    <>
                      {(expanded ? matches : matches.slice(0, 10)).map((c) => (
                        <Link
                          key={c.id}
                          href={`/tools/generated/${c.slug}`}
                          className="search-result-item"
                        >
                          <span
                            className="result-title"
                            dangerouslySetInnerHTML={{ __html: highlight(c.title, debouncedQuery) }}
                          ></span>
                          <span className="result-sector">{c.sector}</span>
                        </Link>
                      ))}
                      {matches.length > 10 && !expanded && (
                        <button
                          className="show-more-btn"
                          onClick={() => setExpanded(true)}
                        >
                          Show {matches.length - 10} more results
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="cta-row">
              <Link href="#sectorGrid" className="btn-primary" onClick={(e) => { e.preventDefault(); document.getElementById('sectorGrid')?.scrollIntoView({ behavior: 'smooth' }); }}>Browse All Calculators</Link>
              <Link href="/pricing" className="btn-secondary">Upgrade to Pro</Link>
            </div>

            <div className="standards-strip">
              <span>Verified against:</span>
              <span>ISO 9001</span><span>ASME BPVC</span><span>VDI 2230</span>
              <span>DIN EN 1990</span><span>IEC 60071</span><span>EN 1090</span>
            </div>
          </div>
        </section>

        {/* TRUST STRIP */}
        <section className="corp-trust-strip">
          <div className="wrap">
            <h3 className="trust-title">Built for Practical Calculation Workflows</h3>
            <div className="trust-items">
              <span>Manufacturing & Workshops</span>
              <span>Engineering & Construction</span>
              <span>Energy & Operations</span>
              <span>Logistics & Service</span>
              <span>Finance & Business</span>
            </div>
            <p className="trust-support">
              Use SectorCalc to screen decisions, compare scenarios, and identify hidden cost, risk, waste, and performance gaps.
            </p>
          </div>
        </section>

        {/* CATEGORY SECTION */}
        <section className="sec-section corp-categories" id="sectorGrid">
          <div className="wrap">
            <div className="sec-head">
              <h2>Find the Right Calculator by Sector</h2>
              <div className="meta">Choose a sector and start with the calculation that matches your workflow.</div>
            </div>
            
            <div className="grid cat-grid">
              <div className="cat-card">
                <h4>Manufacturing {getSectorToolCount("manufacturing") > 0 && `(${getSectorToolCount("manufacturing")})`}</h4>
                <p>Machine hour rate, OEE, scrap, setup time, throughput, and production cost calculators.</p>
                <Link href="/tools/category/imalat-uretim" className="btn-link">
                  Browse {getSectorToolCount("manufacturing") > 0 ? `${getSectorToolCount("manufacturing")} ` : ""}Manufacturing Calculators &rarr;
                </Link>
              </div>
              <div className="cat-card">
                <h4>Workshops {getSectorToolCount("workshops") > 0 && `(${getSectorToolCount("workshops")})`}</h4>
                <p>Quote pricing, labor rate, job costing, material use, and margin calculators for shop-floor decisions.</p>
                <Link href="/tools/category/bakim-guvenilirlik" className="btn-link">
                  Browse {getSectorToolCount("workshops") > 0 ? `${getSectorToolCount("workshops")} ` : ""}Workshop Calculators &rarr;
                </Link>
              </div>
              <div className="cat-card">
                <h4>Engineering {getSectorToolCount("engineering") > 0 && `(${getSectorToolCount("engineering")})`}</h4>
                <p>Torque, tolerance, load, sizing, conversion, and technical calculation tools for engineering checks.</p>
                <Link href="/tools/category/makine-tasarim" className="btn-link">
                  Browse {getSectorToolCount("engineering") > 0 ? `${getSectorToolCount("engineering")} ` : ""}Engineering Calculators &rarr;
                </Link>
              </div>
              <div className="cat-card">
                <h4>Construction {getSectorToolCount("construction") > 0 && `(${getSectorToolCount("construction")})`}</h4>
                <p>Concrete, volume, quantity, material, roof, labor, and project estimation calculators.</p>
                <Link href="/tools/category/insaat-yapi" className="btn-link">
                  Browse {getSectorToolCount("construction") > 0 ? `${getSectorToolCount("construction")} ` : ""}Construction Calculators &rarr;
                </Link>
              </div>
              <div className="cat-card">
                <h4>Energy {getSectorToolCount("energy") > 0 && `(${getSectorToolCount("energy")})`}</h4>
                <p>kWh, compressor leak, carbon, peak load, efficiency, and consumption calculators.</p>
                <Link href="/tools/category/enerji-surdurulebilirlik" className="btn-link">
                  Browse {getSectorToolCount("energy") > 0 ? `${getSectorToolCount("energy")} ` : ""}Energy Calculators &rarr;
                </Link>
              </div>
              <div className="cat-card">
                <h4>Logistics {getSectorToolCount("logistics") > 0 && `(${getSectorToolCount("logistics")})`}</h4>
                <p>Freight, route, fuel, dimensional weight, delivery cost, and service efficiency calculators.</p>
                <Link href="/tools/category/lojistik-tedarik-zinciri" className="btn-link">
                  Browse {getSectorToolCount("logistics") > 0 ? `${getSectorToolCount("logistics")} ` : ""}Logistics Calculators &rarr;
                </Link>
              </div>
              <div className="cat-card">
                <h4>Finance {getSectorToolCount("finance") > 0 && `(${getSectorToolCount("finance")})`}</h4>
                <p>VAT, payroll, depreciation, loan, margin, break-even, and cash impact calculators.</p>
                <Link href="/tools/category/maliyet-butceleme" className="btn-link">
                  Browse {getSectorToolCount("finance") > 0 ? `${getSectorToolCount("finance")} ` : ""}Finance Calculators &rarr;
                </Link>
              </div>
              <div className="cat-card">
                <h4>Retail & Business {getSectorToolCount("business") > 0 && `(${getSectorToolCount("business")})`}</h4>
                <p>Stock, waste, discount, margin, pricing, and operational cost calculators.</p>
                <Link href="/tools/category/proje-yatirim" className="btn-link">
                  Browse {getSectorToolCount("business") > 0 ? `${getSectorToolCount("business")} ` : ""}Business Calculators &rarr;
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* WHY SECTORCALC */}
        <section className="sec-section why-section">
          <div className="wrap">
            <div className="sec-head">
              <h2>More Than a Number</h2>
              <div className="meta">A calculator is useful only when the result is explainable. SectorCalc is designed to show the calculation logic behind the output.</div>
            </div>
            <div className="grid feature-grid">
              <div className="feature-card">
                <h4>Formula Logic</h4>
                <p>Understand what the formula measures, how the inputs affect the result, and where input errors can distort the output.</p>
              </div>
              <div className="feature-card">
                <h4>Tolerance Guidance</h4>
                <p>Classify results into practical decision zones such as optimal, acceptable, watch, warning, and professional review recommended.</p>
              </div>
              <div className="feature-card">
                <h4>Assumptions & Limitations</h4>
                <p>See the declared assumptions and limitations before relying on a result for technical, financial, operational, or commercial decisions.</p>
              </div>
              <div className="feature-card">
                <h4>Professional Review Notes</h4>
                <p>Know when the result should be escalated to a qualified professional, project review, or site-specific assessment.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FREE VS PRO */}
        <section className="sec-section pricing-split">
          <div className="wrap">
            <h2>Start Free. Go Deeper When the Decision Matters.</h2>
            <div className="split-grid">
              <div className="split-col free-col">
                <h3>Free Calculators</h3>
                <p>Use fast calculators for common cost, production, energy, finance, logistics, and business questions.</p>
                <ul>
                  <li>Fast formula-based results</li>
                  <li>No sign-up required</li>
                  <li>Basic interpretation</li>
                  <li>Calculation transparency where available</li>
                  <li>Practical starting point for everyday decisions</li>
                </ul>
                <Link href="/free-tools" className="btn-primary">Start Free Calculations</Link>
              </div>
              <div className="split-col pro-col">
                <h3>Pro Calculators</h3>
                <p>Use pro calculators when the decision needs deeper inputs, scenario comparison, tolerance guidance, audit-ready explanation, or report-level evidence.</p>
                <ul>
                  <li>Advanced formula logic</li>
                  <li>Deeper result interpretation</li>
                  <li>Tolerance and risk zones</li>
                  <li>Engineering authority where available</li>
                  <li>Decision summary and report-ready output where supported</li>
                </ul>
                <Link href="/free-tools" className="btn-secondary">Explore Free Tools</Link>
              </div>
            </div>
          </div>
        </section>

        {/* FORMULA TRANSPARENCY */}
        <section className="sec-section transparency-section">
          <div className="wrap">
            <h2>Formula-Backed Results You Can Explain</h2>
            <p className="section-desc">SectorCalc is being structured so calculator outputs can show formula logic, input meaning, tolerance guidance, result interpretation, assumptions, limitations, and professional review triggers.</p>
            <div className="flex-cards">
              <div className="card">What was calculated</div>
              <div className="card">Why each input matters</div>
              <div className="card">How the result should be interpreted</div>
              <div className="card">When the result needs review</div>
            </div>
            <div className="cta-center">
              <Link href="/calculator-library" className="btn-primary">Search Calculators</Link>
            </div>
          </div>
        </section>

        {/* PROFESSIONAL USE CASES */}
        <section className="sec-section usecases-section">
          <div className="wrap">
            <h2>Built for Workflows Where Small Errors Become Real Costs</h2>
            <div className="uc-grid">
              <div className="uc-card">
                <h4>Production</h4>
                <p><strong>Problem:</strong> Scrap, downtime, setup delays, and weak quotes reduce margin.</p>
                <p><strong>SectorCalc helps:</strong> Convert operational inputs into measurable cost, time, and performance signals.</p>
              </div>
              <div className="uc-card">
                <h4>Workshops</h4>
                <p><strong>Problem:</strong> Jobs are priced from experience instead of measured cost.</p>
                <p><strong>SectorCalc helps:</strong> Compare material, labor, setup, overhead, and margin before quoting.</p>
              </div>
              <div className="uc-card">
                <h4>Engineering</h4>
                <p><strong>Problem:</strong> Technical checks need transparent formula logic and documented assumptions.</p>
                <p><strong>SectorCalc helps:</strong> Turn declared inputs into reviewable calculation outputs.</p>
              </div>
              <div className="uc-card">
                <h4>Finance</h4>
                <p><strong>Problem:</strong> Margins, taxes, payroll, loans, and cash impact are often checked too late.</p>
                <p><strong>SectorCalc helps:</strong> Screen financial effects before the decision is locked.</p>
              </div>
              <div className="uc-card">
                <h4>Energy</h4>
                <p><strong>Problem:</strong> Leaks, inefficient equipment, and peak demand create invisible loss.</p>
                <p><strong>SectorCalc helps:</strong> Translate consumption and efficiency gaps into measurable cost signals.</p>
              </div>
              <div className="uc-card">
                <h4>Supply Chain & Inventory</h4>
                <p><strong>Problem:</strong> Demand forecast errors, lead time variability, multi-tier visibility gaps, and working capital inefficiencies cascade across global networks.</p>
                <p><strong>SectorCalc helps:</strong> Transform inventory parameters, supplier constraints, and demand signals into optimized stock levels and cash-flow impacts.</p>
              </div>
            </div>
          </div>
        </section>

        {/* SOCIAL PROOF */}
        <section className="sec-section community-section">
          <div className="wrap">
            <h2>User Feedback &amp; Reviews</h2>
            <p className="section-desc">
              SectorCalc feedback is manually reviewed before publication. We don&apos;t publish fake reviews or paid testimonials.
            </p>
            
            <div className="empty-feedback" style={{
              background: "var(--surface)",
              border: "2px dashed var(--border-strong)",
              borderRadius: "12px",
              padding: "48px 32px",
              marginBottom: "32px",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>💬</div>
              <h3 style={{
                fontFamily: "var(--serif)",
                fontSize: "20px",
                fontWeight: 600,
                color: "var(--ink)",
                marginBottom: "12px"
              }}>
                Be the First to Share Your Experience
              </h3>
              <p style={{
                color: "var(--muted)",
                fontSize: "14.5px",
                lineHeight: 1.6,
                marginBottom: "24px",
                maxWidth: "480px",
                marginLeft: "auto",
                marginRight: "auto"
              }}>
                Help others by sharing how you used SectorCalc in a real calculation workflow.
              </p>
              <button
                onClick={() => setOpenFeedback(true)}
                className="btn-primary"
                style={{
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "var(--sans)",
                  fontWeight: 600,
                  fontSize: "15px"
                }}
              >
                Share Feedback
              </button>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="sec-section final-cta">
          <div className="wrap text-center">
            <h2>Start With the Calculation That Matches Your Decision</h2>
            <p className="meta-subtitle">Use free calculators for fast checks. Use pro calculators when the result needs deeper explanation, tolerance guidance, or report-ready evidence.</p>
            
            <div className="cta-row main-actions center">
              <Link href="/free-tools" className="btn-primary">Start Free Calculations</Link>
              <Link href="/free-tools" className="btn-secondary">Explore Calculators</Link>
            </div>
          </div>
        </section>

        {/* SEO BLOCK */}
        <section className="seo-block">
          <div className="wrap">
            <p>SectorCalc provides professional calculators for manufacturing, engineering, workshops, construction, logistics, energy, finance, retail, and business operations. Use the platform to estimate costs, compare scenarios, identify waste, check formula-based results, and support practical decisions with transparent calculation logic.</p>
          </div>
        </section>
      </main>

      {openFeedback && (
        <CalculationFeedbackModal
          toolSlug=""
          toolType="free"
          locale="en"
          routePath="/"
          onClose={() => setOpenFeedback(false)}
        />
      )}
    </div>
  );
}
