/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import { useEffect, useRef, useCallback } from "react";
import type { LandingContent } from "@/types/landing";

export function LandingPageContent({
  content,
}: {
  content: LandingContent;
}) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearchChip = useCallback((text: string) => {
    if (searchInputRef.current) {
      searchInputRef.current.value = text;
      searchInputRef.current.focus();
    }
  }, []);

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

  const hn = content.heroNew;

  return (
    <div className="landing-root">
      {/* ═══ HERO (two-column) ═══ */}
      <section className="hero-v2" aria-labelledby="hero-v2-heading">
        <div className="wrap">
          <div className="hero-v2__grid">
            <div className="hero-v2__left">
              <h1 className="hero-v2__h1" id="hero-v2-heading">
                {hn?.headline ?? content.hero.headline}
              </h1>
              <p className="hero-v2__sub">
                {hn?.subtitle ?? content.hero.subtitle}
              </p>
              <div className="hero-v2__actions">
                <a href="/free-tools" className="hero-v2__cta hero-v2__cta--primary">
                  {hn?.ctaPrimary ?? "Try a Free Calculator"}
                </a>
                <a href="/pro-tools" className="hero-v2__cta hero-v2__cta--secondary">
                  {hn?.ctaSecondary ?? "View a Pro Report Example"}
                </a>
              </div>
              {/* Privacy note */}
              <div className="hero-v2__privacy">
                <span className="hero-v2__privacy-dot" aria-hidden="true" />
                <span>Your data stays in your browser. No storage, no tracking.</span>
              </div>
            </div>
            <div className="hero-v2__right" aria-hidden="true">
              <div className="oee-card">
                <div className="oee-card__header">
                  <svg className="oee-card__icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="8" width="5" height="12" rx="1" /><rect x="9.5" y="4" width="5" height="16" rx="1" /><rect x="16" y="10" width="5" height="10" rx="1" /></svg>
                  <span className="oee-card__title">OEE Calculation</span>
                  <span className="oee-card__badge">LIVE</span>
                </div>
                <div className="oee-card__metrics">
                  <div className="oee-card__metric">
                    <span className="oee-card__metric-label">Availability</span>
                    <span className="oee-card__metric-val">87.2%</span>
                  </div>
                  <div className="oee-card__metric">
                    <span className="oee-card__metric-label">Performance</span>
                    <span className="oee-card__metric-val">91.4%</span>
                  </div>
                  <div className="oee-card__metric">
                    <span className="oee-card__metric-label">Quality</span>
                    <span className="oee-card__metric-val">96.1%</span>
                  </div>
                </div>
                <div className="oee-card__result">
                  <span className="oee-card__result-label">Result:</span>
                  <span className="oee-card__result-val">OEE = 76.6%</span>
                </div>
                <div className="oee-card__insight">
                  <div className="oee-card__insight-title">Pro Insight</div>
                  <ul className="oee-card__insight-list">
                    <li>Main loss driver: availability</li>
                    <li>Estimated monthly loss: $18,420</li>
                    <li>Recommended action: downtime reduction scenario</li>
                  </ul>
                </div>
                <div className="oee-card__export">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7,10 12,15 17,10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                  PDF Decision Report
                </div>
              </div>
            </div>
          </div>

          {/* Search bar inside hero */}
          <div className="hero-v2__search" role="search" aria-label="Calculator search">
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
              <button className="search-btn">{content.hero.search}</button>
            </div>
            <div className="search-hints" aria-label="Suggested searches">
              <span className="search-hint-label">{content.hero.tryLabel}</span>
              <button className="chip" onClick={() => handleSearchChip(content.hero.chipOee)}>{content.hero.chipOee}</button>
              <button className="chip" onClick={() => handleSearchChip(content.hero.chipEoq)}>{content.hero.chipEoq}</button>
              <button className="chip" onClick={() => handleSearchChip(content.hero.chipIrr)}>{content.hero.chipIrr}</button>
              <button className="chip" onClick={() => handleSearchChip(content.hero.chipCpk)}>{content.hero.chipCpk}</button>
              <button className="chip" onClick={() => handleSearchChip(content.hero.chipLmtd)}>{content.hero.chipLmtd}</button>
              <button className="chip" onClick={() => handleSearchChip(content.hero.chipMtbf)}>{content.hero.chipMtbf}</button>
            </div>
          </div>

          {/* Trust bar */}
          {content.trustBar ? (
            <div className="trust-bar" role="list" aria-label="Platform highlights">
              {content.trustBar.items.map((item, i) => (
                <div key={i} className="trust-bar__item" role="listitem">
                  <span className="trust-bar__dot" aria-hidden="true" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {/* ═══ WHAT SECTORCALC DOES ═══ */}
      {content.whatDoes ? (
        <section className="what-does" aria-labelledby="what-does-heading">
          <div className="wrap">
            <h2 className="what-does__title" id="what-does-heading">{content.whatDoes.title}</h2>
            <div className="what-does__grid">
              <div className="what-does__card">
                <div className="what-does__card-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" /><line x1="4" y1="10" x2="20" y2="10" /><line x1="10" y1="4" x2="10" y2="20" /></svg>
                </div>
                <h3 className="what-does__card-title">{content.whatDoes.card1Title}</h3>
                <p className="what-does__card-desc">{content.whatDoes.card1Desc}</p>
              </div>
              <div className="what-does__card">
                <div className="what-does__card-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
                </div>
                <h3 className="what-does__card-title">{content.whatDoes.card2Title}</h3>
                <p className="what-does__card-desc">{content.whatDoes.card2Desc}</p>
              </div>
              <div className="what-does__card">
                <div className="what-does__card-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
                </div>
                <h3 className="what-does__card-title">{content.whatDoes.card3Title}</h3>
                <p className="what-does__card-desc">{content.whatDoes.card3Desc}</p>
              </div>
              <div className="what-does__card">
                <div className="what-does__card-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7,10 12,15 17,10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                </div>
                <h3 className="what-does__card-title">{content.whatDoes.card4Title}</h3>
                <p className="what-does__card-desc">{content.whatDoes.card4Desc}</p>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* ═══ TICKER ═══ */}
      <div className="ticker" aria-label="Most used calculators">
        <div className="wrap--wide">
          <div className="ticker__inner">
            <div className="ticker__label" aria-hidden="true">{content.ticker.label}</div>
            <div className="ticker__scroll" role="list">
              <button className="tool-tag" role="listitem">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="8" width="5" height="12" rx="1" /><rect x="9.5" y="4" width="5" height="16" rx="1" /><rect x="16" y="10" width="5" height="10" rx="1" /></svg> OEE <span className="tool-tag__badge tool-tag__badge--pro">{content.ticker.badgePro}</span>
              </button>
              <button className="tool-tag" role="listitem">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27,6.96 12,12.01 20.73,6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg> EOQ <span className="tool-tag__badge tool-tag__badge--free">{content.ticker.badgeFree}</span>
              </button>
              <button className="tool-tag" role="listitem">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 3v18h18" /><path d="m7 16 4-5 4 3 4-6" /></svg> IRR / NPV <span className="tool-tag__badge tool-tag__badge--pro">{content.ticker.badgePro}</span>
              </button>
              <button className="tool-tag" role="listitem">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg> Cpk / Sigma <span className="tool-tag__badge tool-tag__badge--pro">{content.ticker.badgePro}</span>
              </button>
              <button className="tool-tag" role="listitem">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><polyline points="12,6 12,12 16,14" /></svg> Takt Time <span className="tool-tag__badge tool-tag__badge--free">{content.ticker.badgeFree}</span>
              </button>
              <button className="tool-tag" role="listitem">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg> Bolt Torque <span className="tool-tag__badge tool-tag__badge--pro">{content.ticker.badgePro}</span>
              </button>
              <button className="tool-tag" role="listitem">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" /></svg> LMTD <span className="tool-tag__badge tool-tag__badge--pro">{content.ticker.badgePro}</span>
              </button>
              <button className="tool-tag" role="listitem">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg> MTBF / MTTR <span className="tool-tag__badge tool-tag__badge--pro">{content.ticker.badgePro}</span>
              </button>
              <button className="tool-tag" role="listitem">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 3v18h18" /><path d="m7 10 5 5 5-5" /></svg> Break-Even <span className="tool-tag__badge tool-tag__badge--free">{content.ticker.badgeFree}</span>
              </button>
              <button className="tool-tag" role="listitem">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 20h20" /><path d="M5 20V8l7-5 7 5v12" /><path d="M9 20v-5h6v5" /></svg> Kanban Cards <span className="tool-tag__badge tool-tag__badge--free">{content.ticker.badgeFree}</span>
              </button>
              <button className="tool-tag" role="listitem">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" /></svg> Pipe Pressure Drop <span className="tool-tag__badge tool-tag__badge--pro">{content.ticker.badgePro}</span>
              </button>
              <button className="tool-tag" role="listitem">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 22 16 8" /><path d="M8.5 2A16.5 16.5 0 0 1 22 15.5c0 4.14-1.49 7.29-5.86 7.29A15.83 15.83 0 0 1 2 9.5 7.5 7.5 0 0 1 8.5 2z" /></svg> Carbon Footprint <span className="tool-tag__badge tool-tag__badge--pro">{content.ticker.badgePro}</span>
              </button>
              <button className="tool-tag" role="listitem">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" /></svg> Compressor Power <span className="tool-tag__badge tool-tag__badge--pro">{content.ticker.badgePro}</span>
              </button>
              <button className="tool-tag" role="listitem">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="3" y1="6" x2="20" y2="6" /><line x1="3" y1="12" x2="15" y2="12" /><line x1="3" y1="18" x2="18" y2="18" /><line x1="3" y1="4" x2="3" y2="20" /></svg> PERT / CPM <span className="tool-tag__badge tool-tag__badge--free">{content.ticker.badgeFree}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ FORMULA MARQUEE ═══ */}
      <div className="formula-strip" aria-hidden="true">
        <div className="formula-marquee" id="formulaMarquee">
          <div className="formula-pill">
            <span className="formula-pill__name">OEE</span>
            <span className="formula-pill__eq"><span className="var">OEE</span> <span className="op">=</span> <span className="var">A</span> <span className="op">&times;</span> <span className="var">P</span> <span className="op">&times;</span> <span className="var">Q</span></span>
          </div>
          <div className="formula-pill">
            <span className="formula-pill__name">EOQ</span>
            <span className="formula-pill__eq"><span className="var">Q*</span> <span className="op">=</span> &radic;<span className="op">(</span>2<span className="var">DS</span><span className="op">/</span><span className="var">H</span><span className="op">)</span></span>
          </div>
          <div className="formula-pill">
            <span className="formula-pill__name">NPV</span>
            <span className="formula-pill__eq"><span className="blue">NPV</span> <span className="op">=</span> &Sigma; <span className="var">CF_t</span><span className="op">/(</span>1<span className="op">+</span><span className="var">r</span><span className="op">)^t</span></span>
          </div>
          <div className="formula-pill">
            <span className="formula-pill__name">Cpk</span>
            <span className="formula-pill__eq"><span className="var">Cpk</span> <span className="op">= min(</span><span className="var">USL</span><span className="op">&minus;</span><span className="var">&mu;</span><span className="op">,</span> <span className="var">&mu;</span><span className="op">&minus;</span><span className="var">LSL</span><span className="op">) / 3&sigma;</span></span>
          </div>
          <div className="formula-pill">
            <span className="formula-pill__name">LMTD</span>
            <span className="formula-pill__eq"><span className="var">LMTD</span> <span className="op">=</span> <span className="op">(</span><span className="var">&Delta;T&sbquo;&#x2081;</span><span className="op">&minus;</span><span className="var">&Delta;T&sbquo;&#x2082;</span><span className="op">) / ln(</span><span className="var">&Delta;T&sbquo;&#x2081;</span><span className="op">/</span><span className="var">&Delta;T&sbquo;&#x2082;</span><span className="op">)</span></span>
          </div>
          <div className="formula-pill">
            <span className="formula-pill__name">WACC</span>
            <span className="formula-pill__eq"><span className="blue">WACC</span> <span className="op">=</span> <span className="var">E</span><span className="op">/</span><span className="var">V</span>&middot;<span className="var">Re</span> <span className="op">+</span> <span className="var">D</span><span className="op">/</span><span className="var">V</span>&middot;<span className="var">Rd</span>&middot;<span className="op">(1&minus;</span><span className="var">T</span><span className="op">)</span></span>
          </div>
          <div className="formula-pill">
            <span className="formula-pill__name">NIOSH RWL</span>
            <span className="formula-pill__eq"><span className="var">RWL</span> <span className="op">=</span> 23&middot;<span className="var">HM</span>&middot;<span className="var">VM</span>&middot;<span className="var">DM</span>&middot;<span className="var">AM</span>&middot;<span className="var">FM</span>&middot;<span className="var">CM</span></span>
          </div>
          <div className="formula-pill">
            <span className="formula-pill__name">Colebrook</span>
            <span className="formula-pill__eq">1<span className="op">/</span>&radic;<span className="var">f</span> <span className="op">= &minus;2 log(</span><span className="var">&epsilon;</span><span className="op">/3.7D +</span> 2.51<span className="op">/</span><span className="var">Re</span>&radic;<span className="var">f</span><span className="op">)</span></span>
          </div>
          <div className="formula-pill">
            <span className="formula-pill__name">IRR</span>
            <span className="formula-pill__eq">&Sigma; <span className="var">CF_t</span><span className="op">/(1+</span><span className="blue">IRR</span><span className="op">)^t = 0</span></span>
          </div>
          <div className="formula-pill">
            <span className="formula-pill__name">MTBF</span>
            <span className="formula-pill__eq"><span className="var">MTBF</span> <span className="op">= T / n</span> <span className="op">;</span> <span className="var">A</span> <span className="op">=</span> <span className="var">MTBF</span><span className="op">/(</span><span className="var">MTBF</span><span className="op">+</span><span className="var">MTTR</span><span className="op">)</span></span>
          </div>
          {/* duplicate */}
          <div className="formula-pill">
            <span className="formula-pill__name">OEE</span>
            <span className="formula-pill__eq"><span className="var">OEE</span> <span className="op">=</span> <span className="var">A</span> <span className="op">&times;</span> <span className="var">P</span> <span className="op">&times;</span> <span className="var">Q</span></span>
          </div>
          <div className="formula-pill">
            <span className="formula-pill__name">EOQ</span>
            <span className="formula-pill__eq"><span className="var">Q*</span> <span className="op">=</span> &radic;<span className="op">(</span>2<span className="var">DS</span><span className="op">/</span><span className="var">H</span><span className="op">)</span></span>
          </div>
          <div className="formula-pill">
            <span className="formula-pill__name">NPV</span>
            <span className="formula-pill__eq"><span className="blue">NPV</span> <span className="op">=</span> &Sigma; <span className="var">CF_t</span><span className="op">/(</span>1<span className="op">+</span><span className="var">r</span><span className="op">)^t</span></span>
          </div>
          <div className="formula-pill">
            <span className="formula-pill__name">Cpk</span>
            <span className="formula-pill__eq"><span className="var">Cpk</span> <span className="op">= min(</span><span className="var">USL</span><span className="op">&minus;</span><span className="var">&mu;</span><span className="op">,</span> <span className="var">&mu;</span><span className="op">&minus;</span><span className="var">LSL</span><span className="op">) / 3&sigma;</span></span>
          </div>
          <div className="formula-pill">
            <span className="formula-pill__name">LMTD</span>
            <span className="formula-pill__eq"><span className="var">LMTD</span> <span className="op">=</span> <span className="op">(</span><span className="var">&Delta;T&sbquo;&#x2081;</span><span className="op">&minus;</span><span className="var">&Delta;T&sbquo;&#x2082;</span><span className="op">) / ln(</span><span className="var">&Delta;T&sbquo;&#x2081;</span><span className="op">/</span><span className="var">&Delta;T&sbquo;&#x2082;</span><span className="op">)</span></span>
          </div>
          <div className="formula-pill">
            <span className="formula-pill__name">WACC</span>
            <span className="formula-pill__eq"><span className="blue">WACC</span> <span className="op">=</span> <span className="var">E</span><span className="op">/</span><span className="var">V</span>&middot;<span className="var">Re</span> <span className="op">+</span> <span className="var">D</span><span className="op">/</span><span className="var">V</span>&middot;<span className="var">Rd</span>&middot;<span className="op">(1&minus;</span><span className="var">T</span><span className="op">)</span></span>
          </div>
          <div className="formula-pill">
            <span className="formula-pill__name">NIOSH RWL</span>
            <span className="formula-pill__eq"><span className="var">RWL</span> <span className="op">=</span> 23&middot;<span className="var">HM</span>&middot;<span className="var">VM</span>&middot;<span className="var">DM</span>&middot;<span className="var">AM</span>&middot;<span className="var">FM</span>&middot;<span className="var">CM</span></span>
          </div>
          <div className="formula-pill">
            <span className="formula-pill__name">Colebrook</span>
            <span className="formula-pill__eq">1<span className="op">/</span>&radic;<span className="var">f</span> <span className="op">= &minus;2 log(</span><span className="var">&epsilon;</span><span className="op">/3.7D +</span> 2.51<span className="op">/</span><span className="var">Re</span>&radic;<span className="var">f</span><span className="op">)</span></span>
          </div>
          <div className="formula-pill">
            <span className="formula-pill__name">IRR</span>
            <span className="formula-pill__eq">&Sigma; <span className="var">CF_t</span><span className="op">/(1+</span><span className="blue">IRR</span><span className="op">)^t = 0</span></span>
          </div>
          <div className="formula-pill">
            <span className="formula-pill__name">MTBF</span>
            <span className="formula-pill__eq"><span className="var">MTBF</span> <span className="op">= T / n</span> <span className="op">;</span> <span className="var">A</span> <span className="op">=</span> <span className="var">MTBF</span><span className="op">/(</span><span className="var">MTBF</span><span className="op">+</span><span className="var">MTTR</span><span className="op">)</span></span>
          </div>
        </div>
      </div>

      {/* ═══ 6 CATEGORIES (inline SVG icons) ═══ */}
      <section className="cat-section section" aria-labelledby="cat-title">
        <div className="wrap">
          <div className="cat-header reveal">
            <div>
              <div className="eyebrow eyebrow--terra">{content.categories.eyebrow}</div>
              <h2 className="section-h2" id="cat-title">{content.categories.title}</h2>
            </div>
            <p className="section-lead" style={{ maxWidth: "360px" }}>{content.categories.lead}</p>
          </div>

          <div className="cat-grid" role="list">
            <a href="/categories/manufacturing" className="cat-card cat-card--feature reveal" role="listitem">
              <div className="cat-card__icon" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="7" width="6" height="13" rx="1" /><rect x="9" y="3" width="6" height="17" rx="1" /><rect x="16" y="10" width="6" height="10" rx="1" /><path d="M2 20h20" /></svg>
              </div>
              <div className="cat-card__body">
                <div className="cat-card__name">{content.categories.manufacturingName}</div>
                <div className="cat-card__desc">{content.categories.manufacturingDesc}</div>
              </div>
              <div className="cat-card__footer">
                <div className="cat-count"><span className="cat-count-dot" aria-hidden="true"></span>{content.categories.manufacturingTools}</div>
                <div className="cat-arrow" aria-hidden="true">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2"><path d="m4 2 4 4-4 4" /></svg>
                </div>
              </div>
            </a>
            <a href="/categories/finance" className="cat-card reveal" role="listitem">
              <div className="cat-card__icon" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="3,17 9,11 13,15 21,7" /><polyline points="14,7 21,7 21,14" /></svg>
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
            <a href="/categories/quality" className="cat-card reveal" role="listitem">
              <div className="cat-card__icon" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="m9 12 2 2 4-4" /></svg>
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
            <a href="/categories/energy" className="cat-card reveal" role="listitem">
              <div className="cat-card__icon" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" /></svg>
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
            <a href="/categories/logistics" className="cat-card reveal" role="listitem">
              <div className="cat-card__icon" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="1" y="3" width="15" height="13" rx="2" /><path d="M16 8h4l3 5v3h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>
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
            <a href="/categories/engineering" className="cat-card reveal" role="listitem">
              <div className="cat-card__icon" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
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

      {/* ═══ METHODOLOGY (two-col) ═══ */}
      <section className="method-section section" aria-labelledby="method-title">
        <div className="wrap">
          <div className="method-two-col reveal">
            <div className="method-heading">
              <div className="eyebrow">{content.methodology.eyebrow}</div>
              <h2 className="section-h2" id="method-title" dangerouslySetInnerHTML={{ __html: content.methodology.title }} />
              <p className="section-lead" style={{ marginTop: "16px" }}>{content.methodology.lead}</p>
              <a href="/methodology" className="method-link" style={{ marginTop: "24px", display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.875rem", fontWeight: 500, color: "var(--terracotta)", textDecoration: "none" }}>
                Read our methodology
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m5 2.5 4 4-4 4" /></svg>
              </a>
            </div>

            <div className="method-items" role="list">
              <div className="method-item reveal" role="listitem">
                <div className="method-item__icon" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h4l10-10a1.414 1.414 0 0 0-4-4L4 16v4z" /><path d="m14 6 4 4" /></svg>
                </div>
                <div className="method-item__body">
                  <div className="method-item__title">{content.methodology.card1Title}</div>
                  <div className="method-item__desc">{content.methodology.card1Desc}</div>
                </div>
                <div className="method-item__tag">{content.methodology.card1Tag}</div>
              </div>
              <div className="method-item reveal" role="listitem">
                <div className="method-item__icon" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
                </div>
                <div className="method-item__body">
                  <div className="method-item__title">{content.methodology.card2Title}</div>
                  <div className="method-item__desc">{content.methodology.card2Desc}</div>
                </div>
                <div className="method-item__tag method-item__tag--pro">{content.pricing.proTag}</div>
              </div>
              <div className="method-item reveal" role="listitem">
                <div className="method-item__icon" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                </div>
                <div className="method-item__body">
                  <div className="method-item__title">{content.methodology.card3Title}</div>
                  <div className="method-item__desc">{content.methodology.card3Desc}</div>
                </div>
              </div>
              <div className="method-item reveal" role="listitem">
                <div className="method-item__icon" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>
                </div>
                <div className="method-item__body">
                  <div className="method-item__title">{content.methodology.card4Title}</div>
                  <div className="method-item__desc">{content.methodology.card4Desc}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="section-rule" />

      {/* ═══ AUDIENCE (inline SVG icons) ═══ */}
      <section className="audience-section section" aria-labelledby="audience-title">
        <div className="wrap">
          <div className="reveal" style={{ textAlign: "center", marginBottom: "var(--sp-10)" }}>
            <div className="eyebrow">{content.audience.eyebrow}</div>
            <h2 className="section-h2" id="audience-title" dangerouslySetInnerHTML={{ __html: content.audience.title }} />
          </div>
          <div className="audience-grid reveal" role="list">
            <div className="persona" role="listitem">
              <div className="persona__icon" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 20h20" /><path d="M5 20V9" /><path d="M9 20V5h6v15" /><path d="M19 20v-6h-4v6" /><path d="M9 9H5" /></svg>
              </div>
              <div className="persona__role">{content.audience.persona1Role}</div>
              <div className="persona__desc">{content.audience.persona1Desc}</div>
              <div className="persona__tools" aria-label="Related tools">
                {content.audience.persona1Tags.split(", ").map((tag, i) => <span className="ptag" key={i}>{tag}</span>)}
              </div>
            </div>
            <div className="persona" role="listitem">
              <div className="persona__icon" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 3h18v18H3z" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" /></svg>
              </div>
              <div className="persona__role">{content.audience.persona2Role}</div>
              <div className="persona__desc">{content.audience.persona2Desc}</div>
              <div className="persona__tools" aria-label="Related tools">
                {content.audience.persona2Tags.split(", ").map((tag, i) => <span className="ptag" key={i}>{tag}</span>)}
              </div>
            </div>
            <div className="persona" role="listitem">
              <div className="persona__icon" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 3H5a2 2 0 0 0-2 2v4" /><path d="M15 3h4a2 2 0 0 1 2 2v4" /><path d="M9 3v4" /><path d="M15 3v4" /><path d="M3 9h18" /><path d="m9 16 2 2 4-4" /></svg>
              </div>
              <div className="persona__role">{content.audience.persona3Role}</div>
              <div className="persona__desc">{content.audience.persona3Desc}</div>
              <div className="persona__tools" aria-label="Related tools">
                {content.audience.persona3Tags.split(", ").map((tag, i) => <span className="ptag" key={i}>{tag}</span>)}
              </div>
            </div>
            <div className="persona" role="listitem">
              <div className="persona__icon" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" /></svg>
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

      {/* ═══ PRICING (inline SVG icons) ═══ */}
      <section className="pricing-section section" aria-labelledby="pricing-title">
        <div className="wrap">
          <div className="reveal" style={{ textAlign: "center", marginBottom: "var(--sp-2)" }}>
            <div className="eyebrow eyebrow--cobalt">{content.pricing.eyebrow}</div>
            <h2 className="section-h2" id="pricing-title">{content.pricing.title}</h2>
            <p className="section-lead" style={{ maxWidth: "480px", margin: "0 auto" }}>{content.pricing.lead}</p>
          </div>

          <div className="pricing-wrap reveal" role="table" aria-label="Plan comparison">
            <div className="pricing-top" role="row">
              <div className="pricing-col-head pricing-col-head--label" role="columnheader">
                <div className="pricing-why">
                  <div className="pricing-why__q">{content.pricing.compareLabel}</div>
                  <a className="pricing-why__a">{content.pricing.compareDesc}</a>
                </div>
              </div>
              <div className="pricing-col-head pricing-col-head--pro" role="columnheader">
                <div className="tier-tag tier-tag--pro">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" /></svg> {content.pricing.proTag}
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
                <span className="pricing-row__feat-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M9 12h6" /><path d="M12 9v6" /></svg>
                </span>
                {content.pricing.feat1Label}
              </div>
              <div className="pricing-row__cell pricing-row__cell--pro" role="cell"><div className="check-y" aria-label="Included"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="2,7 5.5,10.5 12,3" /></svg></div></div>
              <div className="pricing-row__cell" role="cell"><div className="check-y check-y--cobalt" aria-label="Included"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="2,7 5.5,10.5 12,3" /></svg></div></div>
            </div>
            <div className="pricing-row" role="row">
              <div className="pricing-row__feat" role="cell">
                <span className="pricing-row__feat-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
                </span>
                {content.pricing.feat2Label}
              </div>
              <div className="pricing-row__cell pricing-row__cell--pro" role="cell"><div className="check-y" aria-label="Included"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="2,7 5.5,10.5 12,3" /></svg></div></div>
              <div className="pricing-row__cell" role="cell"><div className="check-n" aria-label="Not included"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><line x1="3" y1="7" x2="11" y2="7" /></svg></div></div>
            </div>
            <div className="pricing-row" role="row">
              <div className="pricing-row__feat" role="cell">
                <span className="pricing-row__feat-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7,10 12,15 17,10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                </span>
                {content.pricing.feat3Label}
              </div>
              <div className="pricing-row__cell pricing-row__cell--pro" role="cell"><div className="check-y" aria-label="Included"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="2,7 5.5,10.5 12,3" /></svg></div></div>
              <div className="pricing-row__cell" role="cell"><div className="check-n" aria-label="Not included"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><line x1="3" y1="7" x2="11" y2="7" /></svg></div></div>
            </div>
            <div className="pricing-row" role="row">
              <div className="pricing-row__feat" role="cell">
                <span className="pricing-row__feat-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17,21 17,13 7,13 7,21" /><polyline points="7,3 7,8 15,8" /></svg>
                </span>
                {content.pricing.feat4Label}
              </div>
              <div className="pricing-row__cell pricing-row__cell--pro" role="cell"><div className="check-y" aria-label="Included"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="2,7 5.5,10.5 12,3" /></svg></div></div>
              <div className="pricing-row__cell" role="cell"><div className="check-n" aria-label="Not included"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><line x1="3" y1="7" x2="11" y2="7" /></svg></div></div>
            </div>
            <div className="pricing-row" role="row">
              <div className="pricing-row__feat" role="cell">
                <span className="pricing-row__feat-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="22,12 18,12 15,21 9,3 6,12 2,12" /></svg>
                </span>
                {content.pricing.feat5Label}
              </div>
              <div className="pricing-row__cell pricing-row__cell--pro" role="cell"><div className="check-y" aria-label="Included"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="2,7 5.5,10.5 12,3" /></svg></div></div>
              <div className="pricing-row__cell" role="cell"><div className="check-n" aria-label="Not included"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><line x1="3" y1="7" x2="11" y2="7" /></svg></div></div>
            </div>
            <div className="pricing-row" role="row">
              <div className="pricing-row__feat" role="cell">
                <span className="pricing-row__feat-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                </span>
                {content.pricing.feat6Label}
              </div>
              <div className="pricing-row__cell pricing-row__cell--pro" role="cell"><div className="check-y" aria-label="Included"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="2,7 5.5,10.5 12,3" /></svg></div></div>
              <div className="pricing-row__cell" role="cell"><div className="check-y check-y--cobalt" aria-label="Included"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="2,7 5.5,10.5 12,3" /></svg></div></div>
            </div>
            <div className="pricing-row" role="row">
              <div className="pricing-row__feat" role="cell">
                <span className="pricing-row__feat-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2" /></svg>
                </span>
                {content.pricing.feat7Label}
              </div>
              <div className="pricing-row__cell pricing-row__cell--pro" role="cell"><div className="check-y" aria-label="Included"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="2,7 5.5,10.5 12,3" /></svg></div></div>
              <div className="pricing-row__cell" role="cell"><div className="check-y check-y--cobalt" aria-label="Included"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="2,7 5.5,10.5 12,3" /></svg></div></div>
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

    </div>
  );
}
