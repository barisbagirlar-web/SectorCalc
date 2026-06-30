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
      {/* ═══ HERO — two-column: headline + OEE mockup ═══ */}
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

          {/* Search bar */}
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
        <section className="section-light" aria-labelledby="what-does-heading">
          <div className="wrap">
            <h2 className="section-title" id="what-does-heading">{content.whatDoes.title}</h2>
            <div className="four-grid">
              {[1, 2, 3, 4].map((i) => {
                const titleKey = `card${i}Title` as keyof typeof content.whatDoes;
                const descKey = `card${i}Desc` as keyof typeof content.whatDoes;
                return (
                  <div key={i} className="four-card">
                    <h3 className="four-card__title">{content.whatDoes![titleKey] as string}</h3>
                    <p className="four-card__desc">{content.whatDoes![descKey] as string}</p>
                  </div>
                );
              })}
          </div>
        </div>
      </section>
      ) : null}

      {/* ═══ FREE VS PRO COMPARISON ═══ */}
      {content.freeVsPro ? (
        <section className="section-white" aria-labelledby="fvp-heading">
        <div className="wrap">
            <h2 className="section-title" id="fvp-heading">{content.freeVsPro.title}</h2>
            <div className="fvp-table">
              <div className="fvp-row fvp-row--head">
                <div className="fvp-cell fvp-cell--label" />
                <div className="fvp-cell fvp-cell--free">
                  <div className="fvp-tier-tag">{content.freeVsPro.freeTitle}</div>
                  <div className="fvp-tier-count">{content.freeVsPro.freeTools}</div>
                  <a href="/free-tools" className="btn-outline">{content.freeVsPro.freeCta}</a>
                </div>
                <div className="fvp-cell fvp-cell--pro">
                  <div className="fvp-tier-tag fvp-tier-tag--pro">{content.freeVsPro.proTitle}</div>
                  <div className="fvp-tier-count fvp-tier-count--pro">{content.freeVsPro.proTools}</div>
                  <a href="/pricing" className="btn-primary">{content.freeVsPro.proCta}</a>
                </div>
              </div>
              {(["feat1","feat2","feat3","feat4","feat5"] as const).map((key) => (
                <div key={key} className="fvp-row">
                  <div className="fvp-cell fvp-cell--label">{content.freeVsPro![key]}</div>
                  <div className="fvp-cell fvp-cell--free"><span className="check-y" aria-label="Included"><svg viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="2,7 5.5,10.5 12,3" /></svg></span></div>
                  <div className="fvp-cell fvp-cell--pro"><span className="check-y" aria-label="Included"><svg viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="2,7 5.5,10.5 12,3" /></svg></span></div>
                </div>
              ))}
                </div>
              </div>
        </section>
      ) : null}

      {/* ═══ WHY PRO ═══ */}
      {content.whyPro ? (
        <section className="section-light" aria-labelledby="why-pro-heading">
          <div className="wrap">
            <h2 className="section-title" id="why-pro-heading">{content.whyPro.title}</h2>
            <div className="four-grid">
              {[1, 2, 3, 4].map((i) => {
                const titleKey = `card${i}Title` as keyof typeof content.whyPro;
                const descKey = `card${i}Desc` as keyof typeof content.whyPro;
                return (
                  <div key={i} className="four-card">
                    <h3 className="four-card__title">{content.whyPro![titleKey] as string}</h3>
                    <p className="four-card__desc">{content.whyPro![descKey] as string}</p>
                  </div>
                );
              })}
          </div>
        </div>
      </section>
      ) : null}

      {/* ═══ CATEGORY CARDS — Problem → Tools → Pro Output ═══ */}
      {content.categories2 && content.categories2.length > 0 ? (
        <section className="section-white" aria-labelledby="cat2-heading">
        <div className="wrap">
            <h2 className="section-title" id="cat2-heading">{content.categories.eyebrow}</h2>
            <p className="section-lead-centered">{content.categories.title}</p>
            <div className="cat2-grid">
              {content.categories2.map((cat) => (
                <a key={cat.id} href={cat.href} className="cat2-card">
                  <div className="cat2-card__name">{cat.name}</div>
                  <div className="cat2-card__section">
                    <div className="cat2-card__label">Problem</div>
                    <p className="cat2-card__text">{cat.problem}</p>
          </div>
                  <div className="cat2-card__section">
                    <div className="cat2-card__label">Tools</div>
                    <p className="cat2-card__text">{cat.tools}</p>
              </div>
                  <div className="cat2-card__section cat2-card__section--pro">
                    <div className="cat2-card__label cat2-card__label--pro">Pro Output</div>
                    <p className="cat2-card__text">{cat.proOutput}</p>
              </div>
                </a>
              ))}
            </div>
              </div>
        </section>
      ) : (
        /* Fallback: old category cards */
        <section className="cat-section section section-white" aria-labelledby="cat-title">
          <div className="wrap">
            <div className="cat-header reveal">
              <div>
                <div className="eyebrow">{content.categories.eyebrow}</div>
                <h2 className="section-h2" id="cat-title">{content.categories.title}</h2>
              </div>
              <p className="section-lead">{content.categories.lead}</p>
            </div>
            <div className="cat-grid" role="list">
              {[
                ["manufacturing", content.categories.manufacturingName, content.categories.manufacturingDesc, content.categories.manufacturingTools],
                ["finance", content.categories.financeName, content.categories.financeDesc, content.categories.financeTools],
                ["quality", content.categories.qualityName, content.categories.qualityDesc, content.categories.qualityTools],
                ["energy", content.categories.energyName, content.categories.energyDesc, content.categories.energyTools],
                ["logistics", content.categories.logisticsName, content.categories.logisticsDesc, content.categories.logisticsTools],
                ["engineering", content.categories.mechanicalName, content.categories.mechanicalDesc, content.categories.mechanicalTools],
              ].map(([id, name, desc, tools], idx) => (
                <a key={id as string} href={`/categories/${id}`} className={`cat-card reveal ${idx === 0 ? "cat-card--feature" : ""}`} role="listitem">
                  <div className="cat-card__body">
                    <div className="cat-card__name">{name as string}</div>
                    <div className="cat-card__desc">{desc as string}</div>
              </div>
                  <div className="cat-card__footer">
                    <div className="cat-count"><span className="cat-count-dot" aria-hidden="true"></span>{tools as string}</div>
              </div>
                </a>
              ))}
            </div>
              </div>
        </section>
      )}

      {/* ═══ METHODOLOGY / TRUST PROOF ═══ */}
      <section className="section-light" aria-labelledby="method-title">
        <div className="wrap">
          <h2 className="section-title" id="method-title">{content.methodology.title}</h2>
          <div className="method-items method-items--grid">
            {[
              { icon: "pen", title: content.methodology.card1Title, desc: content.methodology.card1Desc, tag: content.methodology.card1Tag },
              { icon: "doc", title: content.methodology.card2Title, desc: content.methodology.card2Desc, tag: content.pricing.proTag },
              { icon: "warn", title: content.methodology.card3Title, desc: content.methodology.card3Desc },
              { icon: "shield", title: content.methodology.card4Title, desc: content.methodology.card4Desc },
            ].map((item, i) => (
              <div key={i} className="method-card">
                {item.tag ? <div className={`method-card__tag ${item.tag === content.pricing.proTag ? "method-card__tag--pro" : ""}`}>{item.tag}</div> : null}
                <h3 className="method-card__title">{item.title}</h3>
                <p className="method-card__desc">{item.desc}</p>
              </div>
            ))}
            </div>
          <div className="method-link-wrap">
            <a href="/methodology" className="method-link">
              Read our methodology
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m5 2.5 4 4-4 4" /></svg>
            </a>
          </div>
        </div>
      </section>

      {/* ═══ PRICING BRIDGE ═══ */}
      {content.pricingBridge ? (
        <section className="pricing-bridge" aria-labelledby="pricing-bridge-heading">
        <div className="wrap">
            <div className="pricing-bridge__card">
              <p className="pricing-bridge__text" id="pricing-bridge-heading">{content.pricingBridge.text}</p>
              <a href={content.pricingBridge.ctaHref} className="btn-primary">{content.pricingBridge.cta}</a>
          </div>
        </div>
      </section>
      ) : null}
    </div>
  );
}
