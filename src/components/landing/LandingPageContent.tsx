/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { LandingContent } from "@/types/landing";
import { BRAND_ASSETS } from "@/config/brand";

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
              <img
                src={BRAND_ASSETS.logo.headerDefault}
                alt="SectorCalc"
                width={BRAND_ASSETS.logo.displayWidth}
                height={BRAND_ASSETS.logo.displayHeight}
                className="nav__logo-img"
              />
            </a>

            <ul className="nav__links" role="list">
              <li><a href="/free-tools" className="nav__link">{content.nav.calculators}</a></li>
              <li><a href="/categories" className="nav__link">{content.nav.categories}</a></li>
              <li><a href="/methodology" className="nav__link">{content.nav.methodology}</a></li>
              <li><a href="/pricing" className="nav__link">{content.nav.pro}</a></li>
              <li><a href="/blog" className="nav__link">{content.nav.blog}</a></li>
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
              <button className="chip" aria-label="OEE" onClick={() => handleSearchChip(content.hero.chipOee)}>{content.hero.chipOee}</button>
              <button className="chip" aria-label="EOQ" onClick={() => handleSearchChip(content.hero.chipEoq)}>{content.hero.chipEoq}</button>
              <button className="chip" aria-label="IRR" onClick={() => handleSearchChip(content.hero.chipIrr)}>{content.hero.chipIrr}</button>
              <button className="chip" aria-label="Cpk" onClick={() => handleSearchChip(content.hero.chipCpk)}>{content.hero.chipCpk}</button>
              <button className="chip" aria-label="LMTD" onClick={() => handleSearchChip(content.hero.chipLmtd)}>{content.hero.chipLmtd}</button>
              <button className="chip" aria-label="MTBF" onClick={() => handleSearchChip(content.hero.chipMtbf)}>{content.hero.chipMtbf}</button>
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
              <button className="tool-tag" role="listitem">{content.ticker.toolOee} <span className="tool-tag__badge tool-tag__badge--pro">{content.ticker.badgePro}</span></button>
              <button className="tool-tag" role="listitem">{content.ticker.toolEoq} <span className="tool-tag__badge tool-tag__badge--free">{content.ticker.badgeFree}</span></button>
              <button className="tool-tag" role="listitem">{content.ticker.toolIrrNpv} <span className="tool-tag__badge tool-tag__badge--pro">{content.ticker.badgePro}</span></button>
              <button className="tool-tag" role="listitem">{content.ticker.toolCpkSigma} <span className="tool-tag__badge tool-tag__badge--pro">{content.ticker.badgePro}</span></button>
              <button className="tool-tag" role="listitem">{content.ticker.toolTaktTime} <span className="tool-tag__badge tool-tag__badge--free">{content.ticker.badgeFree}</span></button>
              <button className="tool-tag" role="listitem">{content.ticker.toolBoltTorque} <span className="tool-tag__badge tool-tag__badge--pro">{content.ticker.badgePro}</span></button>
              <button className="tool-tag" role="listitem">{content.ticker.toolLmtd} <span className="tool-tag__badge tool-tag__badge--pro">{content.ticker.badgePro}</span></button>
              <button className="tool-tag" role="listitem">{content.ticker.toolMtbfMttr} <span className="tool-tag__badge tool-tag__badge--pro">{content.ticker.badgePro}</span></button>
              <button className="tool-tag" role="listitem">{content.ticker.toolBreakEven} <span className="tool-tag__badge tool-tag__badge--free">{content.ticker.badgeFree}</span></button>
              <button className="tool-tag" role="listitem">{content.ticker.toolKanban} <span className="tool-tag__badge tool-tag__badge--free">{content.ticker.badgeFree}</span></button>
              <button className="tool-tag" role="listitem">{content.ticker.toolPipePressure} <span className="tool-tag__badge tool-tag__badge--pro">{content.ticker.badgePro}</span></button>
              <button className="tool-tag" role="listitem">{content.ticker.toolCarbon} <span className="tool-tag__badge tool-tag__badge--pro">{content.ticker.badgePro}</span></button>
              <button className="tool-tag" role="listitem">{content.ticker.toolCompressor} <span className="tool-tag__badge tool-tag__badge--pro">{content.ticker.badgePro}</span></button>
              <button className="tool-tag" role="listitem">{content.ticker.toolPertCpm} <span className="tool-tag__badge tool-tag__badge--free">{content.ticker.badgeFree}</span></button>
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
          6 CATEGORIES
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
            <a href="/categories/manufacturing" className="cat-card cat-card--feature reveal" role="listitem">
              <div className="cat-card__icon" aria-hidden="true">🏭</div>
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
            <a href="/categories/finance" className="cat-card reveal" role="listitem">
              <div className="cat-card__icon" aria-hidden="true">💹</div>
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
            <a href="/categories/quality" className="cat-card reveal" role="listitem">
              <div className="cat-card__icon" aria-hidden="true">🎯</div>
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
            <a href="/categories/energy" className="cat-card reveal" role="listitem">
              <div className="cat-card__icon" aria-hidden="true">⚡</div>
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
            <a href="/categories/logistics" className="cat-card reveal" role="listitem">
              <div className="cat-card__icon" aria-hidden="true">🚚</div>
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
            <a href="/categories/engineering" className="cat-card reveal" role="listitem">
              <div className="cat-card__icon" aria-hidden="true">🔩</div>
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
          METHODOLOGY
          ═══════════════════════════════════════════════════════════ */}
      <section className="method-section section" aria-labelledby="method-title">
        <div className="wrap">
          <div className="reveal">
            <div className="eyebrow">{content.methodology.eyebrow}</div>
            <h2 className="section-h2" id="method-title">{content.methodology.title}</h2>
            <p className="section-lead" style={{ maxWidth: '500px' }}>{content.methodology.lead}</p>
          </div>

          <div className="method-layout reveal">
            <div className="method-card method-card--highlight">
              <div className="method-card__tag">{content.methodology.card1Tag}</div>
              <div className="method-card__icon" aria-hidden="true">📐</div>
              <div className="method-card__title">{content.methodology.card1Title}</div>
              <div className="method-card__desc">{content.methodology.card1Desc}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
              <div className="method-card">
                <div className="method-card__icon" aria-hidden="true">📋</div>
                <div className="method-card__title">{content.methodology.card2Title}</div>
                <div className="method-card__desc">{content.methodology.card2Desc}</div>
              </div>
              <div className="method-card">
                <div className="method-card__icon" aria-hidden="true">⚠️</div>
                <div className="method-card__title">{content.methodology.card3Title}</div>
                <div className="method-card__desc">{content.methodology.card3Desc}</div>
              </div>
              <div className="method-card">
                <div className="method-card__icon" aria-hidden="true">🔒</div>
                <div className="method-card__title">{content.methodology.card4Title}</div>
                <div className="method-card__desc">{content.methodology.card4Desc}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="section-rule" />

      {/* ═══════════════════════════════════════════════════════════
          AUDIENCE
          ═══════════════════════════════════════════════════════════ */}
      <section className="audience-section section" aria-labelledby="audience-title">
        <div className="wrap">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--sp-10)' }}>
            <div className="eyebrow">{content.audience.eyebrow}</div>
            <h2 className="section-h2" id="audience-title">{content.audience.title}</h2>
          </div>

          <div className="audience-grid reveal" role="list">
            <div className="persona" role="listitem">
              <div className="persona__icon" aria-hidden="true">🏗️</div>
              <div className="persona__role">{content.audience.persona1Role}</div>
              <div className="persona__desc">{content.audience.persona1Desc}</div>
              <div className="persona__tools" aria-label="Related tools">
                {content.audience.persona1Tags.split(", ").map((tag, i) => <span className="ptag" key={i}>{tag}</span>)}
              </div>
            </div>
            <div className="persona" role="listitem">
              <div className="persona__icon" aria-hidden="true">📊</div>
              <div className="persona__role">{content.audience.persona2Role}</div>
              <div className="persona__desc">{content.audience.persona2Desc}</div>
              <div className="persona__tools" aria-label="Related tools">
                {content.audience.persona2Tags.split(", ").map((tag, i) => <span className="ptag" key={i}>{tag}</span>)}
              </div>
            </div>
            <div className="persona" role="listitem">
              <div className="persona__icon" aria-hidden="true">🔬</div>
              <div className="persona__role">{content.audience.persona3Role}</div>
              <div className="persona__desc">{content.audience.persona3Desc}</div>
              <div className="persona__tools" aria-label="Related tools">
                {content.audience.persona3Tags.split(", ").map((tag, i) => <span className="ptag" key={i}>{tag}</span>)}
              </div>
            </div>
            <div className="persona" role="listitem">
              <div className="persona__icon" aria-hidden="true">⚙️</div>
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
          PRO vs FREE
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
              <div className="tier-tag tier-tag--pro">{content.pricing.proTag}</div>
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
              <div className="pricing-row__feat" role="cell"><span className="pricing-row__feat-icon">{content.pricing.feat1Icon}</span>{content.pricing.feat1Label}</div>
              <div className="pricing-row__cell pricing-row__cell--pro" role="cell"><div className="check-y" aria-label="Included">✓</div></div>
              <div className="pricing-row__cell" role="cell"><div className="check-y check-y--cobalt" aria-label="Included">✓</div></div>
            </div>
            <div className="pricing-row" role="row">
              <div className="pricing-row__feat" role="cell"><span className="pricing-row__feat-icon">{content.pricing.feat2Icon}</span>{content.pricing.feat2Label}</div>
              <div className="pricing-row__cell pricing-row__cell--pro" role="cell"><div className="check-y" aria-label="Included">✓</div></div>
              <div className="pricing-row__cell" role="cell"><div className="check-n" aria-label="Not included">–</div></div>
            </div>
            <div className="pricing-row" role="row">
              <div className="pricing-row__feat" role="cell"><span className="pricing-row__feat-icon">{content.pricing.feat3Icon}</span>{content.pricing.feat3Label}</div>
              <div className="pricing-row__cell pricing-row__cell--pro" role="cell"><div className="check-y" aria-label="Included">✓</div></div>
              <div className="pricing-row__cell" role="cell"><div className="check-n" aria-label="Not included">–</div></div>
            </div>
            <div className="pricing-row" role="row">
              <div className="pricing-row__feat" role="cell"><span className="pricing-row__feat-icon">{content.pricing.feat4Icon}</span>{content.pricing.feat4Label}</div>
              <div className="pricing-row__cell pricing-row__cell--pro" role="cell"><div className="check-y" aria-label="Included">✓</div></div>
              <div className="pricing-row__cell" role="cell"><div className="check-n" aria-label="Not included">–</div></div>
            </div>
            <div className="pricing-row" role="row">
              <div className="pricing-row__feat" role="cell"><span className="pricing-row__feat-icon">{content.pricing.feat5Icon}</span>{content.pricing.feat5Label}</div>
              <div className="pricing-row__cell pricing-row__cell--pro" role="cell"><div className="check-y" aria-label="Included">✓</div></div>
              <div className="pricing-row__cell" role="cell"><div className="check-n" aria-label="Not included">–</div></div>
            </div>
            <div className="pricing-row" role="row">
              <div className="pricing-row__feat" role="cell"><span className="pricing-row__feat-icon">{content.pricing.feat6Icon}</span>{content.pricing.feat6Label}</div>
              <div className="pricing-row__cell pricing-row__cell--pro" role="cell"><div className="check-y" aria-label="Included">✓</div></div>
              <div className="pricing-row__cell" role="cell"><div className="check-y check-y--cobalt" aria-label="Included">✓</div></div>
            </div>
            <div className="pricing-row" role="row">
              <div className="pricing-row__feat" role="cell"><span className="pricing-row__feat-icon">{content.pricing.feat7Icon}</span>{content.pricing.feat7Label}</div>
              <div className="pricing-row__cell pricing-row__cell--pro" role="cell"><div className="check-y" aria-label="Included">✓</div></div>
              <div className="pricing-row__cell" role="cell"><div className="check-y check-y--cobalt" aria-label="Included">✓</div></div>
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
                <img
                  src={BRAND_ASSETS.logo.onDark}
                  alt="SectorCalc"
                  width={BRAND_ASSETS.logo.displayWidth}
                  height={BRAND_ASSETS.logo.displayHeight}
                  className="footer-brand__logo-img"
                />
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
                <li><a href="/categories/manufacturing" className="footer-col__link">{content.footer.linkManufacturing}</a></li>
                <li><a href="/categories/finance" className="footer-col__link">{content.footer.linkFinance}</a></li>
                <li><a href="/categories/quality" className="footer-col__link">{content.footer.linkQuality}</a></li>
                <li><a href="/categories/energy" className="footer-col__link">{content.footer.linkEnergy}</a></li>
                <li><a href="/categories/logistics" className="footer-col__link">{content.footer.linkLogistics}</a></li>
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
                <li><a href="/blog" className="footer-col__link">{content.footer.linkChangelog}</a></li>
              </ul>
            </div>

            <div>
              <div className="footer-col__title">{content.footer.colLegal}</div>
              <ul className="footer-col__links" role="list">
                <li><a href="/disclaimer" className="footer-col__link">{content.footer.linkDisclaimer}</a></li>
                <li><a href="/privacy" className="footer-col__link">{content.footer.linkPrivacy}</a></li>
                <li><a href="/terms" className="footer-col__link">{content.footer.linkTerms}</a></li>
                <li><a href="/cookies" className="footer-col__link">{content.footer.linkCookies}</a></li>
              </ul>
            </div>

            <div>
              <div className="footer-col__title">{content.footer.colCompany}</div>
              <ul className="footer-col__links" role="list">
                <li><a href="/about" className="footer-col__link">{content.footer.linkAbout}</a></li>
                <li><a href="/about" className="footer-col__link">{content.footer.linkContact}</a></li>
                <li><a href="/blog" className="footer-col__link">{content.footer.linkBlog}</a></li>
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
          TRACE AI WIDGET
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
            <button className="trace-chip" onClick={() => handleTraceChip(content.trace.chipOee)}>{content.trace.chipOee}</button>
            <button className="trace-chip" onClick={() => handleTraceChip(content.trace.chipScrap)}>{content.trace.chipScrap}</button>
            <button className="trace-chip" onClick={() => handleTraceChip(content.trace.chipEnergy)}>{content.trace.chipEnergy}</button>
            <button className="trace-chip" onClick={() => handleTraceChip(content.trace.chipPayback)}>{content.trace.chipPayback}</button>
            <button className="trace-chip" onClick={() => handleTraceChip(content.trace.chipBolt)}>{content.trace.chipBolt}</button>
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
