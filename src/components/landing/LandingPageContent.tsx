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

export function LandingPageContent({
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
            <p className="eyebrow">Trusted by industrial engineering teams</p>
            <h1>Engineering-Grade Calculation &amp; Decision Platform</h1>
            <p className="subhead">
              {freeCount}+ standards-backed models for manufacturing, engineering, and operations. Built on ISO, ASME, VDI, and DIN references. Calculate, verify, and document your technical decisions.
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
              <Link href="#sectorGrid" className="btn-primary" onClick={(e) => { e.preventDefault(); document.getElementById('sectorGrid')?.scrollIntoView({ behavior: 'smooth' }); }}>Browse Calculation Models</Link>
              <Link href="/pricing" className="btn-secondary">Explore Pro Features</Link>
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
            <h3 className="trust-title">Built for Industrial Decision Workflows</h3>
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
              <h2>Find the Right Calculation Model by Sector</h2>
              <div className="meta">Choose a sector and start with the model that matches your workflow.</div>
            </div>
            
            <div className="grid cat-grid">
              <div className="cat-card">
                <h4>Manufacturing {getSectorToolCount("manufacturing") > 0 && `(${getSectorToolCount("manufacturing")})`}</h4>
                <p>Machine hour rate, OEE, scrap, setup time, throughput, and production cost models.</p>
                <Link href="/tools/category/imalat-uretim" className="btn-link">
                  Browse {getSectorToolCount("manufacturing") > 0 ? `${getSectorToolCount("manufacturing")} ` : ""}Manufacturing Models &rarr;
                </Link>
              </div>
              <div className="cat-card">
                <h4>Workshops {getSectorToolCount("workshops") > 0 && `(${getSectorToolCount("workshops")})`}</h4>
                <p>Quote pricing, labor rate, job costing, material yield, and margin models for shop-floor decisions.</p>
                <Link href="/tools/category/bakim-guvenilirlik" className="btn-link">
                  Browse {getSectorToolCount("workshops") > 0 ? `${getSectorToolCount("workshops")} ` : ""}Workshop Models &rarr;
                </Link>
              </div>
              <div className="cat-card">
                <h4>Engineering {getSectorToolCount("engineering") > 0 && `(${getSectorToolCount("engineering")})`}</h4>
                <p>Torque, tolerance, load, sizing, conversion, and technical calculation tools for engineering checks.</p>
                <Link href="/tools/category/makine-tasarim" className="btn-link">
                  Browse {getSectorToolCount("engineering") > 0 ? `${getSectorToolCount("engineering")} ` : ""}Engineering Models &rarr;
                </Link>
              </div>
              <div className="cat-card">
                <h4>Construction {getSectorToolCount("construction") > 0 && `(${getSectorToolCount("construction")})`}</h4>
                <p>Concrete, volume, quantity, material, roof, labor, and project estimation models.</p>
                <Link href="/tools/category/insaat-yapi" className="btn-link">
                  Browse {getSectorToolCount("construction") > 0 ? `${getSectorToolCount("construction")} ` : ""}Construction Models &rarr;
                </Link>
              </div>
              <div className="cat-card">
                <h4>Energy {getSectorToolCount("energy") > 0 && `(${getSectorToolCount("energy")})`}</h4>
                <p>kWh, compressor leak, carbon footprint, peak load, efficiency, and consumption models.</p>
                <Link href="/tools/category/enerji-surdurulebilirlik" className="btn-link">
                  Browse {getSectorToolCount("energy") > 0 ? `${getSectorToolCount("energy")} ` : ""}Energy Models &rarr;
                </Link>
              </div>
              <div className="cat-card">
                <h4>Logistics {getSectorToolCount("logistics") > 0 && `(${getSectorToolCount("logistics")})`}</h4>
                <p>Freight, route, fuel, dimensional weight, delivery cost, and service efficiency models.</p>
                <Link href="/tools/category/lojistik-tedarik-zinciri" className="btn-link">
                  Browse {getSectorToolCount("logistics") > 0 ? `${getSectorToolCount("logistics")} ` : ""}Logistics Models &rarr;
                </Link>
              </div>
              <div className="cat-card">
                <h4>Finance {getSectorToolCount("finance") > 0 && `(${getSectorToolCount("finance")})`}</h4>
                <p>VAT, payroll, depreciation, loan, margin, break-even, and cash impact models.</p>
                <Link href="/tools/category/maliyet-butceleme" className="btn-link">
                  Browse {getSectorToolCount("finance") > 0 ? `${getSectorToolCount("finance")} ` : ""}Finance Models &rarr;
                </Link>
              </div>
              <div className="cat-card">
                <h4>Retail & Business {getSectorToolCount("business") > 0 && `(${getSectorToolCount("business")})`}</h4>
                <p>Stock, waste, discount, margin, pricing, and operational cost models.</p>
                <Link href="/tools/category/proje-yatirim" className="btn-link">
                  Browse {getSectorToolCount("business") > 0 ? `${getSectorToolCount("business")} ` : ""}Business Models &rarr;
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* WHY SECTORCALC */}
        <section className="sec-section why-section">
          <div className="wrap">
            <div className="sec-head">
              <h2>Calculations Built for Audit and Review</h2>
              <div className="meta">A calculation is useful only when the result is fully explainable. SectorCalc is designed to document the logic behind the output.</div>
            </div>
            <div className="grid feature-grid">
              <div className="feature-card">
                <h4>Transparent Formula Logic</h4>
                <p>Understand exactly what the model measures, how your inputs affect the result, and where input variations can alter the output.</p>
              </div>
              <div className="feature-card">
                <h4>Tolerance & Risk Zones</h4>
                <p>Classify results into practical decision zones: optimal, acceptable, watch, warning, or professional review recommended.</p>
              </div>
              <div className="feature-card">
                <h4>Assumptions & Limitations</h4>
                <p>Review declared operational assumptions and mathematical limitations before relying on a result for your technical decisions.</p>
              </div>
              <div className="feature-card">
                <h4>Professional Review Triggers</h4>
                <p>Know exactly when the result indicates a condition that requires escalation to a qualified professional or a site-specific assessment.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FREE VS PRO */}
        <section className="sec-section pricing-split">
          <div className="wrap">
            <h2>Scalable Calculation Logic: Free and Pro Tiers</h2>
            <div className="split-grid">
              <div className="split-col free-col">
                <h3>Free Tools</h3>
                <p>Use our open tools for fast estimates on production, energy, logistics, and finance questions.</p>
                <ul>
                  <li>Instant, formula-based results</li>
                  <li>No sign-up or credit card required</li>
                  <li>Basic result interpretation</li>
                  <li>Calculation transparency where applicable</li>
                  <li>Practical starting point for everyday decisions</li>
                </ul>
                <Link href="/free-tools" className="btn-primary">Browse Free Tools</Link>
              </div>
              <div className="split-col pro-col">
                <h3>Pro Platform</h3>
                <p>Upgrade when the decision requires deeper inputs, scenario analysis, tolerance guidance, and audit-ready reports.</p>
                <ul>
                  <li>Advanced formula logic and variable control</li>
                  <li>Deeper interpretation and sensitivity analysis</li>
                  <li>Tolerance and risk classification zones</li>
                  <li>Engineering authority and standards validation</li>
                  <li>Decision summaries and exportable reports</li>
                </ul>
                <Link href="/pro-tools" className="btn-secondary">Explore Pro Platform</Link>
              </div>
            </div>
          </div>
        </section>

        {/* FORMULA TRANSPARENCY */}
        <section className="sec-section transparency-section">
          <div className="wrap">
            <h2>Formula-Backed Results You Can Explain</h2>
            <p className="section-desc">SectorCalc is built so calculation outputs can expose formula logic, variable definitions, tolerance boundaries, assumptions, and professional review triggers.</p>
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
            <h2>Built for Workflows Where Minor Variances Cause Major Costs</h2>
            <div className="uc-grid">
              <div className="uc-card">
                <h4>Production & Operations</h4>
                <p><strong>Challenge:</strong> Scrap, downtime, setup delays, and weak quoting models erode margins.</p>
                <p><strong>Solution:</strong> Convert shop-floor inputs into measurable cost, time, and performance metrics.</p>
              </div>
              <div className="uc-card">
                <h4>Workshops & Fabrication</h4>
                <p><strong>Challenge:</strong> Jobs are often priced from estimation rather than modeled cost data.</p>
                <p><strong>Solution:</strong> Compare material, labor, setup, overhead, and margin before finalizing a quote.</p>
              </div>
              <div className="uc-card">
                <h4>Technical Engineering</h4>
                <p><strong>Challenge:</strong> Engineering checks require transparent formula logic and documented assumptions.</p>
                <p><strong>Solution:</strong> Turn declared parameters into reviewable, standards-backed calculation outputs.</p>
              </div>
              <div className="uc-card">
                <h4>Finance & Controlling</h4>
                <p><strong>Challenge:</strong> Margins, taxes, payroll, loans, and cash impacts are often realized too late.</p>
                <p><strong>Solution:</strong> Screen financial scenarios and run sensitivity analysis before decisions lock.</p>
              </div>
              <div className="uc-card">
                <h4>Energy & Facilities</h4>
                <p><strong>Challenge:</strong> Leaks, inefficient equipment, and peak demands create invisible financial losses.</p>
                <p><strong>Solution:</strong> Translate consumption variables and efficiency gaps into direct cost signals.</p>
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
            <h2>Start With the Model That Matches Your Decision</h2>
            <p className="meta-subtitle">Use free tools for fast checks. Use the Pro Platform when the result requires deeper explanation, tolerance analysis, or audit-ready documentation.</p>
            
            <div className="cta-row main-actions center">
              <Link href="/free-tools" className="btn-primary">Browse Free Tools</Link>
              <Link href="/pro-tools" className="btn-secondary">Explore Pro Platform</Link>
            </div>
          </div>
        </section>

        {/* SEO BLOCK */}
        <section className="seo-block">
          <div className="wrap">
            <p>SectorCalc provides professional calculation models for manufacturing, engineering, fabrication, construction, logistics, energy, finance, and business operations. Use the platform to estimate costs, conduct sensitivity analysis, verify engineering outputs, and document technical decisions with fully transparent calculation logic based on global standards.</p>
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
