/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { LandingContent } from "@/types/landing";

import {
  Factory,
  TrendingUp,
  Target,
  Zap,
  Truck,
  Wrench,
  Pen,
  FileText,
  TriangleAlert,
  ShieldCheck,
  Building2,
  BarChart3,
  CheckCircle,
  Cog,
  PlusCircle,
  ClipboardList,
  Download,
  Save,
  Activity,
  Globe,
  Sparkles,
} from "lucide-react";

const iconProps = {
  size: 22,
  strokeWidth: 1.5,
  "aria-hidden": "true" as const,
};

const pricingIconProps = {
  size: 14,
  strokeWidth: 1.5,
  "aria-hidden": "true" as const,
};

export function LandingPageContent({
  content,
}: {
  content: LandingContent;
}) {
  const [traceOpen, setTraceOpen] = useState(false);
  const tracePanelRef = useRef<HTMLDivElement>(null);
  const traceFabRef = useRef<HTMLButtonElement>(null);
  const traceInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  /* ── Trace AI toggle ── */
  const openTrace = useCallback(() => {
    setTraceOpen(true);
    setTimeout(() => traceInputRef.current?.focus(), 50);
  }, []);

  const closeTrace = useCallback(() => {
    setTraceOpen(false);
    setTimeout(() => traceFabRef.current?.focus(), 50);
  }, []);

  /* Escape key closes Trace */
  useEffect(() => {
    if (!traceOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeTrace();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [traceOpen, closeTrace]);

  /* ── Trace chip click → fill input ── */
  const handleTraceChip = useCallback((text: string) => {
    if (traceInputRef.current) {
      traceInputRef.current.value = text;
      traceInputRef.current.focus();
    }
    if (!traceOpen) openTrace();
  }, [traceOpen, openTrace]);

  /* ── Search chip click → fill search input ── */
  const handleSearchChip = useCallback((text: string) => {
    if (searchInputRef.current) {
      searchInputRef.current.value = text;
      searchInputRef.current.focus();
    }
  }, []);

  /* ── Counter animation ── */
  useEffect(() => {
    const counters = [
      { id: "c-pro", target: 193 },
      { id: "c-free", target: 359 },
      { id: "c-sectors", target: 18 },
    ] as const;

    function animateCount(el: HTMLElement, target: number) {
      const start = performance.now();
      const duration = 1000;
      function frame(now: number) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = String(Math.round(eased * target));
        if (p < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }

    const cObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const cfg = counters.find((c) => c.id === e.target.id);
            if (cfg) animateCount(e.target as HTMLElement, cfg.target);
            cObs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.5 },
    );

    counters.forEach((c) => {
      const el = document.getElementById(c.id);
      if (el) {
        el.textContent = "0";
        cObs.observe(el);
      }
    });

    return () => cObs.disconnect();
  }, []);

  /* ── Scroll reveal ── */
  useEffect(() => {
    const rObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e, i) => {
          if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add("in"), i * 55);
            rObs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -32px 0px" },
    );

    document.querySelectorAll(".reveal").forEach((el) => rObs.observe(el));
    return () => rObs.disconnect();
  }, []);

  return (
    <div className="landing-root">
      {/* ═══════════════════════════════════════════════════════════
          NAV
          ═══════════════════════════════════════════════════════════ */}
      <nav className="nav" role="navigation" aria-label="Main navigation">
        <div className="wrap">
          <div className="nav__inner">
            <a href="/" className="nav__logo" aria-label="SectorCalc home">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="30 50 2478 527" fill="none" aria-label="SectorCalc" role="img" style={{height:'44px',width:'auto',display:'block'}}>
                <defs>
                  <linearGradient id="navGN" x1="52" y1="72" x2="222" y2="242" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#0B4A92"/><stop offset="1" stopColor="#001C4E"/>
                  </linearGradient>
                  <linearGradient id="navGB" x1="246" y1="72" x2="416" y2="242" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#2C8DFF"/><stop offset="1" stopColor="#1A6EF5"/>
                  </linearGradient>
                  <linearGradient id="navGT" x1="52" y1="266" x2="222" y2="436" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#21D5C7"/><stop offset="1" stopColor="#16BDB8"/>
                  </linearGradient>
                  <linearGradient id="navGC" x1="246" y1="266" x2="416" y2="436" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#35C4F3"/><stop offset="1" stopColor="#20B4E9"/>
                  </linearGradient>
                </defs>
                <rect x="52"  y="72"  width="170" height="170" rx="28" fill="url(#navGN)"/>
                <rect x="246" y="72"  width="170" height="170" rx="28" fill="url(#navGB)"/>
                <rect x="52"  y="266" width="170" height="170" rx="28" fill="url(#navGT)"/>
                <rect x="246" y="266" width="170" height="170" rx="28" fill="url(#navGC)"/>
                <text x="137" y="157" fill="#fff" fontFamily="Arial,sans-serif" fontSize="92" fontWeight="700" textAnchor="middle" dominantBaseline="middle">+</text>
                <text x="331" y="157" fill="#fff" fontFamily="Arial,sans-serif" fontSize="92" fontWeight="700" textAnchor="middle" dominantBaseline="middle">{'\u2212'}</text>
                <text x="137" y="351" fill="#fff" fontFamily="Arial,sans-serif" fontSize="92" fontWeight="700" textAnchor="middle" dominantBaseline="middle">{'\u00D7'}</text>
                <text x="331" y="351" fill="#fff" fontFamily="Arial,sans-serif" fontSize="92" fontWeight="700" textAnchor="middle" dominantBaseline="middle">=</text>
                <text x="520" y="313.5" fontFamily="Arial,Helvetica,sans-serif" fontSize="276" fontWeight="400" dominantBaseline="middle">
                  <tspan fill="#141413">Sector</tspan><tspan fill="#1A6EF5">Calc</tspan>
                </text>
              </svg>
            </a>

            <ul className="nav__links" role="list">
              <li><a href="/free-tools" className="nav__link">{content.nav.calculators}</a></li>
              <li><a href="/categories" className="nav__link">{content.nav.categories}</a></li>
              <li><a href="/methodology" className="nav__link">{content.nav.methodology}</a></li>
              <li><a href="/pricing" className="nav__link">{content.nav.pro}</a></li>
              <li><a href="/about" className="nav__link">{content.nav.blog}</a></li>
            </ul>

            <div className="nav__actions">
              <button className="btn-ghost">{content.nav.signIn}</button>
              <a href="/pricing" className="btn-terra">{content.nav.getPro}</a>
            </div>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════════
          HERO
          ═══════════════════════════════════════════════════════════ */}
      <section className="hero" aria-labelledby="hero-h1">
        <div className="wrap">
          <div className="hero__tag" role="note">
            <span className="hero__tag-dot" aria-hidden="true"></span>
            {content.hero.tag}
          </div>

          <h1 className="hero__h1" id="hero-h1" dangerouslySetInnerHTML={{ __html: content.hero.headline }} />

          <p className="hero__sub">
            {content.hero.subtitle}
          </p>

          {/* Search */}
          <div className="search-wrap" role="search" aria-label="Calculator search">
            <div className="search-bar">
              <svg className="search-ico" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
                <circle cx="8" cy="8" r="5.5" />
                <path d="m12.5 12.5 3 3" strokeLinecap="round" />
              </svg>
              <input
                ref={searchInputRef}
                type="search"
                className="search-input"
                placeholder={content.hero.searchPlaceholder}
                aria-label={content.hero.searchPlaceholder}
                autoComplete="off"
                spellCheck={false}
              />
              <div className="search-divider" aria-hidden="true"></div>
              <button className="search-trace" aria-label={content.hero.trace} onClick={openTrace}>
                <svg width="11" height="11" viewBox="0 0 11 11" fill="currentColor" aria-hidden="true">
                  <path d="M5.5 0 6.8 4.2 11 5.5 6.8 6.8 5.5 11 4.2 6.8 0 5.5 4.2 4.2Z" />
                </svg>
                Trace
              </button>
              <button className="search-btn">{content.hero.search}</button>
            </div>
            <div className="search-hints" aria-label="Suggested searches">
              <span className="search-hint-label">{content.hero.tryLabel}</span>
              <button className="chip" aria-label="OEE" onClick={() => handleSearchChip(content.hero.chipOee)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="8" width="5" height="12" rx="1"/><rect x="9.5" y="4" width="5" height="16" rx="1"/><rect x="16" y="10" width="5" height="10" rx="1"/></svg>{content.hero.chipOee}
              </button>
              <button className="chip" aria-label="EOQ" onClick={() => handleSearchChip(content.hero.chipEoq)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27,6.96 12,12.01 20.73,6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>{content.hero.chipEoq}
              </button>
              <button className="chip" aria-label="IRR" onClick={() => handleSearchChip(content.hero.chipIrr)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 3v18h18"/><path d="m7 16 4-5 4 3 4-6"/></svg>{content.hero.chipIrr}
              </button>
              <button className="chip" aria-label="Cpk" onClick={() => handleSearchChip(content.hero.chipCpk)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>{content.hero.chipCpk}
              </button>
              <button className="chip" aria-label="LMTD" onClick={() => handleSearchChip(content.hero.chipLmtd)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>{content.hero.chipLmtd}
              </button>
              <button className="chip" aria-label="MTBF" onClick={() => handleSearchChip(content.hero.chipMtbf)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>{content.hero.chipMtbf}
              </button>
            </div>
          </div>

          {/* Metrics bar */}
          <div className="hero-metrics" role="list" aria-label="Platform statistics">
            <div className="hero-metric" role="listitem">
              <span className="hero-metric__val hero-metric__val--terra" id="c-pro">0</span>
              <span className="hero-metric__label">{content.metrics.proCalculators}</span>
            </div>
            <div className="hero-metric" role="listitem">
              <span className="hero-metric__val" id="c-free">0</span>
              <span className="hero-metric__label">{content.metrics.freeCalculators}</span>
            </div>
            <div className="hero-metric" role="listitem">
              <span className="hero-metric__val" id="c-sectors">0</span>
              <span className="hero-metric__label">{content.metrics.industrySectors}</span>
            </div>
            <div className="hero-metric" role="listitem">
              <span className="hero-metric__val hero-metric__val--cobalt">6</span>
              <span className="hero-metric__label">{content.metrics.languages}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          TICKER — Most used tools
          ═══════════════════════════════════════════════════════════ */}
      <div className="ticker" aria-label="Most used calculators">
        <div className="wrap--wide">
          <div className="ticker__inner">
            <div className="ticker__label" aria-hidden="true">{content.ticker.label}</div>
            <div className="ticker__scroll" role="list">
              <button className="tool-tag" role="listitem">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="8" width="5" height="12" rx="1"/><rect x="9.5" y="4" width="5" height="16" rx="1"/><rect x="16" y="10" width="5" height="10" rx="1"/></svg>{content.ticker.toolOee} <span className="tool-tag__badge tool-tag__badge--pro">{content.ticker.badgePro}</span>
              </button>
              <button className="tool-tag" role="listitem">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27,6.96 12,12.01 20.73,6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>{content.ticker.toolEoq} <span className="tool-tag__badge tool-tag__badge--free">{content.ticker.badgeFree}</span>
              </button>
              <button className="tool-tag" role="listitem">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 3v18h18"/><path d="m7 16 4-5 4 3 4-6"/></svg>{content.ticker.toolIrrNpv} <span className="tool-tag__badge tool-tag__badge--pro">{content.ticker.badgePro}</span>
              </button>
              <button className="tool-tag" role="listitem">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>{content.ticker.toolCpkSigma} <span className="tool-tag__badge tool-tag__badge--pro">{content.ticker.badgePro}</span>
              </button>
              <button className="tool-tag" role="listitem">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>{content.ticker.toolTaktTime} <span className="tool-tag__badge tool-tag__badge--free">{content.ticker.badgeFree}</span>
              </button>
              <button className="tool-tag" role="listitem">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>{content.ticker.toolBoltTorque} <span className="tool-tag__badge tool-tag__badge--pro">{content.ticker.badgePro}</span>
              </button>
              <button className="tool-tag" role="listitem">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>{content.ticker.toolLmtd} <span className="tool-tag__badge tool-tag__badge--pro">{content.ticker.badgePro}</span>
              </button>
              <button className="tool-tag" role="listitem">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>{content.ticker.toolMtbfMttr} <span className="tool-tag__badge tool-tag__badge--pro">{content.ticker.badgePro}</span>
              </button>
              <button className="tool-tag" role="listitem">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 3v18h18"/><path d="m7 10 5 5 5-5"/></svg>{content.ticker.toolBreakEven} <span className="tool-tag__badge tool-tag__badge--free">{content.ticker.badgeFree}</span>
              </button>
              <button className="tool-tag" role="listitem">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 20h20"/><path d="M5 20V8l7-5 7 5v12"/><path d="M9 20v-5h6v5"/></svg>{content.ticker.toolKanban} <span className="tool-tag__badge tool-tag__badge--free">{content.ticker.badgeFree}</span>
              </button>
              <button className="tool-tag" role="listitem">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>{content.ticker.toolPipePressure} <span className="tool-tag__badge tool-tag__badge--pro">{content.ticker.badgePro}</span>
              </button>
              <button className="tool-tag" role="listitem">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 22 16 8"/><path d="M8.5 2A16.5 16.5 0 0 1 22 15.5c0 4.14-1.49 7.29-5.86 7.29A15.83 15.83 0 0 1 2 9.5 7.5 7.5 0 0 1 8.5 2z"/></svg>{content.ticker.toolCarbon} <span className="tool-tag__badge tool-tag__badge--pro">{content.ticker.badgePro}</span>
              </button>
              <button className="tool-tag" role="listitem">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>{content.ticker.toolCompressor} <span className="tool-tag__badge tool-tag__badge--pro">{content.ticker.badgePro}</span>
              </button>
              <button className="tool-tag" role="listitem">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="3" y1="6" x2="20" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/><line x1="3" y1="4" x2="3" y2="20"/></svg>{content.ticker.toolPertCpm} <span className="tool-tag__badge tool-tag__badge--free">{content.ticker.badgeFree}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          FORMULA MARQUEE — Signature element
          ═══════════════════════════════════════════════════════════ */}
      <div className="formula-strip" aria-hidden="true">
        <div className="formula-marquee" id="formulaMarquee">
          {/* Set 1 */}
          <div className="formula-pill">
            <span className="formula-pill__name">OEE</span>
            <span className="formula-pill__eq">
              <span className="var">OEE</span> <span className="op">=</span>{' '}
              <span className="var">A</span> <span className="op">&times;</span>{' '}
              <span className="var">P</span> <span className="op">&times;</span>{' '}
              <span className="var">Q</span>
            </span>
          </div>
          <div className="formula-pill">
            <span className="formula-pill__name">EOQ</span>
            <span className="formula-pill__eq">
              <span className="var">Q*</span> <span className="op">=</span>{' '}
              &radic;<span className="op">(</span>2<span className="var">DS</span><span className="op">/</span><span className="var">H</span><span className="op">)</span>
            </span>
          </div>
          <div className="formula-pill">
            <span className="formula-pill__name">NPV</span>
            <span className="formula-pill__eq">
              <span className="blue">NPV</span> <span className="op">=</span>{' '}
              &Sigma; <span className="var">CF_t</span><span className="op">/(</span>1<span className="op">+</span><span className="var">r</span><span className="op">)^t</span>
            </span>
          </div>
          <div className="formula-pill">
            <span className="formula-pill__name">Cpk</span>
            <span className="formula-pill__eq">
              <span className="var">Cpk</span> <span className="op">= min(</span>
              <span className="var">USL</span><span className="op">&minus;</span><span className="var">&mu;</span><span className="op">,</span>{' '}
              <span className="var">&mu;</span><span className="op">&minus;</span><span className="var">LSL</span>
              <span className="op">) / 3&sigma;</span>
            </span>
          </div>
          <div className="formula-pill">
            <span className="formula-pill__name">LMTD</span>
            <span className="formula-pill__eq">
              <span className="var">LMTD</span> <span className="op">=</span>{' '}
              <span className="op">(</span><span className="var">&Delta;T&sbquo;&#x2081;</span><span className="op">&minus;</span><span className="var">&Delta;T&sbquo;&#x2082;</span><span className="op">)</span>{' '}
              <span className="op">/ ln(</span><span className="var">&Delta;T&sbquo;&#x2081;</span><span className="op">/</span><span className="var">&Delta;T&sbquo;&#x2082;</span><span className="op">)</span>
            </span>
          </div>
          <div className="formula-pill">
            <span className="formula-pill__name">WACC</span>
            <span className="formula-pill__eq">
              <span className="blue">WACC</span> <span className="op">=</span>{' '}
              <span className="var">E</span><span className="op">/</span><span className="var">V</span>&middot;<span className="var">Re</span>{' '}
              <span className="op">+</span>{' '}
              <span className="var">D</span><span className="op">/</span><span className="var">V</span>&middot;<span className="var">Rd</span>&middot;<span className="op">(1&minus;</span><span className="var">T</span><span className="op">)</span>
            </span>
          </div>
          <div className="formula-pill">
            <span className="formula-pill__name">NIOSH RWL</span>
            <span className="formula-pill__eq">
              <span className="var">RWL</span> <span className="op">=</span>{' '}
              23&middot;<span className="var">HM</span>&middot;<span className="var">VM</span>&middot;<span className="var">DM</span>&middot;<span className="var">AM</span>&middot;<span className="var">FM</span>&middot;<span className="var">CM</span>
            </span>
          </div>
          <div className="formula-pill">
            <span className="formula-pill__name">Colebrook</span>
            <span className="formula-pill__eq">
              1<span className="op">/</span>&radic;<span className="var">f</span>{' '}
              <span className="op">= &minus;2 log(</span><span className="var">&epsilon;</span><span className="op">/3.7D +</span>{' '}
              2.51<span className="op">/</span><span className="var">Re</span>&radic;<span className="var">f</span><span className="op">)</span>
            </span>
          </div>
          <div className="formula-pill">
            <span className="formula-pill__name">IRR</span>
            <span className="formula-pill__eq">
              &Sigma; <span className="var">CF_t</span><span className="op">/(1+</span><span className="blue">IRR</span><span className="op">)^t = 0</span>
            </span>
          </div>
          <div className="formula-pill">
            <span className="formula-pill__name">MTBF</span>
            <span className="formula-pill__eq">
              <span className="var">MTBF</span> <span className="op">= T / n</span> <span className="op">;</span>{' '}
              <span className="var">A</span> <span className="op">=</span>{' '}
              <span className="var">MTBF</span><span className="op">/(</span><span className="var">MTBF</span><span className="op">+</span><span className="var">MTTR</span><span className="op">)</span>
            </span>
          </div>
          {/* Set 2 — duplicate for seamless loop */}
          <div className="formula-pill">
            <span className="formula-pill__name">OEE</span>
            <span className="formula-pill__eq">
              <span className="var">OEE</span> <span className="op">=</span>{' '}
              <span className="var">A</span> <span className="op">&times;</span>{' '}
              <span className="var">P</span> <span className="op">&times;</span>{' '}
              <span className="var">Q</span>
            </span>
          </div>
          <div className="formula-pill">
            <span className="formula-pill__name">EOQ</span>
            <span className="formula-pill__eq">
              <span className="var">Q*</span> <span className="op">=</span>{' '}
              &radic;<span className="op">(</span>2<span className="var">DS</span><span className="op">/</span><span className="var">H</span><span className="op">)</span>
            </span>
          </div>
          <div className="formula-pill">
            <span className="formula-pill__name">NPV</span>
            <span className="formula-pill__eq">
              <span className="blue">NPV</span> <span className="op">=</span>{' '}
              &Sigma; <span className="var">CF_t</span><span className="op">/(</span>1<span className="op">+</span><span className="var">r</span><span className="op">)^t</span>
            </span>
          </div>
          <div className="formula-pill">
            <span className="formula-pill__name">Cpk</span>
            <span className="formula-pill__eq">
              <span className="var">Cpk</span> <span className="op">= min(</span>
              <span className="var">USL</span><span className="op">&minus;</span><span className="var">&mu;</span><span className="op">,</span>{' '}
              <span className="var">&mu;</span><span className="op">&minus;</span><span className="var">LSL</span>
              <span className="op">) / 3&sigma;</span>
            </span>
          </div>
          <div className="formula-pill">
            <span className="formula-pill__name">LMTD</span>
            <span className="formula-pill__eq">
              <span className="var">LMTD</span> <span className="op">=</span>{' '}
              <span className="op">(</span><span className="var">&Delta;T&sbquo;&#x2081;</span><span className="op">&minus;</span><span className="var">&Delta;T&sbquo;&#x2082;</span><span className="op">)</span>{' '}
              <span className="op">/ ln(</span><span className="var">&Delta;T&sbquo;&#x2081;</span><span className="op">/</span><span className="var">&Delta;T&sbquo;&#x2082;</span><span className="op">)</span>
            </span>
          </div>
          <div className="formula-pill">
            <span className="formula-pill__name">WACC</span>
            <span className="formula-pill__eq">
              <span className="blue">WACC</span> <span className="op">=</span>{' '}
              <span className="var">E</span><span className="op">/</span><span className="var">V</span>&middot;<span className="var">Re</span>{' '}
              <span className="op">+</span>{' '}
              <span className="var">D</span><span className="op">/</span><span className="var">V</span>&middot;<span className="var">Rd</span>&middot;<span className="op">(1&minus;</span><span className="var">T</span><span className="op">)</span>
            </span>
          </div>
          <div className="formula-pill">
            <span className="formula-pill__name">NIOSH RWL</span>
            <span className="formula-pill__eq">
              <span className="var">RWL</span> <span className="op">=</span>{' '}
              23&middot;<span className="var">HM</span>&middot;<span className="var">VM</span>&middot;<span className="var">DM</span>&middot;<span className="var">AM</span>&middot;<span className="var">FM</span>&middot;<span className="var">CM</span>
            </span>
          </div>
          <div className="formula-pill">
            <span className="formula-pill__name">Colebrook</span>
            <span className="formula-pill__eq">
              1<span className="op">/</span>&radic;<span className="var">f</span>{' '}
              <span className="op">= &minus;2 log(</span><span className="var">&epsilon;</span><span className="op">/3.7D +</span>{' '}
              2.51<span className="op">/</span><span className="var">Re</span>&radic;<span className="var">f</span><span className="op">)</span>
            </span>
          </div>
          <div className="formula-pill">
            <span className="formula-pill__name">IRR</span>
            <span className="formula-pill__eq">
              &Sigma; <span className="var">CF_t</span><span className="op">/(1+</span><span className="blue">IRR</span><span className="op">)^t = 0</span>
            </span>
          </div>
          <div className="formula-pill">
            <span className="formula-pill__name">MTBF</span>
            <span className="formula-pill__eq">
              <span className="var">MTBF</span> <span className="op">= T / n</span> <span className="op">;</span>{' '}
              <span className="var">A</span> <span className="op">=</span>{' '}
              <span className="var">MTBF</span><span className="op">/(</span><span className="var">MTBF</span><span className="op">+</span><span className="var">MTTR</span><span className="op">)</span>
            </span>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          6 CATEGORIES — each with a unique SVG icon
          ═══════════════════════════════════════════════════════════ */}
      <section className="cat-section section" aria-labelledby="cat-title">
        <div className="wrap">
          <div className="cat-header reveal">
            <div>
              <div className="eyebrow eyebrow--terra">{content.categories.eyebrow}</div>
              <h2 className="section-h2" id="cat-title">{content.categories.title}</h2>
            </div>
            <p className="section-lead" style={{ maxWidth: '360px' }}>{content.categories.lead}</p>
          </div>

          <div className="cat-grid" role="list">
            {/* Feature card — Manufacturing */}
            <a href="/free-tools?category=manufacturing-workshop" className="cat-card cat-card--feature reveal" role="listitem">
              <div className="cat-card__icon" aria-hidden="true">
                <Factory {...iconProps} />
              </div>
              <div className="cat-card__body">
                <div className="cat-card__name">{content.categories.manufacturingName}</div>
                <div className="cat-card__desc">{content.categories.manufacturingDesc}</div>
              </div>
              <div className="cat-card__footer">
                <div className="cat-count">
                  <span className="cat-count-dot" aria-hidden="true"></span>
                  {content.categories.manufacturingTools}
                </div>
                <div className="cat-arrow" aria-hidden="true">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2"><path d="m4 2 4 4-4 4" /></svg>
                </div>
              </div>
            </a>

            {/* Finance */}
            <a href="/free-tools?category=finance-business" className="cat-card reveal" role="listitem">
              <div className="cat-card__icon" aria-hidden="true">
                <TrendingUp {...iconProps} />
              </div>
              <div className="cat-card__body">
                <div className="cat-card__name">{content.categories.financeName}</div>
                <div className="cat-card__desc">{content.categories.financeDesc}</div>
              </div>
              <div className="cat-card__footer">
                <div className="cat-count"><span className="cat-count-dot" aria-hidden="true"></span>{content.categories.financeTools}</div>
                <div className="cat-arrow" aria-hidden="true"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2"><path d="m4 2 4 4-4 4" /></svg></div>
              </div>
            </a>

            {/* Quality */}
            <a href="/free-tools?category=quality-six-sigma" className="cat-card reveal" role="listitem">
              <div className="cat-card__icon" aria-hidden="true">
                <Target {...iconProps} />
              </div>
              <div className="cat-card__body">
                <div className="cat-card__name">{content.categories.qualityName}</div>
                <div className="cat-card__desc">{content.categories.qualityDesc}</div>
              </div>
              <div className="cat-card__footer">
                <div className="cat-count"><span className="cat-count-dot" aria-hidden="true"></span>{content.categories.qualityTools}</div>
                <div className="cat-arrow" aria-hidden="true"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2"><path d="m4 2 4 4-4 4" /></svg></div>
              </div>
            </a>

            {/* Energy */}
            <a href="/free-tools?category=energy-carbon" className="cat-card reveal" role="listitem">
              <div className="cat-card__icon" aria-hidden="true">
                <Zap {...iconProps} />
              </div>
              <div className="cat-card__body">
                <div className="cat-card__name">{content.categories.energyName}</div>
                <div className="cat-card__desc">{content.categories.energyDesc}</div>
              </div>
              <div className="cat-card__footer">
                <div className="cat-count"><span className="cat-count-dot" aria-hidden="true"></span>{content.categories.energyTools}</div>
                <div className="cat-arrow" aria-hidden="true"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2"><path d="m4 2 4 4-4 4" /></svg></div>
              </div>
            </a>

            {/* Logistics */}
            <a href="/free-tools?category=logistics-travel" className="cat-card reveal" role="listitem">
              <div className="cat-card__icon" aria-hidden="true">
                <Truck {...iconProps} />
              </div>
              <div className="cat-card__body">
                <div className="cat-card__name">{content.categories.logisticsName}</div>
                <div className="cat-card__desc">{content.categories.logisticsDesc}</div>
              </div>
              <div className="cat-card__footer">
                <div className="cat-count"><span className="cat-count-dot" aria-hidden="true"></span>{content.categories.logisticsTools}</div>
                <div className="cat-arrow" aria-hidden="true"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2"><path d="m4 2 4 4-4 4" /></svg></div>
              </div>
            </a>

            {/* Mechanical */}
            <a href="/free-tools?category=manufacturing-workshop" className="cat-card reveal" role="listitem">
              <div className="cat-card__icon" aria-hidden="true">
                <Wrench {...iconProps} />
              </div>
              <div className="cat-card__body">
                <div className="cat-card__name">{content.categories.mechanicalName}</div>
                <div className="cat-card__desc">{content.categories.mechanicalDesc}</div>
              </div>
              <div className="cat-card__footer">
                <div className="cat-count"><span className="cat-count-dot" aria-hidden="true"></span>{content.categories.mechanicalTools}</div>
                <div className="cat-arrow" aria-hidden="true"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2"><path d="m4 2 4 4-4 4" /></svg></div>
              </div>
            </a>
          </div>

          <div className="cat-more reveal">
            <a href="/categories" className="btn-see-all">
              {content.categories.browseAll}
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m5.5 2.5 4 4-4 4" /></svg>
            </a>
          </div>
        </div>
      </section>

      <hr className="section-rule" />

      {/* ═══════════════════════════════════════════════════════════
          METHODOLOGY — flat 2×2 grid
          ═══════════════════════════════════════════════════════════ */}
      <section className="method-section section" aria-labelledby="method-title">
        <div className="wrap">
          <div className="reveal">
            <div className="eyebrow">{content.methodology.eyebrow}</div>
            <h2 className="section-h2" id="method-title">{content.methodology.title}</h2>
            <p className="section-lead" style={{ maxWidth: '500px' }}>{content.methodology.lead}</p>
          </div>

          <div className="method-layout reveal">
            <div className="method-card method-card--highlight" style={{gridColumn:1,gridRow:1}}>
              <div className="method-card__tag">{content.methodology.card1Tag}</div>
              <div className="method-card__icon" aria-hidden="true">
                <Pen {...iconProps} />
              </div>
              <div className="method-card__title">{content.methodology.card1Title}</div>
              <div className="method-card__desc">{content.methodology.card1Desc}</div>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'var(--sp-4)'}}>
              <div className="method-card">
                <div className="method-card__icon" aria-hidden="true">
                  <FileText {...iconProps} />
                </div>
                <div className="method-card__title">{content.methodology.card2Title}</div>
                <div className="method-card__desc">{content.methodology.card2Desc}</div>
              </div>
              <div className="method-card">
                <div className="method-card__icon" aria-hidden="true">
                  <TriangleAlert {...iconProps} />
                </div>
                <div className="method-card__title">{content.methodology.card3Title}</div>
                <div className="method-card__desc">{content.methodology.card3Desc}</div>
              </div>
              <div className="method-card">
                <div className="method-card__icon" aria-hidden="true">
                  <ShieldCheck {...iconProps} />
                </div>
                <div className="method-card__title">{content.methodology.card4Title}</div>
                <div className="method-card__desc">{content.methodology.card4Desc}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="section-rule" />

      {/* ═══════════════════════════════════════════════════════════
          AUDIENCE — 4 personas
          ═══════════════════════════════════════════════════════════ */}
      <section className="audience-section section" aria-labelledby="audience-title">
        <div className="wrap">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--sp-10)' }}>
            <div className="eyebrow">{content.audience.eyebrow}</div>
            <h2 className="section-h2" id="audience-title" dangerouslySetInnerHTML={{ __html: content.audience.title }} />
          </div>

          <div className="audience-grid reveal" role="list">
            <div className="persona" role="listitem">
              <div className="persona__icon" aria-hidden="true">
                <Building2 {...iconProps} />
              </div>
              <div className="persona__role">{content.audience.persona1Role}</div>
              <div className="persona__desc">{content.audience.persona1Desc}</div>
              <div className="persona__tools" aria-label="Related tools">
                {content.audience.persona1Tags.split(", ").map((tag, i) => <span className="ptag" key={i}>{tag}</span>)}
              </div>
            </div>
            <div className="persona" role="listitem">
              <div className="persona__icon" aria-hidden="true">
                <BarChart3 {...iconProps} />
              </div>
              <div className="persona__role">{content.audience.persona2Role}</div>
              <div className="persona__desc">{content.audience.persona2Desc}</div>
              <div className="persona__tools" aria-label="Related tools">
                {content.audience.persona2Tags.split(", ").map((tag, i) => <span className="ptag" key={i}>{tag}</span>)}
              </div>
            </div>
            <div className="persona" role="listitem">
              <div className="persona__icon" aria-hidden="true">
                <CheckCircle {...iconProps} />
              </div>
              <div className="persona__role">{content.audience.persona3Role}</div>
              <div className="persona__desc">{content.audience.persona3Desc}</div>
              <div className="persona__tools" aria-label="Related tools">
                {content.audience.persona3Tags.split(", ").map((tag, i) => <span className="ptag" key={i}>{tag}</span>)}
              </div>
            </div>
            <div className="persona" role="listitem">
              <div className="persona__icon" aria-hidden="true">
                <Cog {...iconProps} />
              </div>
              <div className="persona__role">{content.audience.persona4Role}</div>
              <div className="persona__desc">{content.audience.persona4Desc}</div>
              <div className="persona__tools" aria-label="Related tools">
                {content.audience.persona4Tags.split(", ").map((tag, i) => <span className="ptag" key={i}>{tag}</span>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="section-rule" />

      {/* ═══════════════════════════════════════════════════════════
          PRO vs FREE — SVG feature icons
          ═══════════════════════════════════════════════════════════ */}
      <section className="pricing-section section" aria-labelledby="pricing-title">
        <div className="wrap">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--sp-2)' }}>
            <div className="eyebrow eyebrow--cobalt">{content.pricing.eyebrow}</div>
            <h2 className="section-h2" id="pricing-title">{content.pricing.title}</h2>
            <p className="section-lead" style={{ maxWidth: '480px', margin: '0 auto' }}>{content.pricing.lead}</p>
          </div>

          <div className="pricing-wrap reveal" role="table" aria-label="Plan comparison">
            <div className="pricing-top" role="row">
              <div className="pricing-col-head pricing-col-head--label" role="columnheader">
                <span>{content.pricing.compareLabel}</span>
              </div>
              <div className="pricing-col-head pricing-col-head--pro" role="columnheader">
                <div className="tier-tag tier-tag--pro">
                  <Zap size={11} strokeWidth={2} aria-hidden="true" /> {content.pricing.proTag}
                </div>
                <div className="tier-count tier-count--terra">{content.pricing.proCount}</div>
                <div className="tier-sub">{content.pricing.proSub}</div>
                <a href="/pricing" className="btn-terra">{content.pricing.proCta}</a>
              </div>
              <div className="pricing-col-head" role="columnheader">
                <div className="tier-tag tier-tag--free">{content.pricing.freeTag}</div>
                <div className="tier-count">{content.pricing.freeCount}</div>
                <div className="tier-sub">{content.pricing.freeSub}</div>
                <a href="/free-tools" className="btn-outline">{content.pricing.freeCta}</a>
              </div>
            </div>

            <div className="pricing-row" role="row">
              <div className="pricing-row__feat" role="cell">
                <span className="pricing-row__feat-icon"><PlusCircle {...pricingIconProps} /></span>
                {content.pricing.feat1Label}
              </div>
              <div className="pricing-row__cell pricing-row__cell--pro" role="cell">
                <div className="check-y" aria-label="Included">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="2,7 5.5,10.5 12,3" />
                  </svg>
                </div>
              </div>
              <div className="pricing-row__cell" role="cell">
                <div className="check-y check-y--cobalt" aria-label="Included">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="2,7 5.5,10.5 12,3" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="pricing-row" role="row">
              <div className="pricing-row__feat" role="cell">
                <span className="pricing-row__feat-icon"><ClipboardList {...pricingIconProps} /></span>
                {content.pricing.feat2Label}
              </div>
              <div className="pricing-row__cell pricing-row__cell--pro" role="cell">
                <div className="check-y" aria-label="Included">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="2,7 5.5,10.5 12,3" />
                  </svg>
                </div>
              </div>
              <div className="pricing-row__cell" role="cell">
                <div className="check-n" aria-label="Not included">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <line x1="3" y1="7" x2="11" y2="7" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="pricing-row" role="row">
              <div className="pricing-row__feat" role="cell">
                <span className="pricing-row__feat-icon"><Download {...pricingIconProps} /></span>
                {content.pricing.feat3Label}
              </div>
              <div className="pricing-row__cell pricing-row__cell--pro" role="cell">
                <div className="check-y" aria-label="Included">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="2,7 5.5,10.5 12,3" />
                  </svg>
                </div>
              </div>
              <div className="pricing-row__cell" role="cell">
                <div className="check-n" aria-label="Not included">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <line x1="3" y1="7" x2="11" y2="7" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="pricing-row" role="row">
              <div className="pricing-row__feat" role="cell">
                <span className="pricing-row__feat-icon"><Save {...pricingIconProps} /></span>
                {content.pricing.feat4Label}
              </div>
              <div className="pricing-row__cell pricing-row__cell--pro" role="cell">
                <div className="check-y" aria-label="Included">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="2,7 5.5,10.5 12,3" />
                  </svg>
                </div>
              </div>
              <div className="pricing-row__cell" role="cell">
                <div className="check-n" aria-label="Not included">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <line x1="3" y1="7" x2="11" y2="7" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="pricing-row" role="row">
              <div className="pricing-row__feat" role="cell">
                <span className="pricing-row__feat-icon"><Activity {...pricingIconProps} /></span>
                {content.pricing.feat5Label}
              </div>
              <div className="pricing-row__cell pricing-row__cell--pro" role="cell">
                <div className="check-y" aria-label="Included">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="2,7 5.5,10.5 12,3" />
                  </svg>
                </div>
              </div>
              <div className="pricing-row__cell" role="cell">
                <div className="check-n" aria-label="Not included">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <line x1="3" y1="7" x2="11" y2="7" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="pricing-row" role="row">
              <div className="pricing-row__feat" role="cell">
                <span className="pricing-row__feat-icon"><Globe {...pricingIconProps} /></span>
                {content.pricing.feat6Label}
              </div>
              <div className="pricing-row__cell pricing-row__cell--pro" role="cell">
                <div className="check-y" aria-label="Included">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="2,7 5.5,10.5 12,3" />
                  </svg>
                </div>
              </div>
              <div className="pricing-row__cell" role="cell">
                <div className="check-y check-y--cobalt" aria-label="Included">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="2,7 5.5,10.5 12,3" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="pricing-row" role="row">
              <div className="pricing-row__feat" role="cell">
                <span className="pricing-row__feat-icon"><Sparkles {...pricingIconProps} /></span>
                {content.pricing.feat7Label}
              </div>
              <div className="pricing-row__cell pricing-row__cell--pro" role="cell">
                <div className="check-y" aria-label="Included">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="2,7 5.5,10.5 12,3" />
                  </svg>
                </div>
              </div>
              <div className="pricing-row__cell" role="cell">
                <div className="check-y check-y--cobalt" aria-label="Included">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="2,7 5.5,10.5 12,3" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="pricing-footer" role="row">
              <div className="pricing-footer__cell" role="cell"></div>
              <div className="pricing-footer__cell pricing-footer__cell--pro" role="cell">
                <a href="/pricing" className="btn-terra">{content.pricing.footerProCta}</a>
              </div>
              <div className="pricing-footer__cell pricing-footer__cell--free" role="cell">
                <a href="/free-tools" className="btn-outline">{content.pricing.footerFreeCta}</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════════════════════ */}
      <footer className="footer" role="contentinfo">
        <div className="wrap">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-brand__logo">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="30 50 2478 527" fill="none" aria-label="SectorCalc" role="img" style={{height:'40px',width:'auto',display:'block'}}>
                  <defs>
                    <linearGradient id="ftGN" x1="52" y1="72" x2="222" y2="242" gradientUnits="userSpaceOnUse">
                      <stop offset="0" stopColor="#0B4A92"/><stop offset="1" stopColor="#001C4E"/>
                    </linearGradient>
                    <linearGradient id="ftGB" x1="246" y1="72" x2="416" y2="242" gradientUnits="userSpaceOnUse">
                      <stop offset="0" stopColor="#2C8DFF"/><stop offset="1" stopColor="#1A6EF5"/>
                    </linearGradient>
                    <linearGradient id="ftGT" x1="52" y1="266" x2="222" y2="436" gradientUnits="userSpaceOnUse">
                      <stop offset="0" stopColor="#21D5C7"/><stop offset="1" stopColor="#16BDB8"/>
                    </linearGradient>
                    <linearGradient id="ftGC" x1="246" y1="266" x2="416" y2="436" gradientUnits="userSpaceOnUse">
                      <stop offset="0" stopColor="#35C4F3"/><stop offset="1" stopColor="#20B4E9"/>
                    </linearGradient>
                  </defs>
                  <rect x="52"  y="72"  width="170" height="170" rx="28" fill="url(#ftGN)"/>
                  <rect x="246" y="72"  width="170" height="170" rx="28" fill="url(#ftGB)"/>
                  <rect x="52"  y="266" width="170" height="170" rx="28" fill="url(#ftGT)"/>
                  <rect x="246" y="266" width="170" height="170" rx="28" fill="url(#ftGC)"/>
                  <text x="137" y="157" fill="#fff" fontFamily="Arial,sans-serif" fontSize="92" fontWeight="700" textAnchor="middle" dominantBaseline="middle">+</text>
                  <text x="331" y="157" fill="#fff" fontFamily="Arial,sans-serif" fontSize="92" fontWeight="700" textAnchor="middle" dominantBaseline="middle">{'\u2212'}</text>
                  <text x="137" y="351" fill="#fff" fontFamily="Arial,sans-serif" fontSize="92" fontWeight="700" textAnchor="middle" dominantBaseline="middle">{'\u00D7'}</text>
                  <text x="331" y="351" fill="#fff" fontFamily="Arial,sans-serif" fontSize="92" fontWeight="700" textAnchor="middle" dominantBaseline="middle">=</text>
                  <text x="520" y="313.5" fontFamily="Arial,Helvetica,sans-serif" fontSize="276" fontWeight="400" dominantBaseline="middle">
                    <tspan fill="rgba(250,249,245,0.92)">Sector</tspan><tspan fill="#4A8FFF">Calc</tspan>
                  </text>
                </svg>
              </div>
              <p className="footer-brand__desc">{content.footer.brandDesc}</p>
              <div className="footer-tags">
                <span className="footer-tag">{content.footer.tagIso}</span>
                <span className="footer-tag">{content.footer.tagAsme}</span>
                <span className="footer-tag">{content.footer.tagGhg}</span>
                <span className="footer-tag">{content.footer.tagAiag}</span>
                <span className="footer-tag">{content.footer.tagVdi}</span>
                <span className="footer-tag">{content.footer.tagEn}</span>
                <span className="footer-tag">{content.footer.tagIec}</span>
              </div>
            </div>

            <div>
              <div className="footer-col__title">{content.footer.colCalculators}</div>
              <ul className="footer-col__links" role="list">
                <li><a href="/free-tools?category=manufacturing-workshop" className="footer-col__link">{content.footer.linkManufacturing}</a></li>
                <li><a href="/free-tools?category=finance-business" className="footer-col__link">{content.footer.linkFinance}</a></li>
                <li><a href="/free-tools?category=quality-six-sigma" className="footer-col__link">{content.footer.linkQuality}</a></li>
                <li><a href="/free-tools?category=energy-carbon" className="footer-col__link">{content.footer.linkEnergy}</a></li>
                <li><a href="/free-tools?category=logistics-travel" className="footer-col__link">{content.footer.linkLogistics}</a></li>
                <li><a href="/free-tools" className="footer-col__link">{content.footer.linkAllTools}</a></li>
              </ul>
            </div>

            <div>
              <div className="footer-col__title">{content.footer.colPlatform}</div>
              <ul className="footer-col__links" role="list">
                <li><a href="/methodology" className="footer-col__link">{content.footer.linkMethodology}</a></li>
                <li><a href="/methodology" className="footer-col__link">{content.footer.linkFormulaNotes}</a></li>
                <li><a href="/pricing" className="footer-col__link">{content.footer.linkPricing}</a></li>
                <li><a href="/about" className="footer-col__link">{content.footer.linkDocs}</a></li>
                <li><a href="/about" className="footer-col__link">{content.footer.linkChangelog}</a></li>
              </ul>
            </div>

            <div>
              <div className="footer-col__title">{content.footer.colLegal}</div>
              <ul className="footer-col__links" role="list">
                <li><a href="/disclaimer" className="footer-col__link">{content.footer.linkDisclaimer}</a></li>
                <li><a href="/privacy" className="footer-col__link">{content.footer.linkPrivacy}</a></li>
                <li><a href="/terms" className="footer-col__link">{content.footer.linkTerms}</a></li>
                <li><a href="/privacy" className="footer-col__link">{content.footer.linkCookies}</a></li>
              </ul>
            </div>

            <div>
              <div className="footer-col__title">{content.footer.colCompany}</div>
              <ul className="footer-col__links" role="list">
                <li><a href="/about" className="footer-col__link">{content.footer.linkAbout}</a></li>
                <li><a href="/about" className="footer-col__link">{content.footer.linkContact}</a></li>
                <li><a href="/about" className="footer-col__link">{content.footer.linkBlog}</a></li>
                <li><span className="footer-col__link">{content.footer.linkLocation}</span></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="footer-bottom__copy">{content.footer.copyright}</p>
            <div className="footer-bottom__links">
              <a href="/about" className="footer-bottom__link">{content.footer.sitemap}</a>
              <a href="/about" className="footer-bottom__link">{content.footer.accessibility}</a>
              <a href="/disclaimer" className="footer-bottom__link">{content.footer.linkDisclaimer}</a>
            </div>
          </div>
        </div>
      </footer>

      {/* ═══════════════════════════════════════════════════════════
          TRACE AI WIDGET — SVG chip icons
          ═══════════════════════════════════════════════════════════ */}
      <div className="trace" id="trace" aria-label="Trace AI">
        <div
          className={`trace__panel${traceOpen ? ' open' : ''}`}
          id="tracePanel"
          ref={tracePanelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Trace AI assistant"
        >
          <div className="trace__header">
            <div className="trace__id">
              <div className="trace__avatar" aria-hidden="true">T</div>
              <div>
                <div className="trace__name">{content.trace.name}</div>
                <div className="trace__status">{content.trace.status}</div>
              </div>
            </div>
            <button className="trace__close" id="traceClose" aria-label="Close Trace AI" onClick={closeTrace}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 2l8 8M10 2l-8 8" /></svg>
            </button>
          </div>
          <p className="trace__msg">{content.trace.msg}</p>
          <div className="trace__chips">
            <button className="trace-chip" onClick={() => handleTraceChip(content.trace.chipOee)}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="8" width="5" height="12" rx="1"/><rect x="9.5" y="4" width="5" height="16" rx="1"/><rect x="16" y="10" width="5" height="10" rx="1"/></svg>{content.trace.chipOee}
            </button>
            <button className="trace-chip" onClick={() => handleTraceChip(content.trace.chipScrap)}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27,6.96 12,12.01 20.73,6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>{content.trace.chipScrap}
            </button>
            <button className="trace-chip" onClick={() => handleTraceChip(content.trace.chipEnergy)}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>{content.trace.chipEnergy}
            </button>
            <button className="trace-chip" onClick={() => handleTraceChip(content.trace.chipPayback)}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 3v18h18"/><path d="m7 16 4-5 4 3 4-6"/></svg>{content.trace.chipPayback}
            </button>
            <button className="trace-chip" onClick={() => handleTraceChip(content.trace.chipBolt)}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>{content.trace.chipBolt}
            </button>
          </div>
          <div className="trace__inputrow">
            <input
              ref={traceInputRef}
              className="trace__input"
              type="text"
              placeholder={content.trace.placeholder}
              aria-label={content.trace.name}
            />
            <button className="trace__send" aria-label="Send to Trace">
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="white" strokeWidth="2"><path d="M1 5.5h9M5.5 1l4.5 4.5-4.5 4.5" /></svg>
            </button>
          </div>
        </div>

        <button
          className="trace__fab"
          id="traceFab"
          ref={traceFabRef}
          aria-label="Open Trace AI"
          aria-expanded={traceOpen}
          onClick={() => (traceOpen ? closeTrace() : openTrace())}
        >
          T
          <span className="trace__dot" aria-hidden="true"></span>
        </button>
      </div>
    </div>
  );
}
