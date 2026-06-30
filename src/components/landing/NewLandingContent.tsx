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
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape") {
        setQuery("");
        inputRef.current?.blur();
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
            <div className="eyebrow">Engineering Calculation Platform</div>
            <h1>
              <span className="num" id="totalNum">
                {freeCount}+
              </span>{" "}
              engineering calculators, <br />
              built to the standard.
            </h1>
            <p className="lede">
              Search across {sectors.length} industrial sectors. Every result
              traceable, auditable, and grounded in ISO, ASME &amp; VDI
              references.
            </p>

            <div className="search" role="search">
              <div className="search-box">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="M21 21l-4.3-4.3" />
                </svg>
                <input
                  ref={inputRef}
                  id="q"
                  type="text"
                  autoComplete="off"
                  placeholder="Search a tool, sector, or formula — e.g. bolt torque, beam deflection…"
                  aria-label="Search calculators"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <span className="kbd">/</span>
              </div>
              <div className="counter" id="counter">
                {isSearchActive ? (
                  <>
                    <b>{totalShown}</b> match{totalShown === 1 ? "" : "es"} for “{query}”
                  </>
                ) : (
                  <>
                    <b>{freeCount}</b> tools across {sectors.length} sectors
                  </>
                )}
              </div>
            </div>

            <div className="standards-line">
              Verified against <span>ISO · ASME · VDI · DIN · IEC · EN</span>
            </div>
          </div>
        </section>

        {/* SECTORS */}
        <section id="sectors" className="sec-section">
          <div className="wrap">
            <div className="sec-head">
              <h2>Browse by sector</h2>
              <div className="meta">{sectors.length} industrial sectors</div>
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
