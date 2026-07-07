"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "@/lib/i18n-stub";
import Link from "next/link";
import "@/styles/claude2-landing.css";

export function Claude2LandingContent() {
  const t = useTranslations("claude2Landing");
  const [challenge, setChallenge] = useState("scrap");
  const [opportunities, setOpportunities] = useState<string[]>([]);

  /* ── Live calc state ─────────────────────────── */
  const [prod, setProd] = useState(10000);
  const [scrapRate, setScrapRate] = useState(12);
  const [unitCost, setUnitCost] = useState(4.5);

  /* ── Countdown ───────────────────────────────── */
  const [timeLeft, setTimeLeft] = useState("");

  /* Update opportunities when challenge changes */
  useEffect(() => {
    const raw = t.raw(`oppMap.${challenge}`) as string[] | undefined;
    if (raw && raw.length > 0) {
      setOpportunities(raw);
    } else {
      setOpportunities(t.raw("oppMap.scrap") as string[] ?? []);
    }
  }, [challenge, t]);

  /* Format helper */
  const fmt = useCallback((v: number) => "€" + Math.round(v).toLocaleString("de-DE"), []);

  const annualLoss = prod * (scrapRate / 100) * unitCost * 12;
  const recovery = annualLoss * 0.833;
  const roi = annualLoss > 0 ? Math.round(annualLoss / 1900) : 0;

  /* Progress - Zeigarnik effect */
  const filled = (prod > 0 ? 20 : 0) + (scrapRate > 0 ? 20 : 0) + (unitCost > 0 ? 20 : 0);
  const pct = Math.min(40 + filled, 100);
  const remaining = Math.max(0, Math.round((100 - pct) / 20));

  /* Countdown ticker - end of month UTC */
  useEffect(() => {
    function tick() {
      const now = new Date();
      const deadline = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59));
      const diff = Math.max(0, deadline.getTime() - Date.now());
      const s = Math.floor(diff / 1000);
      const h = Math.floor(s / 3600);
      const m = Math.floor((s % 3600) / 60);
      const sec = s % 60;
      const pad = (n: number) => String(n).padStart(2, "0");
      setTimeLeft(`${pad(h)}:${pad(m)}:${pad(sec)}`);
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const tPainCards = t.raw("pain.cards") as Array<{ label: string; title: string; body: string; link: string }> | undefined;
  const painCards = tPainCards ?? [];
  const tSocialCases = t.raw("social.cases") as Array<{ sector: string; problem: string; result: string; resultLabel: string }> | undefined;
  const socialCases = tSocialCases ?? [];
  const tTrustItems = t.raw("social.trustItems") as string[] | undefined;
  const trustItems = tTrustItems ?? [];
  const tFreeFeatures = t.raw("compare.free.features") as Array<{ text: string; sub: string }> | undefined;
  const freeFeatures = tFreeFeatures ?? [];
  const tProFeatures = t.raw("compare.pro.features") as Array<{ text: string; sub: string }> | undefined;
  const proFeatures = tProFeatures ?? [];
  const tStats = t.raw("method.stats") as Array<{ num: string; label: string }> | undefined;
  const stats = tStats ?? [];
  const tBadges = t.raw("method.badges") as Array<{ name: string; sub: string }> | undefined;
  const badges = tBadges ?? [];
  const tSectorOptions = t.raw("hero.sectorOptions") as string[] | undefined;
  const sectorOptions = tSectorOptions ?? [];
  const tChallengeOptions = t.raw("hero.challengeOptions") as Array<{ value: string; label: string }> | undefined;
  const challengeOptions = tChallengeOptions ?? [];
  const tSizeOptions = t.raw("hero.sizeOptions") as string[] | undefined;
  const sizeOptions = tSizeOptions ?? [];

  return (
    <main className="cl2">
      {/* ── HERO ──────────────────────────────── */}
      <section className="cl2-section" style={{ paddingTop: 72, paddingBottom: 80 }}>
        <div className="cl2-eyebrow">
          <div className="cl2-dot" />
          {t("hero.eyebrow")}
        </div>

        <h1 className="cl2-h1">
          {t("hero.headline")}<br />
          <em>{t("hero.headlineEm")}</em>
        </h1>
        <p className="cl2-subhead">{t("hero.subtitle")}</p>

        <div className="cl2-qualifier">
          <div
            style={{
              fontSize: 13, fontWeight: 600, color: "var(--cl2-ink-muted)",
              textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 20,
            }}
          >
            {t("hero.qualifierLabel")}
          </div>

          <div className="cl2-q-grid">
            <div>
              <div className="cl2-q-label">{t("hero.sectorLabel")}</div>
              <select className="cl2-q-select" defaultValue="cnc">
                {sectorOptions.map((opt, i) => (
                  <option key={i} value={opt.toLowerCase().slice(0, 4)}>{opt}</option>
                ))}
              </select>
            </div>
            <div>
              <div className="cl2-q-label">{t("hero.challengeLabel")}</div>
              <select
                className="cl2-q-select"
                value={challenge}
                onChange={(e) => setChallenge(e.target.value)}
              >
                {challengeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <div className="cl2-q-label">{t("hero.sizeLabel")}</div>
              <select className="cl2-q-select" defaultValue="mid">
                {sizeOptions.map((opt, i) => (
                  <option key={i} value={["small", "mid", "large", "micro"][i] || String(i)}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="cl2-opp-box">
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 11, fontWeight: 700, textTransform: "uppercase",
                  letterSpacing: ".06em", color: "var(--cl2-gain)", marginBottom: 8,
                }}
              >
                {t("hero.opportunityTitle")}
              </div>
              <div className="cl2-opp-tags">
                {opportunities.map((tag, i) => (
                  <span key={i} className="cl2-opp-tag">✓ {tag}</span>
                ))}
              </div>
            </div>
            <div className="cl2-opp-count">{opportunities.length} {t("hero.areas")}</div>
          </div>

          <Link href="/free-tools" className="cl2-btn-primary" style={{ textDecoration: "none" }}>
            {t("hero.cta")}
          </Link>
          <p className="cl2-micro">{t("hero.micro")}</p>
        </div>
      </section>

      <div className="cl2-divider" />

      {/* ── PAIN SECTION ────────────────────────── */}
      <section className="cl2-section-dark">
        <div className="cl2-inner">
          <div className="cl2-ticker">
            <div className="cl2-dot-red" />
            <div className="cl2-ticker-text">{t("pain.ticker")}</div>
          </div>

          <div style={{ marginBottom: 48 }}>
            <span className="cl2-label">{t("pain.label")}</span>
            <h2 className="cl2-h2" style={{ color: "#F0EEE6" }}>
              {t("pain.title")}
            </h2>
          </div>

          <div className="cl2-pain-grid">
            {painCards.slice(0, 4).map((card, i) => (
              <div key={i} className="cl2-dark-card">
                <div className="cl2-dark-card-label">{card.label}</div>
                <div className="cl2-dark-card-title">{card.title}</div>
                <div className="cl2-dark-card-body">{card.body}</div>
                <Link href="/free-tools" className="cl2-dark-card-link">{card.link}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="cl2-divider" />

      {/* ── CALCULATOR ─────────────────────────── */}
      <section className="cl2-section" id="cl2-calculator">
        <span className="cl2-label">{t("calc.label")}</span>
        <h2 className="cl2-h2">{t("calc.title")}</h2>
        <p
          style={{
            fontSize: 14, color: "var(--cl2-ink-muted)",
            marginBottom: 32, maxWidth: 480,
          }}
        >
          {t("calc.subtitle")}
        </p>

        <div className="cl2-calc-wrap">
          <div className="cl2-calc-header">
            <div style={{ fontSize: 14, fontWeight: 600 }}>{t("calc.headerTitle")}</div>
            <div className="cl2-calc-badge">{t("calc.headerBadge")}</div>
          </div>
          <div className="cl2-calc-body">
            <div className="cl2-prog-label">
              {pct < 100
                ? t("calc.progressLabel", { pct: String(pct), remaining: String(remaining) })
                : t("calc.progressComplete")}
            </div>
            <div className="cl2-prog-track">
              <div className="cl2-prog-fill" style={{ width: `${pct}%` }} />
            </div>

            <div className="cl2-input-grid">
              <div>
                <div className="cl2-inp-label">
                  {t("calc.input1Label")}
                  <span className="cl2-tip" title={t("calc.input1Tip")}>?</span>
                </div>
                <input
                  type="number" className="cl2-input" min={0}
                  value={prod} onChange={(e) => setProd(Number(e.target.value) || 0)}
                />
              </div>
              <div>
                <div className="cl2-inp-label">
                  {t("calc.input2Label")}
                  <span className="cl2-tip" title={t("calc.input2Tip")}>?</span>
                </div>
                <input
                  type="number" className="cl2-input" min={0} max={100}
                  value={scrapRate} onChange={(e) => setScrapRate(Number(e.target.value) || 0)}
                />
              </div>
              <div>
                <div className="cl2-inp-label">
                  {t("calc.input3Label")}
                  <span className="cl2-tip" title={t("calc.input3Tip")}>?</span>
                </div>
                <input
                  type="number" className="cl2-input" min={0} step={0.1}
                  value={unitCost} onChange={(e) => setUnitCost(Number(e.target.value) || 0)}
                />
              </div>
            </div>

            <div className="cl2-result-box">
              <div className="cl2-result-metric">
                <div className="cl2-result-label">{t("calc.resultLoss")}</div>
                <div className="cl2-result-val" style={{ color: "var(--cl2-loss)" }}>
                  {fmt(annualLoss)}
                </div>
              </div>
              <div className="cl2-result-div" />
              <div className="cl2-result-metric">
                <div className="cl2-result-label">{t("calc.resultRecovery")}</div>
                <div className="cl2-result-val" style={{ color: "var(--cl2-gain)" }}>
                  {fmt(recovery)}
                </div>
              </div>
              <div className="cl2-result-div" />
              <div className="cl2-result-metric">
                <div className="cl2-result-label">{t("calc.resultRoi")}</div>
                <div className="cl2-result-val" style={{ color: "var(--cl2-terra-dark)" }}>
                  {roi > 0 ? `${roi}x` : "-"}
                </div>
              </div>
            </div>

            {/* AI BLUR GATE */}
            <div className="cl2-ai-block">
              <div className="cl2-ai-header">
                <div className="cl2-dot" />
                <div className="cl2-ai-label">{t("calc.aiTitle")}</div>
              </div>
              <div className="cl2-ai-text">
                {t("calc.aiText", { rate: String(scrapRate), monthly: fmt(prod * (scrapRate / 100) * unitCost) })}
              </div>
              <div className="cl2-ai-gate-wrap">
                <div className="cl2-ai-blur">{t("calc.aiBlurText")}</div>
                <Link href="/pricing" className="cl2-ai-gate" style={{ textDecoration: "none" }}>
                  {t("calc.aiGateCta")}
                </Link>
              </div>
            </div>

            <Link href="/tools/free/scrap-cost" className="cl2-btn-primary" style={{ marginTop: 20, textDecoration: "none" }}>
              {t("calc.cta")}
            </Link>
            <p className="cl2-micro" style={{ marginTop: 10 }}>
              {t("calc.micro")}{" "}
              <Link href="/free-tools">{t("calc.microLink")}</Link>
            </p>
          </div>
        </div>
      </section>

      <div className="cl2-divider" />

      {/* ── SOCIAL PROOF ────────────────────────── */}
      <section className="cl2-section">
        <div className="cl2-trust-bar">
          <span className="cl2-trust-label">{t("social.trustLabel")}</span>
          <div className="cl2-trust-logos">
            {trustItems.map((item, i) => (
              <span key={i} className="cl2-trust-logo">{item}</span>
            ))}
          </div>
        </div>

        <span className="cl2-label">{t("social.label")}</span>
        <h2 className="cl2-h2" style={{ marginBottom: 32 }}>{t("social.title")}</h2>

        <div className="cl2-cases">
          {socialCases.slice(0, 3).map((c, i) => (
            <div key={i} className="cl2-case-card">
              <div className="cl2-case-sector">{c.sector}</div>
              <div className="cl2-case-problem">{c.problem}</div>
              <div className="cl2-case-result">{c.result}</div>
              <div className="cl2-case-result-label">{c.resultLabel}</div>
            </div>
          ))}
        </div>

        <div className="cl2-quote-block">
          <p
            style={{
              fontSize: 15, fontStyle: "italic", color: "var(--cl2-ink)",
              lineHeight: 1.7, marginBottom: 12,
            }}
          >
            &ldquo;{t("social.quoteText")}&rdquo;
          </p>
          <div style={{ fontSize: 12, color: "var(--cl2-ink-muted)", fontWeight: 600 }}>
            - {t("social.quoteAuthor")}
          </div>
        </div>
      </section>

      <div className="cl2-divider" />

      {/* ── COMPARE FREE vs PRO ────────────────── */}
      <section className="cl2-section">
        <span className="cl2-label">{t("compare.label")}</span>
        <h2 className="cl2-h2" style={{ marginBottom: 8 }}>{t("compare.title")}</h2>
        <p
          style={{
            fontSize: 14, color: "var(--cl2-ink-muted)",
            marginBottom: 32, maxWidth: 480,
          }}
        >
          {t("compare.subtitle")}
        </p>

        <div className="cl2-compare-grid">
          {/* FREE */}
          <div className="cl2-compare-card">
            <div className="cl2-compare-header">
              <div className="cl2-compare-tier">{t("compare.free.tier")}</div>
              <div className="cl2-compare-price">{t("compare.free.price")}</div>
              <div className="cl2-compare-desc">{t("compare.free.desc")}</div>
            </div>
            <div className="cl2-compare-rows">
              {freeFeatures.map((feat, i) => (
                <div key={i} className="cl2-compare-row" style={i >= 3 ? { opacity: 0.4 } : undefined}>
                  <span className={`cl2-check${i >= 3 ? " cl2-dim" : ""}`}>✓</span>
                  <div>
                    <span className="cl2-row-label">{feat.text}</span>
                    <span className="cl2-row-sub">{feat.sub}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="cl2-compare-cta-wrap">
              <Link href="/free-tools" className="cl2-btn-secondary" style={{ textDecoration: "none" }}>
                {t("compare.free.cta")}
              </Link>
            </div>
          </div>

          {/* PRO */}
          <div className="cl2-compare-card cl2-featured">
            <div className="cl2-compare-header">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                <div className="cl2-compare-tier cl2-pro">{t("compare.pro.tier")}</div>
                <span className="cl2-badge-pop">{t("compare.pro.badge")}</span>
              </div>
              <div className="cl2-compare-price">{t("compare.pro.price")}</div>
              <div className="cl2-compare-desc">{t("compare.pro.desc")}</div>
            </div>
            <div className="cl2-compare-rows">
              {proFeatures.map((feat, i) => (
                <div key={i} className="cl2-compare-row">
                  <span className="cl2-check">✓</span>
                  <div>
                    <span className="cl2-row-label">{feat.text}</span>
                    <span className="cl2-row-sub">{feat.sub}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="cl2-compare-cta-wrap">
              <Link href="/pricing" className="cl2-btn-primary" style={{ textDecoration: "none" }}>
                {t("compare.pro.cta")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="cl2-divider" />

      {/* ── METHODOLOGY ──────────────────────────── */}
      <section className="cl2-section">
        <div className="cl2-stats-grid">
          {stats.map((s, i) => (
            <div key={i} className="cl2-stat-card">
              <div className="cl2-stat-num">{s.num}</div>
              <div className="cl2-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
        <span className="cl2-label">{t("method.label")}</span>
        <h2 className="cl2-h2" style={{ marginBottom: 24 }}>{t("method.title")}</h2>
        <div className="cl2-method-grid">
          {badges.map((b, i) => (
            <div key={i} className="cl2-method-badge">
              <div className="cl2-method-name">{b.name}</div>
              <div className="cl2-method-sub">{b.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ──────────────────────────── */}
      <section className="cl2-final">
        <div className="cl2-final-inner">
          <div className="cl2-countdown">
            ⏱ {t("final.countdownPrefix")}: <span style={{ fontVariantNumeric: "tabular-nums" }}>{timeLeft}</span>
          </div>
          <h2>{t("final.title")}</h2>
          <p>{t("final.subtitle")}</p>
          <Link href="/pricing" className="cl2-final-cta" style={{ textDecoration: "none" }}>
            {t("final.cta")}
          </Link>
          <Link href="/free-tools" className="cl2-final-sec-btn" style={{ textDecoration: "none" }}>
            {t("final.secCta")}
          </Link>
          <p className="cl2-final-note">{t("final.note")}</p>
        </div>
      </section>
    </main>
  );
}
