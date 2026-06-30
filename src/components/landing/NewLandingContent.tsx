"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
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
  const inputRef = useRef<HTMLInputElement>(null);

  const [calculators, setCalculators] = useState<ApiTool[]>([]);
  const [sectorCount, setSectorCount] = useState(sectors.length);
  const [expanded, setExpanded] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadCalculators() {
      try {
        const res = await fetch('/api/calculators.json');
        const data = await res.json();
        if (data.calculators) {
          setCalculators(data.calculators);
        }
        if (data.sectorCount) {
          setSectorCount(data.sectorCount);
        }
      } catch (err) {
        console.error("Failed to load calculators", err);
      }
    }
    loadCalculators();
  }, []);

  const fuzzyMatch = (q: string, text: string) => {
    const qLower = q.toLowerCase().trim();
    const tLower = text?.toLowerCase() || "";
    return qLower.split(/\s+/).every((word) => tLower.includes(word));
  };

  const matches = useMemo(() => {
    if (!query || query.length < 2) return [];
    return calculators.filter((c) =>
      fuzzyMatch(query, c.title) ||
      fuzzyMatch(query, c.sector) ||
      (c.tags && c.tags.some((t) => fuzzyMatch(query, t)))
    );
  }, [query, calculators]);

  const highlight = (text: string, q: string) => {
    if (!q.trim()) return text;
    const words = q.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return text;
    const regex = new RegExp(`(${words.join('|')})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  };

  // Keep old grid filtering so that the page still updates
  const filteredSectors = useMemo(() => {
    if (!query.trim()) return sectors;
    const q = query.toLowerCase();
    return sectors.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.k.toLowerCase().includes(q)
    );
  }, [query, sectors]);

  const filteredTools = useMemo(() => {
    if (!query.trim()) return tools.slice(0, 12);
    const q = query.toLowerCase();
    return tools.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.sec.toLowerCase().includes(q) ||
        t.eq.toLowerCase().includes(q)
    );
  }, [query, tools]);

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

  const totalShown = Math.max(filteredSectors.length, filteredTools.length);
  const isSearchActive = query.trim().length > 0;

  return (
    <div className="claude-landing">
      <main>
        {/* HERO */}
        <section className="hero">
          <div className="wrap">
            <p className="eyebrow">Trusted by engineers in 40+ countries</p>
            <h1>
              Engineering Calculators for Mechanical, Civil &amp; Electrical Teams
            </h1>
            <p className="lede">
              {freeCount}+ calculators built to international standards. ISO, ASME, VDI, DIN, IEC, EN references.
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
              {isFocused && query.length >= 2 && (
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
                            dangerouslySetInnerHTML={{ __html: highlight(c.title, query) }}
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
              <Link href="#sectors" className="btn-primary">
                Browse All Calculators
              </Link>
              <Link href="/pricing" className="btn-secondary">
                Upgrade to Pro
              </Link>
            </div>

            <div className="standards-strip">
              <span>Verified against:</span>
              <span>ISO 9001</span>
              <span>ASME BPVC</span>
              <span>VDI 2230</span>
              <span>DIN EN 1990</span>
              <span>IEC 60071</span>
              <span>EN 1090</span>
            </div>
          </div>
        </section>

        {/* SECTORS */}
        <section id="sectors" className="sec-section">
          <div className="wrap">
            <div className="sec-head">
              <h2>Browse by sector</h2>
              <div className="meta">{sectorCount} industrial sectors</div>
            </div>
            
            <div className="grid sectors" id="sectorGrid">
              {filteredSectors.map((s) => (
                <Link
                  key={s.k}
                  href={`/tools/category/${s.name.toLowerCase()}`}
                  className="tile"
                >
                  <span className="tile-name">
                    <b>{s.k}</b>
                    {s.name}
                  </span>
                  <span className="tile-count">{s.n}</span>
                </Link>
              ))}
            </div>

            {isSearchActive && filteredSectors.length === 0 && (
              <div className="empty show" id="sectorEmpty">
                No sector matches “<span className="qref">{query}</span>”. Try a tool name instead.
              </div>
            )}
          </div>
        </section>

        {/* POPULAR TOOLS */}
        <section id="popular" className="sec-section">
          <div className="wrap">
            <div className="sec-head">
              <h2>{isSearchActive ? "Search Results" : "Most used calculators"}</h2>
              <div className="meta">updated weekly</div>
            </div>
            
            <div className="grid tools" id="toolGrid">
              {filteredTools.map((t) => (
                <Link
                  key={t.slug}
                  href={`/tools/generated/${t.slug}`}
                  className="tool"
                >
                  <span className="tool-sec">{t.sec}</span>
                  <span className="tool-name">{t.name}</span>
                  <span className="tool-eq">{t.eq}</span>
                </Link>
              ))}
            </div>

            {isSearchActive && filteredTools.length === 0 && (
              <div className="empty show" id="toolEmpty">
                No tool matches “<span className="qref">{query}</span>”.
              </div>
            )}
          </div>
        </section>

        {/* TRUST / STANDARDS */}
        <section className="trust sec-section">
          <div className="wrap">
            <div className="label">Every calculation is standards-backed</div>
            <div className="badges">
              <div className="badge">
                ISO<small>Int’l Standards</small>
              </div>
              <div className="badge">
                ASME<small>Mech. Engineers</small>
              </div>
              <div className="badge">
                VDI<small>German Eng.</small>
              </div>
              <div className="badge">
                DIN<small>German Inst.</small>
              </div>
              <div className="badge">
                IEC<small>Electrotech.</small>
              </div>
              <div className="badge">
                EN<small>European Norm</small>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta sec-section">
          <div className="wrap">
            <h2>From a quick check to a full audit trail.</h2>
            <p>
              Run any calculation free. Unlock FMEA, uncertainty quantification, and exportable reports with Pro.
            </p>
            <div>
              <Link className="btn" href="#sectors">
                Explore tools
              </Link>
              <Link className="btn ghost" href="/pricing">
                See Pro
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
