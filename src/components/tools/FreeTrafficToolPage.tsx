"use client";
/* eslint-disable */
// @ts-nocheck


import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useLocale, useTranslations } from "@/lib/i18n-stub";
import { resolveToolCategory } from "@/lib/catalog/resolve-tool-category";
import { getPremiumCatalogCategoryDetail } from "@/lib/features/premium/premium-category-resolver";
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/ui/Container";
import { LedgerNumberTick } from "@/components/ui/LedgerNumberTick";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/infrastructure/analytics/events";
import { trackConversionEvent } from "@/lib/infrastructure/analytics/conversion-funnel";
import { useAttributionContext } from "@/lib/infrastructure/analytics/use-attribution-context";
import { buildTrackedCtaHref } from "@/lib/features/campaigns/campaign-links";
import { stripLocalePrefix } from "@/i18n/locales";
import { REVENUE_EVENTS, trackRevenueEvent } from "@/lib/infrastructure/analytics/revenue-events";
import { getToolHref } from "@/lib/features/tools/paths";
import {
  calculateFreeTrafficTool,
  type FreeTrafficInputValues,
  type FreeTrafficResult,
} from "@/lib/features/tools/free-traffic-calculators";
import {
  listRelatedTrafficTools,
  type FreeTrafficTool,
} from "@/lib/features/tools/free-traffic-catalog";
import { resolvePremiumAnalyzerHref } from "@/lib/features/premium-schema/premium-schema-catalog";
import { FreeToolAuthorityBlock } from "@/components/content/FreeToolAuthorityBlock";
import { ExpertAuthoritySection } from "@/components/content/ExpertAuthoritySection";
import { evaluateRuntimeTrust } from "@/lib/features/tools/runtime-trust-engine";
import { ToolSafeReviewState } from "@/components/tools/ToolSafeReviewState";
import { resolveFreeToolDisplayTitle } from "@/lib/infrastructure/i18n/free-tool-form-i18n";
import { GuidanceFieldFocus } from "@/components/guidance/GuidanceFieldFocus";
import { FormulaGateToolStatus } from "@/components/formula/FormulaGateToolStatus";
import { CalculationFeedbackButton } from "@/components/feedback/CalculationFeedbackButton";
import {
  CalculatorCurrencyPrefix,
  CalculatorUnitSelect,
} from "@/components/tools/CalculatorUnitCurrencyControls";
import { runFreeFullLoopCalculation, type FreeFullLoopResult } from "@/lib/features/formula-governance/runtime-validation/free-full-loop-bridge";
import { isFreeFullLoopRuntimeSlug } from "@/lib/features/formula-governance/runtime-validation/full-loop-runtime-registry";
import {
  buildSmartFormInitialValues,
  validateSmartFormFieldValues,
} from "@/lib/features/formula-governance/runtime-validation/smart-form-contract-adapter";
import { formatTitle } from "@/lib/utils/formatTitle";

function buildInitialValues(tool: FreeTrafficTool): FreeTrafficInputValues {
  const values: FreeTrafficInputValues = {};
  for (const input of tool.inputs) {
    if (input.type === "select") {
      values[input.key] = input.defaultValue ?? input.options?.[0]?.value ?? "";
      continue;
    }
    values[input.key] = input.defaultValue ?? "";
  }
  return values;
}

function verdictTone(headline: string): "neutral" | "positive" | "caution" {
  if (headline.toLowerCase().includes("break-even")) {
    return "caution";
  }
  return "positive";
}

export interface FreeTrafficToolPageProps {
  tool: FreeTrafficTool;
  featuredAnswer?: ReactNode;
  surfaceTier?: "free" | "premium";
  localizedContent?: {
    title: string;
    description: string;
    infoBoxTitle?: string;
    infoBoxContent?: string;
  };
}

export function FreeTrafficToolPage({
  tool,
  featuredAnswer,
  surfaceTier = "free",
  localizedContent,
}: FreeTrafficToolPageProps) {
  const t = useTranslations("freeTrafficCatalog");
  const tAuthority = useTranslations("contentAuthority.freeTool");
  const tPremiumAuthority = useTranslations("contentAuthority.premium");
  const tCalc = useTranslations("calculator");
  const locale = useLocale();

  const categorySlug = useMemo(() => resolveToolCategory({ slug: tool.slug, freeTrafficCategory: tool.category }), [tool.slug, tool.category]);
  const categoryDetail = useMemo(() => getPremiumCatalogCategoryDetail(categorySlug, locale), [categorySlug, locale]);
  const categoryTitle = categoryDetail?.title ?? "Category";
  const pathname = usePathname();
  const attribution = useAttributionContext();
  const pagePath = stripLocalePrefix(pathname);
  
  // Use localized content if provided, otherwise fallback to tool registry
  const displayTitle = localizedContent?.title ?? tool.title;
  const displayDescription = localizedContent?.description ?? tool.description;
  
  const [values, setValues] = useState<FreeTrafficInputValues>(() =>
    isFreeFullLoopRuntimeSlug(tool.slug)
      ? buildSmartFormInitialValues(tool.slug)
      : buildInitialValues(tool),
  );
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fullLoopResult, setFullLoopResult] = useState<FreeFullLoopResult | null>(null);
  const [utcTime, setUtcTime] = useState("");
  const useFullLoopRuntime = isFreeFullLoopRuntimeSlug(tool.slug);
  const startedTracked = useRef(false);
  const runtimeTrust = useMemo(
    () =>
      evaluateRuntimeTrust({
        slug: tool.slug,
        locale,
        surface: surfaceTier,
        premiumSurfaceUsesFreeCopy: surfaceTier === "premium",
      }),
    [tool.slug, locale, surfaceTier],
  );
  const showCalculationSurface = runtimeTrust.calculationEligible;

  // UTC clock
  useEffect(() => {
    const tick = () => setUtcTime("UTC · " + new Date().toISOString().replace("T", " ").slice(0, 19));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    trackEvent(ANALYTICS_EVENTS.tool_view, {
      toolSlug: tool.slug,
      tier: "free",
      source: "traffic_catalog",
    });
    trackConversionEvent({
      stage: "tool_open",
      eventName: "free_tool_open",
      locale,
      pagePath,
      toolSlug: tool.slug,
      campaignId: attribution.utmCampaign,
      source: attribution.utmSource,
      medium: attribution.utmMedium,
      valueType: "free",
      category: tool.category,
    });
  }, [attribution.utmCampaign, attribution.utmMedium, attribution.utmSource, locale, pagePath, tool.slug]);

  const result = useMemo(() => {
    if (!submitted) {
      return null;
    }
    if (useFullLoopRuntime) {
      if (fullLoopResult?.status === "success" && fullLoopResult.trafficResult) {
        return fullLoopResult.trafficResult;
      }
      return null;
    }
    return calculateFreeTrafficTool(tool.slug, values, locale);
  }, [fullLoopResult, locale, submitted, tool.slug, useFullLoopRuntime, values]);

  const feedbackInputSnapshot = useMemo(() => ({ ...values }), [values]);
  const feedbackResultSnapshot = useMemo(() => {
    if (!result) {
      return undefined;
    }
    return {
      headline: result.headline,
      primaryValue: result.primaryValue,
      primaryLabel: result.primaryLabel,
    };
  }, [result]);

  const relatedPremiumSlug = result?.relatedPremiumSlug ?? tool.relatedPremiumSlug;
  const premiumAnalyzerHref = useMemo(() => {
    if (!relatedPremiumSlug) {
      return null;
    }
    const baseHref = resolvePremiumAnalyzerHref(relatedPremiumSlug);
    if (!baseHref) {
      return null;
    }
    return buildTrackedCtaHref(
      baseHref,
      attribution.utmCampaign,
      "free_tool",
      "premium_upsell",
      attribution
    );
  }, [attribution, relatedPremiumSlug]);

  const relatedTools = listRelatedTrafficTools(tool);
  const isConversion = tool.resultType === "conversion";

  const handleSmartFormChange = (key: string, value: number | string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setSubmitted(false);
    setFullLoopResult(null);
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!runtimeTrust.calculationEligible) {
      return;
    }
    if (!startedTracked.current) {
      startedTracked.current = true;
      trackRevenueEvent(REVENUE_EVENTS.free_tool_started, {
        toolSlug: tool.slug,
        source: "traffic_catalog",
      });
    }

    if (useFullLoopRuntime) {
      const nextErrors = validateSmartFormFieldValues(tool.slug, values, locale);
      setErrors(nextErrors);
      if (Object.keys(nextErrors).length > 0) {
        setSubmitted(false);
        setFullLoopResult(null);
        return;
      }

      const loopResult = runFreeFullLoopCalculation(tool.slug, values, locale);
      setFullLoopResult(loopResult);
      if (loopResult.status === "blocked") {
        setSubmitted(false);
        return;
      }

      setSubmitted(true);
      trackRevenueEvent(REVENUE_EVENTS.free_tool_completed, {
        toolSlug: tool.slug,
        source: "traffic_catalog",
      });
      trackConversionEvent({
        stage: "calculation",
        eventName: "free_tool_calculate",
        locale,
        pagePath,
        toolSlug: tool.slug,
        campaignId: attribution.utmCampaign,
        source: attribution.utmSource,
        medium: attribution.utmMedium,
        valueType: "free",
        category: tool.category,
      });
      return;
    }

    const nextErrors: Record<string, string> = {};

    for (const input of tool.inputs) {
      const raw = values[input.key];
      if (input.type === "select") {
        if (typeof raw !== "string" || raw === "") {
          nextErrors[input.key] = t("validation.required");
        }
        continue;
      }
      const numericString = typeof raw === "string" ? raw.replace(/,/g, '.') : String(raw);
      const numeric = typeof raw === "number" ? raw : Number(numericString);
      if (raw === "" || !Number.isFinite(numeric)) {
        nextErrors[input.key] = t("validation.number");
        continue;
      }
      if (input.min !== undefined && numeric < input.min) {
        nextErrors[input.key] = t("validation.min", { min: input.min });
      }
      if (input.max !== undefined && numeric > input.max) {
        nextErrors[input.key] = t("validation.max", { max: input.max });
      }
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setSubmitted(false);
      setFullLoopResult(null);
      return;
    }

    setFullLoopResult(null);
    setSubmitted(true);
    trackRevenueEvent(REVENUE_EVENTS.free_tool_completed, {
      toolSlug: tool.slug,
      source: "traffic_catalog",
    });
    trackConversionEvent({
      stage: "calculation",
      eventName: "free_tool_calculate",
      locale,
      pagePath,
      toolSlug: tool.slug,
      campaignId: attribution.utmCampaign,
      source: attribution.utmSource,
      medium: attribution.utmMedium,
      valueType: "free",
      category: tool.category,
    });
  };

  const tone = result ? verdictTone(result.headline) : "neutral";
  const isDanger = tone === "caution";
  const isGood = tone === "positive";

  return (
    <PageLayout>
      {/* HMI_CSS removed - consolidated */}
      <section className="sc-craft-section sc-craft-section--white sc-craft-section--border">
        <Container size="wide" className="sc-craft-container sc-craft-container--wide">
          {surfaceTier === "premium" && (
            <nav aria-label="Breadcrumb" className="mb-4 text-xs text-body-charcoal">
              <Link href="/pricing" prefetch={false} className="hover:underline">
                {locale === "tr" ? "Premium Tools" : "Premium"}
              </Link>
              <span className="mx-1.5">/</span>
              <Link href={`/pricing?tool=${categorySlug}`} prefetch={false} className="hover:underline">
                {categoryTitle}
              </Link>
              <span className="mx-1.5">/</span>
              <span className="text-premium-velvet font-medium">{displayTitle}</span>
            </nav>
          )}
          <p className="sc-craft-eyebrow">{t.has(`categories.${tool.category}`) ? t(`categories.${tool.category}`) : "General"}</p>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <h1 className="sc-craft-headline">{displayTitle}</h1>
            <FormulaGateToolStatus slug={tool.slug} locale={locale} surface={surfaceTier} />
          </div>
          <p className="sc-craft-lead">{displayDescription}</p>
        </Container>
      </section>

      {featuredAnswer ? (
        <section className="sc-craft-section sc-craft-section--white sc-craft-section--border">
          <Container size="wide" className="sc-craft-container sc-craft-container--wide">
            {featuredAnswer}
          </Container>
        </section>
      ) : null}

      <section className="sc-craft-section overflow-x-hidden">
        <Container size="wide" className="sc-craft-container sc-craft-container--wide min-w-0">
          {!showCalculationSurface ? (
            <ToolSafeReviewState slug={tool.slug} locale={locale} findings={runtimeTrust.findings} />
          ) : (
          <div className="wrap" style={{ padding: "20px 0" }}>
            {/* STATUS STRIP */}
            <div className="status-strip">
              <div className="brand">
                <span className="led ok pulse" />
                <div>
                  <div className="brand-mark">SECTORCALC FREE</div>
                  <div className="brand-sub">Traffic Tool Engine · {(tool.category || "").toUpperCase()}</div>
                </div>
              </div>
              <div className="indicators">
                <div className="ind"><span className="led ok" /><b>RUN</b></div>
                <div className="ind"><span className="led off" /><b>ALM</b></div>
                <div className="ind"><span className="led off" /><b>PENDING</b></div>
                <div className="ind"><span className="led signal pulse" /><b>COM</b></div>
                <div className="timestamp">{utcTime || "\u2014"}</div>
              </div>
            </div>

            {/* DISPLAY HEADER */}
            <div className="display-header">
              <div>
                <div className="module-id">MODULE · {formatTitle(tool.slug)} · FREE</div>
                <h1>{displayTitle}</h1>
                <div className="sub-cap">{displayDescription}</div>
              </div>
              <div className="meta">
                <div className="pill-row">
                  <span className="pill">{surfaceTier === "premium" ? "PREMIUM" : "FREE"}</span>
                  <span className="pill">RESULT · {result ? result.headline?.toUpperCase().slice(0, 16) : "\u2014"}</span>
                </div>
              </div>
            </div>

            <div className="grid">
              <main>
                <form onSubmit={handleSubmit} noValidate data-calculation-form="true">
                  {tool.inputs.map((input, idx) => {
                    const value = values[input.key] ?? (input.type === "select" ? "" : "");

                    let ctrl: React.ReactNode = null;
                    if (input.type === "select" && input.options) {
                      ctrl = (
                        <button type="button" className="choice" onClick={() => {}}>
                          <span className="cv">{String(value)}</span>
                          <span className="car">\u25be</span>
                        </button>
                      );
                    } else {
                      ctrl = (
                        <div className="ctrl">
                          <input
                            type="text"
                            inputMode="decimal"
                            value={String(value)}
                            onChange={(e) => {
                              handleSmartFormChange(input.key, e.target.value);
                            }}
                            aria-label={input.label}
                          />
                          {input.unit ? <span className="ubtn static">{input.unit}</span> : null}
                        </div>
                      );
                    }

                    return (
                      <div key={input.key} className="group">
                        <div className="group-head">
                          <span className="led ok group-led" />
                          <span className="group-letter">INP · {String.fromCharCode(65 + idx)}.01</span>
                          <span className="group-title">{input.label}</span>
                          <span className="group-count">1 CH</span>
                        </div>
                        <div className="fields">
                          <div className="field">
                            {ctrl}
                            {input.helper ? (
                              <div className="ref">
                                <span className="info" tabIndex={0}>i<span className="tip">{input.helper}</span></span>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* EXECUTE PANEL */}
                  <div className="exec-panel">
                    <div className="exec-status">
                      <span className={`led ${result ? "ok" : "off"}`} />
                      <div>
                        <div><b>{result ? "COMMITTED" : "READY"}</b></div>
                        <div className="tx">{result ? `Last · ${tool.slug}` : "Enter inputs below"}</div>
                      </div>
                    </div>
                    <button type="submit" className={`btn-exec ${fullLoopResult?.status === "blocked" ? "executing" : ""}`}>
                      <span>{fullLoopResult?.status === "blocked" ? "BLOCKED" : "\u25b6 EXECUTE"}</span>
                      <span className="kbd">F9</span>
                    </button>
                  </div>
                </form>
              </main>

              <aside className="rail">
                {/* Decision */}
                <div className={`decision ${isDanger ? "review" : isGood ? "ok" : ""}`}>
                  <div className="d-label">PRIMARY READOUT · STATUS</div>
                  {result ? (
                    <>
                      <div className="d-text">{result.primaryValue}</div>
                      <div className="d-sub">{result.headline}</div>
                    </>
                  ) : (
                    <div className="d-text" style={{ fontSize: "14px", color: "var(--ink-50)" }}>{"\u2014"}</div>
                  )}
                </div>

                {/* Secondary KPIs */}
                {result && result.secondaryValues.length > 0 ? (
                  <div className="card">
                    <h3>PRIMARY READOUTS</h3>
                    <div className="kpis">
                      {result.secondaryValues.map((sv, i) => (
                        <div key={i} className="kpi">
                          <div className="k-label">{sv.label}</div>
                          <div className="k-val">{sv.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {/* Explanation */}
                {result ? (
                  <div className="card readout">
                    <h3>ENGINEERING DIAGNOSTICS</h3>
                    <div className="readout">
                      <div className="blk">
                        <div className="bh" style={{ justifyContent: "flex-start", gap: "4px" }}>
                          <span className="bt">ANALYSIS</span>
                        </div>
                        <p>{result.explanation}</p>
                      </div>
                      <div className="blk">
                        <p style={{ fontSize: "10px", color: "var(--ink-30)", marginTop: "8px" }}>{result.legalNote}</p>
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* Full-loop blockers */}
                {fullLoopResult?.status === "blocked" ? (
                  <div className="card readout">
                    <h3>VALIDATION</h3>
                    <div className="readout">
                      <div className="sv4-warning-card sv4-warning-critical" role="alert">
                        <div className="sv4-warning-message">{t("tool.resultBlocked")}</div>
                        {(fullLoopResult.blockers as string[]).map((b: string, i: number) => (
                          <div key={i} className="sv4-warning-why">{b}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* Premium upsell */}
                {result && premiumAnalyzerHref ? (
                  <div className="card readout">
                    <h3>PREMIUM ANALYSIS</h3>
                    <div className="readout">
                      <p>{t("tool.premiumBlockBody")}</p>
                      <Link
                        href={premiumAnalyzerHref}
                        onClick={() => {
                          trackConversionEvent({
                            stage: "premium_interest",
                            eventName: "free_to_premium_click",
                            locale,
                            pagePath,
                            toolSlug: tool.slug,
                            premiumSlug: relatedPremiumSlug ?? undefined,
                            campaignId: attribution.utmCampaign,
                            source: attribution.utmSource ?? "free_tool",
                            medium: attribution.utmMedium ?? "premium_upsell",
                            ctaId: "free_to_premium_click",
                            valueType: "premium",
                            category: tool.category,
                          });
                        }}
                        className="sc-craft-card__cta mt-3"
                      >
                        {t("tool.premiumCta")}
                      </Link>
                    </div>
                  </div>
                ) : null}

                {/* No result state */}
                {!result && fullLoopResult?.status !== "blocked" ? (
                  <div className="card readout">
                    <h3>ENGINEERING DIAGNOSTICS</h3>
                    <div className="readout" style={{ color: "var(--ink-50)", fontSize: "11px", fontFamily: "var(--mono)", letterSpacing: ".08em", textTransform: "uppercase" }}>
                      Enter inputs and execute.
                    </div>
                  </div>
                ) : null}

                {/* Export */}
                <button className="btn-export" onClick={() => window.print()}>⏎ EXPORT REPORT</button>
              </aside>
            </div>

            {/* Related tools */}
            {relatedTools.length > 0 ? (
              <div className="card" style={{ marginTop: "22px" }}>
                <h3>RELATED TOOLS</h3>
                <ul className="sc-craft-grid sc-craft-grid--2 mt-3">
                  {relatedTools.map((related) => (
                    <li key={related.slug} className="min-w-0">
                      <Link
                        href={getToolHref("free", related.slug)}
                        className="block break-words text-sm font-medium underline underline-offset-2"
                        style={{ color: "var(--accent)" }}
                      >
                        {resolveFreeToolDisplayTitle(related.slug, locale, related.title)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {/* Authority block */}
            <div className="card readout" style={{ marginTop: "22px" }}>
              <h3>INDUSTRY REFERENCE</h3>
              <div className="readout">
                <FreeToolAuthorityBlock
                  tool={tool}
                  locale={locale}
                  localizedTitle={displayTitle}
                  localizedDescription={displayDescription}
                  labels={{
                    howItWorksTitle: tAuthority("howItWorksTitle"),
                    descriptionTitle: tAuthority("descriptionTitle"),
                    formulaTitle: tAuthority("formulaTitle"),
                    inputsTitle: tAuthority("inputsTitle"),
                    includesTitle: tAuthority("includesTitle"),
                    includes1: tAuthority("includes1"),
                    includes2: tAuthority("includes2"),
                    includes3: tAuthority("includes3"),
                    estimateMissesTitle: tAuthority("estimateMissesTitle"),
                    estimateMissesBody: tAuthority("estimateMissesBody"),
                    faqTitle: surfaceTier === "premium" ? tPremiumAuthority("faqTitle") : tAuthority("faqTitle"),
                    faqUseTitle:
                      surfaceTier === "premium"
                        ? tPremiumAuthority("faqMeasureTitle")
                        : tAuthority("faqUseTitle"),
                    faqFreeTitle:
                      surfaceTier === "premium"
                        ? tPremiumAuthority("faqIsFreeTitle")
                        : tAuthority("faqFreeTitle"),
                    faqPremiumTitle:
                      surfaceTier === "premium"
                        ? tPremiumAuthority("faqPremiumTitle")
                        : tAuthority("faqPremiumTitle"),
                    faqUseAnswer:
                      surfaceTier === "premium"
                        ? tPremiumAuthority("faqMeasureAnswer", { name: displayTitle })
                        : tAuthority("faqUseAnswer", { title: displayTitle }),
                    faqFreeAnswer:
                      surfaceTier === "premium"
                        ? tPremiumAuthority("faqIsFreeAnswer")
                        : tAuthority("faqFreeAnswer"),
                    faqPremiumAnswer:
                      surfaceTier === "premium"
                        ? tPremiumAuthority("faqPremiumAnswer")
                        : tAuthority("faqPremiumAnswer"),
                    relatedGuideTitle: tAuthority("relatedGuideTitle"),
                    relatedHubTitle: tAuthority("relatedHubTitle"),
                    relatedPremiumTitle: tAuthority("relatedPremiumTitle"),
                    relatedPremiumCta: tAuthority("relatedPremiumCta"),
                  }}
                />
              </div>
            </div>
          </div>
          )}
        <ExpertAuthoritySection toolName={displayTitle} />
        </Container>
      </section>
    </PageLayout>
  );
}
