"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { getPrintData, type PrintData } from "@/lib/reports/generated-tool-print-data";
import type {
  GeneratedToolResult,
  GeneratedToolSchema,
  GeneratedToolInput,
} from "@/lib/generated-tools/types";
import { resolveGeneratedToolTitle } from "@/lib/generated-tools/resolve-tool-display";
import { resolvePrimaryOutputKey } from "@/lib/generated-tools/resolve-tool-display";
import { resolveGeneratedI18nText } from "@/lib/generated-tools/resolve-i18n-text";
import { formatGeneratedNumericValue } from "@/lib/generated-tools/format-generated-numeric";
import { resolvePrimaryOutputUnit } from "@/lib/generated-tools/resolve-output-unit";
import { normalizeLocale } from "@/lib/format/localization";

export function PremiumGeneratedToolPrintContent({ slug }: { slug: string }) {
  const locale = useLocale();
  const t = useTranslations("generatedTool.reportSummary");
  const [data, setData] = useState<PrintData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const parsed = getPrintData();
      if (!parsed) {
        setError("printErrorNoData");
        return;
      }
      if (parsed.slug !== slug) {
        setError("printErrorMismatch");
        return;
      }
      setData(parsed);
    } catch {
      setError("printErrorParse");
    }
  }, [slug]);

  useEffect(() => {
    if (data && !ready) {
      const timer = setTimeout(() => {
        window.print();
        setReady(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [data, ready]);

  const localeTag = normalizeLocale(locale);
  const localeMap: Record<string, string> = {
    tr: "tr-TR", en: "en-US", de: "de-DE", fr: "fr-FR", es: "es-ES", ar: "ar",
  };
  const dateFmtLocale = localeMap[localeTag] || "en-US";

  if (error) {
    return (
      <div style={{ padding: 40, color: "#EF4444", fontFamily: "sans-serif" }}>
        <h1 style={{ fontSize: 20, marginBottom: 12 }}>{t("title")} — {t("preAssessment")}</h1>
        <p>{t(error)}</p>
        <button
          onClick={() => window.close()}
          style={{
            marginTop: 16,
            padding: "10px 20px",
            background: "#C9A84C",
            border: "none",
            borderRadius: 6,
            color: "#0B1628",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          {t("printClose")}
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ padding: 40, color: "#8899B2", fontFamily: "sans-serif", textAlign: "center" }}>
        <p>{t("title")}…</p>
      </div>
    );
  }

  const schema = data.schema as unknown as GeneratedToolSchema;
  const result = data.result as unknown as GeneratedToolResult;
  const { inputs } = data;

  const title = resolveGeneratedToolTitle(slug, schema, locale);
  const primaryOutputKey = resolvePrimaryOutputKey(schema);
  const primaryUnit = resolvePrimaryOutputUnit(schema);

  const primaryRaw = result[primaryOutputKey];
  const formattedPrimary =
    typeof primaryRaw === "number" && Number.isFinite(primaryRaw)
      ? formatGeneratedNumericValue(primaryRaw, primaryOutputKey, locale, primaryUnit !== "—" ? primaryUnit : undefined)
      : String(primaryRaw ?? "—");

  const hiddenDrivers: readonly string[] = Array.isArray(result.hiddenLossDrivers) ? result.hiddenLossDrivers : [];
  const suggestedActions: readonly string[] = Array.isArray(result.suggestedActions) ? result.suggestedActions : [];
  const breakdown = result.breakdown ?? {};

  const now = new Date();
  const dateStr = now.toLocaleDateString(dateFmtLocale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const slugUpper = slug.replace(/-/g, "").toUpperCase();
  const trustTraceId = `TT-${slugUpper.slice(0, 4)}-${now.toISOString().slice(0, 10).replace(/-/g, "")}-0001`;
  const docId = `SC-${now.getFullYear()}-${slugUpper.slice(0, 6)}-0001`;

  const primaryIsNumber = typeof primaryRaw === "number" && Number.isFinite(primaryRaw);
  const riskScore =
    typeof result.dataConfidenceAdjusted === "number" && primaryIsNumber && (primaryRaw as number) !== 0
      ? Math.min(
          Math.max(
            Math.round((1 - result.dataConfidenceAdjusted / ((primaryRaw as number) * 2)) * 100),
            0,
          ),
          100,
        )
      : 45;
  const riskColor = riskScore <= 30 ? "#22C55E" : riskScore <= 60 ? "#F59E0B" : "#EF4444";
  const riskLabelKey = riskScore <= 30 ? "riskLow" : riskScore <= 60 ? "riskMedium" : "riskHigh";
  const gaugeCircumference = Math.PI * 40;
  const gaugeOffset = gaugeCircumference * (1 - riskScore / 100);

  return (
    <>
      <style>{INDUSTRIAL_PRINT_CSS}</style>
      <button className="no-print" style={printBtnStyle} onClick={() => window.print()}>
        ⬇ {t("printDownload")}
      </button>

      {/* PAGE 1 — COVER */}
      <div className="page">
        <div className="accent-top" />
        <div className="header">
          <div className="logo-area">
            <div className="logo-mark">SC</div>
            <div>
              <div className="logo-text">SectorCalc</div>
              <div className="logo-sub">{t("premiumLabel")}</div>
            </div>
          </div>
          <div className="header-meta">
            <div className="doc-type">{t("title")}</div>
            <div className="doc-id">{docId} &nbsp;|&nbsp; Rev.1.0</div>
          </div>
        </div>

        <div className="cover-hero">
          <div className="tool-badge">{t("badgeDefault")}</div>
          <h1 className="report-title">{title}</h1>
          <p className="report-subtitle">{t("methodologyNote")}</p>
          <div className="primary-result-card">
            <div className="prc-accent" />
            <div className="prc-content">
              <div className="prc-label">{t("primaryResult")}</div>
              <div className="prc-value">{formattedPrimary}</div>
              <div className="prc-desc">
                {t("simulationNotice")} &nbsp;
                <span className={`badge ${riskScore <= 30 ? "green" : riskScore <= 60 ? "amber" : "red"}`}>⚠ {t(riskLabelKey)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="meta-grid">
          <div className="meta-item">
            <div className="meta-key">{t("metaDate")}</div>
            <div className="meta-val">{dateStr}</div>
          </div>
          <div className="meta-item">
            <div className="meta-key">{t("metaStandard")}</div>
            <div className="meta-val"><span className="iso-tag">ISO 8688-1</span></div>
          </div>
          <div className="meta-item">
            <div className="meta-key">{t("metaType")}</div>
            <div className="meta-val">{t("preAssessment")} / {t("simulationNotice")}</div>
          </div>
          <div className="meta-item">
            <div className="meta-key">{t("metaConfidence")}</div>
            <div className="meta-val"><span className={`badge ${riskScore <= 30 ? "green" : riskScore <= 60 ? "amber" : "red"}`}>{t(riskLabelKey)}</span></div>
          </div>
          <div className="meta-item">
            <div className="meta-key">{t("metaEngine")}</div>
            <div className="meta-val">SectorCalc v2.6 — Pro</div>
          </div>
          <div className="meta-item">
            <div className="meta-key">{t("metaTraceId")}</div>
            <div className="meta-val tt-mono">{trustTraceId}</div>
          </div>
        </div>

        <div className="content">
          <section>
            <div className="section-label">
              <span className="sl-num">01</span>
              <span className="sl-title">{t("sectionParameters")}</span>
            </div>
            <table className="param-table">
              <thead>
                <tr>
                  <th>{t("colParameter")}</th>
                  <th>{t("colValue")}</th>
                  <th>{t("colUnit")}</th>
                  <th>{t("colSource")}</th>
                </tr>
              </thead>
              <tbody>
                {schema.inputs.map((input: GeneratedToolInput) => {
                  const val = inputs[input.id];
                  const displayVal =
                    typeof val === "number"
                      ? formatGeneratedNumericValue(val, input.id, locale)
                      : String(val ?? "—");
                  const inputLabel = resolveGeneratedI18nText(input.label_i18n, locale, input.label ?? input.id);
                  return (
                    <tr key={input.id}>
                      <td>{inputLabel}</td>
                      <td className="val">{displayVal}</td>
                      <td className="unit">{input.unit ?? "—"}</td>
                      <td className="ref">{t("preAssessment")}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>

          <section>
            <div className="section-label">
              <span className="sl-num">02</span>
              <span className="sl-title">{t("sectionMethodology")}</span>
            </div>
            <div className="formula-box">
              C<sub>loss</sub> = Q<sub>daily</sub> × r<sub>scrap</sub> × C<sub>unit</sub> + C<sub>rework</sub>
              <div className="f-desc">{t("methodologyFormula")}</div>
            </div>
            <div style={{ marginTop: 10 }}>
              <div className="callout info">
                <div className="callout-icon">ℹ</div>
                <div>
                  <div className="callout-title">{t("sectionMethodology")}</div>
                  <div className="callout-body">{t("methodologyNote")}</div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="watermark">SC</div>

        <div className="footer">
          <div className="footer-left">
            SectorCalc &nbsp;|&nbsp; sectorcalc.com<br />
            {t("footerLegal")}
          </div>
          <div className="footer-divider" />
          <div className="footer-right">
            <div className="page-num">01 / 02</div>
            <div>{trustTraceId}</div>
          </div>
        </div>
      </div>

      {/* PAGE 2 — RESULTS */}
      <div className="page">
        <div className="accent-top-thin" />
        <div className="header">
          <div className="logo-area">
            <div className="logo-mark">SC</div>
            <div>
              <div className="logo-text">SectorCalc</div>
              <div className="logo-sub">{title}</div>
            </div>
          </div>
          <div className="header-meta">
            <div className="doc-type">{t("sectionResults")}</div>
            <div className="doc-id">{docId}</div>
          </div>
        </div>

        <div className="content">
          <section>
            <div className="section-label">
              <span className="sl-num">03</span>
              <span className="sl-title">{t("sectionResults")}</span>
            </div>
            <div className="results-grid">
              <div className="result-card highlight">
                <div className="rc-label">{t("primaryResult")}</div>
                <div className="rc-value">{formattedPrimary}</div>
                <div className="rc-sub">{t("simulationNotice")}</div>
              </div>
              {Object.entries(breakdown).slice(0, 3).map(([key, value]) => {
                if (typeof value !== "number" || !Number.isFinite(value)) return null;
                const breakdownMap = schema.outputs?.breakdown as Record<string, string> | undefined;
                const label = breakdownMap?.[key] ?? key;
                const formatted = formatGeneratedNumericValue(value, key, locale);
                return (
                  <div className="result-card" key={key}>
                    <div className="rc-label">{label}</div>
                    <div className="rc-value" style={{ fontSize: 16 }}>{formatted}</div>
                    <div className="rc-sub">{t("breakdownItem")}</div>
                  </div>
                );
              })}
            </div>
          </section>

          <section>
            <div className="section-label">
              <span className="sl-num">04</span>
              <span className="sl-title">{t("sectionRisk")}</span>
            </div>
            <div className="two-col">
              <div className="gauge-card">
                <div className="gc-title">{t("riskScore")} (0–100)</div>
                <div className="gauge-section">
                  <div className="gauge-wrap">
                    <svg className="gauge-svg" viewBox="0 0 100 55">
                      <path d="M10 50 A 40 40 0 0 1 90 50" stroke="rgba(255,255,255,0.08)" strokeWidth="8" fill="none" strokeLinecap="round" />
                      <path d="M10 50 A 40 40 0 0 1 90 50" stroke="url(#gauge-grad)" strokeWidth="8" fill="none" strokeLinecap="round" strokeDasharray={`${gaugeCircumference}`} strokeDashoffset={`${gaugeOffset}`} />
                      <defs>
                        <linearGradient id="gauge-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#22C55E" />
                          <stop offset="50%" stopColor="#F59E0B" />
                          <stop offset="100%" stopColor="#EF4444" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="gauge-score-text">{riskScore}</div>
                  </div>
                    <div className="gauge-labels">
                    <div className="gauge-row">
                      <span className="gauge-dot" style={{ background: "#22C55E" }} />
                      <span className="gauge-row-label">{t("riskLow")} (0–30)</span>
                      <span className="gauge-row-val">{riskLabelKey === "riskLow" ? `◀ ${t("riskLow")}` : "—"}</span>
                    </div>
                    <div className="gauge-row">
                      <span className="gauge-dot" style={{ background: "#F59E0B" }} />
                      <span className="gauge-row-label">{t("riskMedium")} (31–60)</span>
                      <span className="gauge-row-val">{riskLabelKey === "riskMedium" ? `◀ ${t("riskMedium")}` : "—"}</span>
                    </div>
                    <div className="gauge-row">
                      <span className="gauge-dot" style={{ background: "#EF4444" }} />
                      <span className="gauge-row-label">{t("riskHigh")} (61–100)</span>
                      <span className="gauge-row-val">{riskLabelKey === "riskHigh" ? `◀ ${t("riskHigh")}` : "—"}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="confidence-card">
                <div className="gc-title">{t("sectionRisk")}</div>
                <div className="conf-rows">
                  <div className="conf-row">
                    <span className="conf-label">{t("primaryResult")}</span>
                    <span className="badge gold">{t("confidenceExact")}</span>
                  </div>
                  <div className="conf-row">
                    <span className="conf-label">{t("confidenceLevel")}</span>
                    <span className="badge amber">{t("confidenceProbable")}</span>
                  </div>
                  <div className="conf-row">
                    <span className="conf-label">{t("breakdownItem")}</span>
                    <span className="badge amber">{t("confidenceProbable")}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {hiddenDrivers.length > 0 && (
            <section>
              <div className="section-label">
                <span className="sl-num">05</span>
                <span className="sl-title">{t("hiddenLosses")}</span>
              </div>
              <div className="steps-list">
                {hiddenDrivers.map((driver, idx) => (
                  <div className="step-item" key={idx}>
                    <div className="step-num">{idx + 1}</div>
                    <div className="step-content">
                      <div className="step-title">{driver}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {suggestedActions.length > 0 && (
            <section>
              <div className="section-label">
                <span className="sl-num">{hiddenDrivers.length > 0 ? "06" : "05"}</span>
                <span className="sl-title">{t("sectionActions")}</span>
              </div>
              <div className="steps-list">
                {suggestedActions.map((action, idx) => (
                  <div className="step-item" key={idx}>
                    <div className="step-num">{idx + 1}</div>
                    <div className="step-content">
                      <div className="step-title">{action}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section>
            <div className="section-label">
              <span className="sl-num">
                {5 + (hiddenDrivers.length > 0 ? 1 : 0) + (suggestedActions.length > 0 ? 1 : 0)}
              </span>
              <span className="sl-title">{t("sectionFindings")}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div className="callout warning">
                <div className="callout-icon">⚠</div>
                <div>
                  <div className="callout-title">{t("findingSurface")}</div>
                  <div className="callout-body">{t("findingSurfaceText")}</div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="section-label">
              <span className="sl-num">
                {6 + (hiddenDrivers.length > 0 ? 1 : 0) + (suggestedActions.length > 0 ? 1 : 0)}
              </span>
              <span className="sl-title">{t("sectionTrust")}</span>
            </div>
            <div className="trust-grid">
              <div className="trust-item">
                <div className="trust-item-icon">🔒</div>
                <div className="trust-item-title">{t("trustReproducible")}</div>
                <div className="trust-item-desc">{t("trustReproducibleDesc")}</div>
              </div>
              <div className="trust-item">
                <div className="trust-item-icon">📐</div>
                <div className="trust-item-title">{t("trustStandard")}</div>
                <div className="trust-item-desc">{t("trustStandardDesc")}</div>
              </div>
              <div className="trust-item">
                <div className="trust-item-icon">⚡</div>
                <div className="trust-item-title">{t("trustBoundary")}</div>
                <div className="trust-item-desc">{t("trustBoundaryDesc")}</div>
              </div>
            </div>
          </section>
        </div>

        <div className="watermark">SC</div>

        <div className="footer">
          <div className="footer-left">
            SectorCalc &nbsp;|&nbsp; sectorcalc.com &nbsp;|&nbsp; info@sectorcalc.com<br />
            {t("footerLegal")}
          </div>
          <div className="footer-divider" />
          <div className="footer-right">
            <div className="page-num">02 / 02</div>
            <div>© {now.getFullYear()} SectorCalc</div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── STYLES ────────────────────────────────────────────────────────── */
const printBtnStyle: React.CSSProperties = {
  position: "fixed",
  bottom: 24,
  right: 24,
  background: "linear-gradient(135deg, #C9A84C 0%, #E8C86A 100%)",
  color: "#0B1628",
  border: "none",
  borderRadius: 8,
  padding: "12px 20px",
  fontSize: 12,
  fontWeight: 700,
  cursor: "pointer",
  fontFamily: "Inter, sans-serif",
  letterSpacing: "0.04em",
  boxShadow: "0 4px 20px rgba(201,168,76,0.4)",
  zIndex: 1000,
};

const INDUSTRIAL_PRINT_CSS = `
  :root {
    --navy:    #0B1628;
    --navy2:   #112240;
    --gold:    #C9A84C;
    --gold2:   #E8C86A;
    --slate:   #1E2D45;
    --ice:     #EEF3FA;
    --muted:   #8899B2;
    --white:   #FFFFFF;
    --green:   #22C55E;
    --amber:   #F59E0B;
    --red:     #EF4444;
    --blue:    #3B82F6;
    --border:  rgba(201,168,76,0.25);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  @page { size: A4; margin: 0; }
  @media print {
    body {
      background: var(--navy) !important;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .page {
      page-break-after: always;
      box-shadow: none !important;
    }
    .page:last-child { page-break-after: avoid; }
    .no-print { display: none !important; }
    header, nav, footer:not(.footer), .sc-site-header { display: none !important; }
  }

  @media screen {
    body { background: var(--navy); }
  }

  .page {
    width: 210mm;
    min-height: 297mm;
    margin: 0 auto 32px;
    background: var(--navy);
    position: relative;
    display: flex;
    flex-direction: column;
    box-shadow: 0 24px 80px rgba(0,0,0,0.6);
    overflow: hidden;
    color: var(--white);
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 13px;
    line-height: 1.5;
  }

  .accent-top { height: 3px; background: linear-gradient(90deg, var(--gold) 0%, var(--gold2) 60%, transparent 100%); width: 100%; flex-shrink: 0; }
  .accent-top-thin { height: 1px; background: linear-gradient(90deg, var(--gold) 0%, rgba(201,168,76,0.3) 80%, transparent 100%); width: 100%; flex-shrink: 0; }

  .header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 18px 28px 14px; background: var(--navy2);
    border-bottom: 1px solid var(--border); flex-shrink: 0;
  }
  .logo-area { display: flex; align-items: center; gap: 10px; }
  .logo-mark {
    width: 32px; height: 32px;
    background: linear-gradient(135deg, var(--gold) 0%, var(--gold2) 100%);
    border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: 14px; color: var(--navy);
  }
  .logo-text { font-size: 15px; font-weight: 700; letter-spacing: 0.04em; color: var(--white); }
  .logo-sub { font-size: 10px; color: var(--muted); letter-spacing: 0.06em; text-transform: uppercase; margin-top: 1px; }
  .header-meta { text-align: right; }
  .header-meta .doc-type { font-size: 9px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--gold); font-weight: 600; margin-bottom: 2px; }
  .header-meta .doc-id { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--muted); }

  .cover-hero {
    padding: 48px 28px 36px;
    background: linear-gradient(160deg, var(--navy2) 0%, var(--navy) 60%);
    position: relative; overflow: hidden;
  }
  .cover-hero::before {
    content: ''; position: absolute; top: -40px; right: -40px;
    width: 280px; height: 280px; border-radius: 50%;
    background: radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%);
  }
  .cover-hero::after {
    content: ''; position: absolute; bottom: 0; left: 0; right: 0;
    height: 1px; background: linear-gradient(90deg, var(--gold) 0%, rgba(201,168,76,0.1) 100%);
  }

  .tool-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(201,168,76,0.12); border: 1px solid var(--border);
    border-radius: 4px; padding: 4px 10px; font-size: 9px;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--gold); font-weight: 600; margin-bottom: 20px;
  }
  .tool-badge::before { content: '\\25B8'; font-size: 8px; }

  .report-title { font-size: 22px; font-weight: 700; line-height: 1.2; color: var(--white); max-width: 420px; margin-bottom: 8px; }
  .report-subtitle { font-size: 11px; color: var(--muted); max-width: 380px; line-height: 1.6; margin-bottom: 32px; }

  .primary-result-card {
    display: inline-flex; align-items: stretch;
    background: var(--slate); border: 1px solid var(--border);
    border-radius: 8px; overflow: hidden; margin-bottom: 0;
  }
  .prc-accent { width: 4px; background: linear-gradient(180deg, var(--gold) 0%, var(--gold2) 100%); }
  .prc-content { padding: 16px 20px; }
  .prc-label { font-size: 9px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); margin-bottom: 4px; font-weight: 600; }
  .prc-value { font-size: 32px; font-weight: 700; color: var(--gold2); line-height: 1; font-family: 'JetBrains Mono', monospace; margin-bottom: 4px; }
  .prc-desc { font-size: 10px; color: var(--muted); }

  .meta-grid {
    display: grid; grid-template-columns: 1fr 1fr 1fr;
    gap: 0; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
  }
  .meta-item { padding: 14px 28px; border-right: 1px solid var(--border); }
  .meta-item:last-child { border-right: none; }
  .meta-key { font-size: 9px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted); margin-bottom: 3px; font-weight: 600; }
  .meta-val { font-size: 12px; color: var(--white); font-weight: 500; }
  .tt-mono { font-family: 'JetBrains Mono', monospace; font-size: 10px; }

  .content { flex: 1; padding: 24px 28px; display: flex; flex-direction: column; gap: 20px; }

  .section-label { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
  .section-label .sl-num { font-size: 9px; font-family: 'JetBrains Mono', monospace; color: var(--gold); font-weight: 600; letter-spacing: 0.05em; }
  .section-label .sl-title { font-size: 10px; text-transform: uppercase; letter-spacing: 0.12em; color: var(--muted); font-weight: 600; }
  .section-label::after { content: ''; flex: 1; height: 1px; background: var(--border); }

  .param-table { width: 100%; border-collapse: collapse; background: var(--slate); border-radius: 6px; overflow: hidden; border: 1px solid var(--border); }
  .param-table thead tr { background: rgba(201,168,76,0.08); }
  .param-table th { padding: 8px 12px; text-align: left; font-size: 9px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--gold); font-weight: 600; border-bottom: 1px solid var(--border); }
  .param-table td { padding: 8px 12px; font-size: 11px; border-bottom: 1px solid rgba(201,168,76,0.08); color: var(--white); vertical-align: middle; }
  .param-table tr:last-child td { border-bottom: none; }
  .param-table td.val { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--gold2); font-weight: 600; }
  .param-table td.unit { font-size: 10px; color: var(--muted); font-family: 'JetBrains Mono', monospace; }
  .param-table td.ref { font-size: 9px; color: var(--muted); }

  .badge { display: inline-flex; align-items: center; gap: 4px; border-radius: 3px; padding: 2px 7px; font-size: 9px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; }
  .badge.green  { background: rgba(34,197,94,0.15); color: var(--green); border: 1px solid rgba(34,197,94,0.3); }
  .badge.amber  { background: rgba(245,158,11,0.15); color: var(--amber); border: 1px solid rgba(245,158,11,0.3); }
  .badge.red    { background: rgba(239,68,68,0.15); color: var(--red); border: 1px solid rgba(239,68,68,0.3); }
  .badge.blue   { background: rgba(59,130,246,0.15); color: var(--blue); border: 1px solid rgba(59,130,246,0.3); }
  .badge.gold   { background: rgba(201,168,76,0.15); color: var(--gold2); border: 1px solid var(--border); }

  .results-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .result-card {
    background: var(--slate); border: 1px solid var(--border); border-radius: 6px;
    padding: 14px 16px; position: relative; overflow: hidden;
  }
  .result-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: var(--gold); opacity: 0.3;
  }
  .result-card.highlight::before { opacity: 1; }
  .rc-label { font-size: 9px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted); margin-bottom: 6px; font-weight: 600; }
  .rc-value { font-size: 20px; font-weight: 700; font-family: 'JetBrains Mono', monospace; color: var(--gold2); margin-bottom: 4px; line-height: 1; }
  .rc-sub { font-size: 10px; color: var(--muted); }

  .callout { display: flex; gap: 12px; border-radius: 6px; padding: 14px 16px; border-left: 3px solid; align-items: flex-start; }
  .callout.warning { background: rgba(245,158,11,0.06); border-color: var(--amber); }
  .callout.info { background: rgba(59,130,246,0.06); border-color: var(--blue); }
  .callout.danger { background: rgba(239,68,68,0.06); border-color: var(--red); }
  .callout.success { background: rgba(34,197,94,0.06); border-color: var(--green); }
  .callout-icon { font-size: 14px; flex-shrink: 0; margin-top: 1px; }
  .callout-title { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 3px; }
  .callout.warning .callout-title { color: var(--amber); }
  .callout.info .callout-title { color: var(--blue); }
  .callout.danger .callout-title { color: var(--red); }
  .callout.success .callout-title { color: var(--green); }
  .callout-body { font-size: 11px; color: var(--muted); line-height: 1.6; }
  .callout-body strong { color: var(--white); }

  .gauge-section { display: flex; align-items: center; gap: 24px; }
  .gauge-wrap { position: relative; width: 100px; height: 60px; flex-shrink: 0; }
  .gauge-svg { width: 100px; height: 60px; }
  .gauge-score-text {
    position: absolute; bottom: 0; left: 0; right: 0; text-align: center;
    font-family: 'JetBrains Mono', monospace; font-size: 16px; font-weight: 700; color: var(--amber);
  }
  .gauge-labels { display: flex; flex-direction: column; gap: 5px; flex: 1; }
  .gauge-row { display: flex; align-items: center; gap: 8px; font-size: 10px; }
  .gauge-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
  .gauge-row-label { color: var(--muted); flex: 1; }
  .gauge-row-val { color: var(--white); font-weight: 600; font-family: 'JetBrains Mono', monospace; font-size: 10px; }

  .gauge-card, .confidence-card { background: var(--slate); border: 1px solid var(--border); border-radius: 6px; padding: 16px; }
  .gc-title { font-size: 9px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted); font-weight: 600; margin-bottom: 12px; }
  .conf-rows { display: flex; flex-direction: column; gap: 7px; }
  .conf-row { display: flex; justify-content: space-between; align-items: center; font-size: 10px; }
  .conf-label { color: var(--muted); }

  .formula-box {
    background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 6px;
    padding: 12px 16px; font-family: 'JetBrains Mono', monospace; font-size: 11px;
    color: var(--gold2); text-align: center; line-height: 1.8;
  }
  .formula-box .f-desc { font-size: 9px; color: var(--muted); font-family: 'Inter', sans-serif; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.08em; }

  .steps-list {
    display: flex; flex-direction: column; gap: 0;
    background: var(--slate); border: 1px solid var(--border); border-radius: 6px; overflow: hidden;
  }
  .step-item {
    display: flex; align-items: flex-start; gap: 12px;
    padding: 11px 14px; border-bottom: 1px solid rgba(201,168,76,0.08);
  }
  .step-item:last-child { border-bottom: none; }
  .step-num {
    width: 20px; height: 20px; border-radius: 50%;
    background: rgba(201,168,76,0.15); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    font-size: 9px; font-weight: 700; color: var(--gold); flex-shrink: 0;
    font-family: 'JetBrains Mono', monospace;
  }
  .step-content .step-title { font-size: 11px; font-weight: 600; color: var(--white); margin-bottom: 2px; }
  .step-content .step-desc { font-size: 10px; color: var(--muted); line-height: 1.5; }

  .footer {
    padding: 10px 28px; background: var(--navy2);
    border-top: 1px solid var(--border);
    display: flex; justify-content: space-between; align-items: center; flex-shrink: 0;
  }
  .footer-left { font-size: 8px; color: var(--muted); line-height: 1.5; }
  .footer-right { font-size: 8px; color: var(--muted); text-align: right; font-family: 'JetBrains Mono', monospace; }
  .footer-divider { width: 1px; height: 24px; background: var(--border); margin: 0 16px; }
  .page-num { font-size: 9px; color: var(--gold); font-family: 'JetBrains Mono', monospace; font-weight: 600; }

  .trust-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
  .trust-item { background: var(--slate); border: 1px solid var(--border); border-radius: 6px; padding: 12px 14px; }
  .trust-item-icon { font-size: 16px; margin-bottom: 6px; }
  .trust-item-title { font-size: 10px; font-weight: 600; color: var(--white); margin-bottom: 2px; }
  .trust-item-desc { font-size: 9px; color: var(--muted); line-height: 1.5; }

  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

  .watermark {
    position: absolute; bottom: 60px; right: 20px;
    font-size: 72px; font-weight: 900;
    color: rgba(201,168,76,0.04); letter-spacing: -4px;
    pointer-events: none; user-select: none; z-index: 0;
    font-family: 'Inter', sans-serif;
  }

  .iso-tag {
    display: inline-flex; align-items: center; gap: 4px;
    background: rgba(59,130,246,0.1); border: 1px solid rgba(59,130,246,0.25);
    border-radius: 3px; padding: 2px 6px; font-size: 8px; color: var(--blue);
    font-weight: 600; letter-spacing: 0.06em; font-family: 'JetBrains Mono', monospace;
  }
`;
