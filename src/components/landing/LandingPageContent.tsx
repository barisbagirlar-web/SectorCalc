"use client";

import { useEffect, useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

// Pre-defined mapping matching the script
const OPP_MAP: Record<string, string[]> = {
  scrap: ["Scrap Cost", "Material Yield", "Quality Loss", "Pricing Margin"],
  energy: ["Specific Consumption", "Energy Intensity", "CO₂ Cost", "Tariff Optimization"],
  capacity: ["OEE Impact", "Bottleneck Analysis", "Capacity Cost", "Setup Time"],
  oee: ["Downtime €", "Speed Loss €", "Quality Reject €", "Total OEE Impact"],
  pricing: ["Machine Hour", "Labor Cost", "Overhead Rate", "Quotation Margin"],
};

export function LandingPageContent() {
  const t = useTranslations("landingV3");
  const totalTools = 552; // Simplified for client rendering without suspense or prop drilling

  // Qualifier State
  const [challenge, setChallenge] = useState<keyof typeof OPP_MAP>("scrap");

  // Calculator State
  const [prod, setProd] = useState<number>(10000);
  const [scrap, setScrap] = useState<number>(12);
  const [cost, setCost] = useState<number>(4.5);

  // Timer State
  const [timerStr, setTimerStr] = useState("00:00:00");

  useEffect(() => {
    function getDeadline() {
      const now = new Date();
      return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59));
    }

    function tick() {
      const diff = Math.max(0, getDeadline().getTime() - Date.now());
      const s = Math.floor(diff / 1000);
      const h = Math.floor(s / 3600);
      const m = Math.floor((s % 3600) / 60);
      const sec = s % 60;
      const p = (n: number) => String(n).padStart(2, "0");
      setTimerStr(`${p(h)}:${p(m)}:${p(sec)}`);
    }

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const annualLoss = prod * (scrap / 100) * cost * 12;
  const recovery = annualLoss * 0.833;
  const roi = annualLoss > 0 ? Math.round(annualLoss / 1900) : 0;
  const monthlyLoss = prod * (scrap / 100) * cost;

  const fmt = (v: number) => "€" + Math.round(v).toLocaleString("de-DE");

  const filledSteps = (prod > 0 ? 20 : 0) + (scrap > 0 ? 20 : 0) + (cost > 0 ? 20 : 0);
  const pct = Math.min(40 + filledSteps, 100);
  const remaining = Math.round((100 - pct) / 20);

  const above = scrap > 8;

  return (
    <div className="sc-page-wrap">
      {/* HERO */}
      <section className="sc-section sc-hero-center" style={{ paddingTop: "72px", paddingBottom: "80px" }}>
        <div className="sc-eyebrow">
          <div className="sc-dot"></div>
          {t("hero.eyebrow", { toolCount: totalTools })}
        </div>
        <h1 className="sc-h1">
          {t("hero.headline")}
          <br />
          <em>{t("hero.headlineEm")}</em>
        </h1>
        <p className="sc-subhead">{t("hero.subtitle")}</p>

        <div className="sc-qualifier">
          <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--sc-ink-muted)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: "20px" }}>
            {t("hero.qualifierLabel")}
          </div>
          <div className="sc-q-grid">
            <div>
              <div className="sc-q-label">{t("hero.sector")}</div>
              <select className="sc-q-select">
                {Object.entries(t.raw("hero.sectors")).map(([k, v]) => (
                  <option key={k} value={k}>{v as string}</option>
                ))}
              </select>
            </div>
            <div>
              <div className="sc-q-label">{t("hero.challenge")}</div>
              <select className="sc-q-select" value={challenge} onChange={(e) => setChallenge(e.target.value as any)}>
                {Object.entries(t.raw("hero.challenges")).map(([k, v]) => (
                  <option key={k} value={k}>{v as string}</option>
                ))}
              </select>
            </div>
            <div>
              <div className="sc-q-label">{t("hero.size")}</div>
              <select className="sc-q-select">
                {(t.raw("hero.sizes") as string[]).map((v, i) => (
                  <option key={i}>{v}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="sc-opp-box">
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--sc-gain)", marginBottom: "8px" }}>
                {t("hero.detectedAreas")}
              </div>
              <div className="sc-opp-tags">
                {t.raw(`oppMap.${challenge}`) ? (t.raw(`oppMap.${challenge}`) as string[]).map((a, i) => (
                  <span key={i} className="sc-opp-tag">✓ {a}</span>
                )) : null}
              </div>
            </div>
            <div className="sc-opp-count">{t("hero.areaCount", { count: OPP_MAP[challenge]?.length || 4 })}</div>
          </div>
          <button className="sc-btn-primary" onClick={() => document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" })}>
            {t("hero.showCalculations")}
          </button>
          <p className="sc-micro">{t("hero.micro")}</p>
        </div>
      </section>

      <div className="sc-divider"></div>

      {/* PAIN */}
      <section className="sc-section-dark">
        <div className="sc-inner">
          {/* Centered header block */}
          <div className="sc-pain-header">
            <div className="sc-ticker">
              <div className="sc-dot-red"></div>
              <div style={{ fontSize: "13px", color: "rgba(240,238,230,.8)" }}>
                {t("pain.ticker").split(t("pain.tickerHighlight")).map((part, i, arr) => (
                  <span key={i}>
                    {part}
                    {i < arr.length - 1 && <strong style={{ color: "#F0EEE6" }}>{t("pain.tickerHighlight")}</strong>}
                  </span>
                ))}
              </div>
            </div>
            <span className="sc-label">{t("pain.label")}</span>
            <h2 className="sc-h2 sc-h2-dark" style={{ marginBottom: 0 }}>
              {t("pain.h2Line1")}
              <br />
              {t("pain.h2Line2")}
            </h2>
          </div>
          {/* Symmetrical 2×2 card grid */}
          <div className="sc-pain-grid">
            {(t.raw("pain.cards") as Array<any>).map((card, i) => (
              <div key={i} className="sc-dark-card">
                <div className="sc-dark-card-label">{card.label}</div>
                <div className="sc-dark-card-title">{card.title}</div>
                <div className="sc-dark-card-body">{card.body}</div>
                <Link href={card.href as any} className="sc-dark-card-link">{card.link}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="sc-divider"></div>

      {/* CALCULATOR */}
      <section className="sc-section" id="calculator">
        <span className="sc-label">{t("calc.label")}</span>
        <h2 className="sc-h2">{t("calc.h2")}</h2>
        <p style={{ fontSize: "14px", color: "var(--sc-ink-muted)", marginBottom: "32px", maxWidth: "480px" }}>
          {t("calc.subhead")}
        </p>

        <div className="sc-calc-wrap">
          <div className="sc-calc-header">
            <div style={{ fontSize: "14px", fontWeight: 600 }}>{t("calc.headerTitle")}</div>
            <div className="sc-calc-badge">{t("calc.badge")}</div>
          </div>
          <div className="sc-calc-body">
            <div className="sc-prog-label">
              {pct < 100 ? t("calc.progress", { pct, remaining }) : t("calc.progressDone", { pct, remaining })}
            </div>
            <div className="sc-prog-track">
              <div className="sc-prog-fill" style={{ width: `${pct}%` }}></div>
            </div>

            <div className="sc-input-grid">
              <div>
                <div className="sc-inp-label">
                  {t("calc.inpProd")} <span className="sc-tip" title="Monthly total output">?</span>
                </div>
                <input type="number" className="sc-input" value={prod} onChange={(e) => setProd(Number(e.target.value) || 0)} />
              </div>
              <div>
                <div className="sc-inp-label">
                  {t("calc.inpScrap")} <span className="sc-tip" title="Most assume 8%, actual is 12-15%">?</span>
                </div>
                <input type="number" className="sc-input" value={scrap} onChange={(e) => setScrap(Number(e.target.value) || 0)} max={100} />
              </div>
              <div>
                <div className="sc-inp-label">
                  {t("calc.inpCost")} <span className="sc-tip" title="Raw material + labor + energy">?</span>
                </div>
                <input type="number" className="sc-input" value={cost} onChange={(e) => setCost(Number(e.target.value) || 0)} step={0.1} />
              </div>
            </div>

            <div className="sc-result-box">
              <div className="sc-result-metric">
                <div className="sc-result-label">{t("calc.resLoss")}</div>
                <div className="sc-result-val" style={{ color: "var(--sc-loss)" }}>{fmt(annualLoss)}</div>
              </div>
              <div className="sc-result-div"></div>
              <div className="sc-result-metric">
                <div className="sc-result-label">{t("calc.resRec")}</div>
                <div className="sc-result-val" style={{ color: "var(--sc-gain)" }}>{fmt(recovery)}</div>
              </div>
              <div className="sc-result-div"></div>
              <div className="sc-result-metric">
                <div className="sc-result-label">{t("calc.resRoi")}</div>
                <div className="sc-result-val" style={{ color: "var(--sc-terra-dark)" }}>{roi > 0 ? `${roi}x` : "—"}</div>
              </div>
            </div>

            {/* AI BLOCK */}
            <div className="sc-ai-block">
              <div className="sc-ai-header">
                <div className="sc-ai-dot"></div>
                <div className="sc-ai-label">{t("calc.aiHeader")}</div>
              </div>
              <div className="sc-ai-text">
                {above ? (
                  <span>
                    {t("calc.aiTextAbove", { rate: scrap, monthlyLoss: fmt(monthlyLoss) }).split(t("calc.above")).map((part, i, arr) => (
                      <span key={i}>
                        {part}
                        {i < arr.length - 1 && <strong style={{ color: "var(--sc-loss)" }}>{t("calc.above")}</strong>}
                      </span>
                    ))}
                  </span>
                ) : (
                  <span>
                    {t("calc.aiTextBelow", { rate: scrap }).split(t("calc.below")).map((part, i, arr) => (
                      <span key={i}>
                        {part}
                        {i < arr.length - 1 && <strong style={{ color: "var(--sc-gain)" }}>{t("calc.below")}</strong>}
                      </span>
                    ))}
                  </span>
                )}
              </div>
              <div className="sc-ai-gate-wrap">
                <div className="sc-ai-blur">
                  {t("calc.aiBlur")}
                </div>
                <Link href="/pricing" className="sc-ai-gate">
                  {t("calc.aiGateBtn")}
                </Link>
              </div>
            </div>

            <Link href="/pricing" className="sc-btn-primary" style={{ marginTop: "20px", display: "flex" }}>
              {t("calc.btnFullReport")}
            </Link>
            <p className="sc-micro" style={{ marginTop: "10px" }}>
              {t("calc.microText")} <Link href="/tools" style={{ color: "var(--sc-terra)" }}>{t("calc.microLink")}</Link>
            </p>
          </div>
        </div>
      </section>

      <div className="sc-divider"></div>

      {/* SOCIAL PROOF */}
      <section className="sc-section">
        <div className="sc-trust-bar">
          <span className="sc-trust-label">{t("social.labelMethod")}</span>
          <div className="sc-trust-logos">
            <span className="sc-trust-logo">ISO</span>
            <span className="sc-trust-logo">ASME</span>
            <span className="sc-trust-logo">VDI 2067</span>
            <span className="sc-trust-logo">ASHRAE</span>
            <span className="sc-trust-logo">IEC</span>
            <span className="sc-trust-logo">Lean / Six Sigma</span>
          </div>
        </div>

        <span className="sc-label">{t("social.labelResults")}</span>
        <h2 className="sc-h2" style={{ marginBottom: "32px" }}>{t("social.h2")}</h2>

        <div className="sc-cases">
          {(t.raw("social.cases") as Array<any>).map((c, i) => (
            <div key={i} className="sc-case-card">
              <div className="sc-case-sector">{c.sector}</div>
              <div className="sc-case-problem">{c.problem}</div>
              <div className="sc-case-result">{c.result}</div>
              <div className="sc-case-result-label">{c.resultLabel}</div>
            </div>
          ))}
        </div>

        <div className="sc-quote-block">
          <p style={{ fontSize: "15px", fontStyle: "italic", color: "var(--sc-ink)", lineHeight: 1.7, marginBottom: "12px" }}>
            {t("social.quote")}
          </p>
          <div style={{ fontSize: "12px", color: "var(--sc-ink-muted)", fontWeight: 600 }}>
            {t("social.quoteAuthor")}
          </div>
        </div>
      </section>

      <div className="sc-divider"></div>

      {/* FREE VS PRO */}
      <section className="sc-section">
        <span className="sc-label">{t("compare.label")}</span>
        <h2 className="sc-h2" style={{ marginBottom: "8px" }}>{t("compare.h2")}</h2>
        <p style={{ fontSize: "14px", color: "var(--sc-ink-muted)", marginBottom: "32px", maxWidth: "480px" }}>
          {t("compare.subhead")}
        </p>

        <div className="sc-compare-grid">
          <div className="sc-compare-card">
            <div className="sc-compare-header">
              <div className="sc-compare-tier">{t("compare.free.tier")}</div>
              <div className="sc-compare-price">€0</div>
              <div className="sc-compare-desc">{t("compare.free.desc")}</div>
            </div>
            <div className="sc-compare-rows">
              {(t.raw("compare.rows") as Array<any>).map((r, i) => (
                <div key={i} className="sc-compare-row" style={{ opacity: r.free ? 1 : 0.4 }}>
                  <span className={`sc-check ${!r.free ? "sc-dim" : ""}`}>✓</span>
                  <div>
                    <span className="sc-row-label">{r.text.replace("{count}", String(totalTools))}</span>
                    <span className="sc-row-sub">{r.sub}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="sc-compare-cta-wrap">
              <Link href="/tools" className="sc-btn-secondary" style={{ display: "flex" }}>
                {t("compare.free.btn")}
              </Link>
            </div>
          </div>

          <div className="sc-compare-card sc-featured">
            <div className="sc-compare-header">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                <div className="sc-compare-tier sc-pro">{t("compare.pro.tier")}</div>
                <span className="sc-badge-pop">{t("compare.pro.badge")}</span>
              </div>
              <div className="sc-compare-price">Credit-based</div>
              <div className="sc-compare-desc">{t("compare.pro.desc")}</div>
            </div>
            <div className="sc-compare-rows">
              {(t.raw("compare.rows") as Array<any>).map((r, i) => (
                <div key={i} className="sc-compare-row">
                  <span className="sc-check">✓</span>
                  <div>
                    <span className="sc-row-label">{r.text.replace("{count}", String(totalTools))}</span>
                    <span className="sc-row-sub">{r.proSub}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="sc-compare-cta-wrap">
              <Link href="/pricing" className="sc-btn-primary" style={{ display: "flex" }}>
                {t("compare.pro.btn")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="sc-divider"></div>

      {/* METHODOLOGY */}
      <section className="sc-section">
        <div className="sc-stats-grid">
          {(t.raw("method.stats") as Array<any>).map((s, i) => (
            <div key={i} className="sc-stat-card">
              <div className="sc-stat-num">{s.num.replace("{count}", String(totalTools))}</div>
              <div className="sc-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
        <span className="sc-label">{t("method.label")}</span>
        <h2 className="sc-h2" style={{ marginBottom: "24px" }}>{t("method.h2")}</h2>
        <div className="sc-method-grid">
          {(t.raw("method.badges") as Array<any>).map((b, i) => (
            <div key={i} className="sc-method-badge">
              <div className="sc-method-name">{b.name}</div>
              <div className="sc-method-sub">{b.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="sc-final">
        <div className="sc-final-inner">
          <div className="sc-countdown">
            {t("final.timerPrefix")} <span style={{ fontVariantNumeric: "tabular-nums" }}>{timerStr}</span>
          </div>
          <h2 className="sc-h2">
            {t("final.h2Line1")}
            <br />
            {t("final.h2Line2")}
          </h2>
          <p>{t("final.p")}</p>
          <Link href="/pricing" className="sc-final-cta" style={{ display: "block" }}>
            {t("final.cta")}
          </Link>
          <Link href="/tools" className="sc-final-sec-btn" style={{ display: "block" }}>
            {t("final.secBtn")}
          </Link>
          <p className="sc-final-note">{t("final.note")}</p>
        </div>
      </section>
    </div>
  );
}
