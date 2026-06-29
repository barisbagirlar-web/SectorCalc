"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { resolveToolCategory } from "@/lib/catalog/resolve-tool-category";
import { getPremiumCatalogCategoryDetail } from "@/lib/premium/premium-category-resolver";
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/ui/Container";
import { LedgerNumberTick } from "@/components/ui/LedgerNumberTick";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics/events";
import { trackConversionEvent } from "@/lib/analytics/conversion-funnel";
import { useAttributionContext } from "@/lib/analytics/use-attribution-context";
import { buildTrackedCtaHref } from "@/lib/campaigns/campaign-links";
import { stripLocalePrefix } from "@/i18n/locales";
import { REVENUE_EVENTS, trackRevenueEvent } from "@/lib/analytics/revenue-events";
import { getToolHref } from "@/lib/tools/paths";
import {
  calculateFreeTrafficTool,
  type FreeTrafficInputValues,
  type FreeTrafficResult,
} from "@/lib/tools/free-traffic-calculators";
import {
  listRelatedTrafficTools,
  type FreeTrafficTool,
} from "@/lib/tools/free-traffic-catalog";
import { resolvePremiumAnalyzerHref } from "@/lib/premium-schema/premium-schema-catalog";
import { FreeToolAuthorityBlock } from "@/components/content/FreeToolAuthorityBlock";
import { evaluateRuntimeTrust } from "@/lib/tools/runtime-trust-engine";
import { ToolSafeReviewState } from "@/components/tools/ToolSafeReviewState";
import { resolveFreeToolDisplayTitle } from "@/lib/i18n/free-tool-form-i18n";
import { GuidanceFieldFocus } from "@/components/guidance/GuidanceFieldFocus";
import { FormulaGateToolStatus } from "@/components/formula/FormulaGateToolStatus";
import { SmartFormWorkspace } from "@/components/smart-form/SmartFormWorkspace";
import { CalculationFeedbackButton } from "@/components/feedback/CalculationFeedbackButton";
import { SmartFormValidationSummary } from "@/components/tools/smart-form/SmartFormValidationSummary";
import { SmartToolForm } from "@/components/tools/smart-form/SmartToolForm";
import { FreeToolForm } from "@/components/tools/FreeToolForm";
import type { PremiumInputDef, PremiumResultRow } from "@/components/tools/FreeToolForm";
import {
  CalculatorCurrencyPrefix,
  CalculatorUnitSelect,
} from "@/components/tools/CalculatorUnitCurrencyControls";
import { runFreeFullLoopCalculation, type FreeFullLoopResult } from "@/lib/formula-governance/runtime-validation/free-full-loop-bridge";
import { isFreeFullLoopRuntimeSlug } from "@/lib/formula-governance/runtime-validation/full-loop-runtime-registry";
import {
  buildSmartFormInitialValues,
  validateSmartFormFieldValues,
} from "@/lib/formula-governance/runtime-validation/smart-form-contract-adapter";

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

  const getPlaceholderForTrafficInput = (input: any) => {
    if (input.type === "currency") return "1,000";
    if (input.type === "percent") return "15";
    const k = input.key.toLowerCase();
    if (k.includes("year") || k.includes("month") || k.includes("day") || k.includes("period")) return "12";
    return "100";
  };

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
  const primaryClass =
    tone === "positive"
      ? "sc-result-primary sc-result-primary--safe"
      : tone === "caution"
        ? "sc-result-primary sc-result-primary--warn"
        : "sc-result-primary";

  return (
    <PageLayout>
      <section className="sc-craft-section sc-craft-section--white sc-craft-section--border">
        <Container size="wide" className="sc-craft-container sc-craft-container--wide">
          {surfaceTier === "premium" && (
            <nav aria-label="Breadcrumb" className="mb-4 text-xs text-body-charcoal">
              <Link href="/pricing" prefetch={false} className="hover:underline">
                {"Premium"}
              </Link>
              <span className="mx-1.5">/</span>
              <Link href={`/pricing?tool=${categorySlug}`} prefetch={false} className="hover:underline">
                {categoryTitle}
              </Link>
              <span className="mx-1.5">/</span>
              <span className="text-premium-velvet font-medium">{displayTitle}</span>
            </nav>
          )}
          <p className="sc-craft-eyebrow">{t(`categories.${tool.category}`)}</p>
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
          ) : useFullLoopRuntime ? (
          <>
          <div className="sc-ledger-cetele sc-ledger-cetele--stacked sc-tool-workspace sc-tool-workspace--stacked">
            <SmartFormWorkspace
              toolSlug={tool.slug}
              tier="free"
              title={displayTitle}
              description={displayDescription}
              toolCategory={tool.category}
              inputConfig={{ kind: "traffic", inputs: tool.inputs }}
              values={values}
              errors={errors}
              onChange={handleSmartFormChange}
              onSubmit={handleSubmit}
              calculateLabel={t("tool.calculate")}
              forceFallback={true}
              nativeContractForm={false}
              formFallback={
                  <SmartToolForm
                    slug={tool.slug}
                    values={values}
                    errors={errors}
                    onChange={handleSmartFormChange}
                    onSubmit={handleSubmit}
                    calculateLabel={t("tool.calculate")}
                    blocked={fullLoopResult?.status === "blocked"}
                    blockers={fullLoopResult?.status === "blocked" ? fullLoopResult.blockers : []}
                    inputIdPrefix={`ft-${tool.slug}`}
                  />
              }
              resultPanel={
            <div className="min-w-0 space-y-4" aria-live="polite">
              {useFullLoopRuntime && fullLoopResult?.status === "blocked" ? (
                <SmartFormValidationSummary
                  title={t("tool.resultBlocked")}
                  blockers={fullLoopResult.blockers}
                />
              ) : null}
              {result ? (
                <>
                  <div className="sc-ledger-result sc-result-panel sc-ledger-letterpress">
                    <p className="sc-ledger-eyebrow">{result.headline}</p>
                    <p className="mt-1 text-xs text-body-charcoal">{result.primaryLabel}</p>
                    <LedgerNumberTick value={result.primaryValue} className={primaryClass} />
                    {result.secondaryValues.length > 0 ? (
                      <dl
                        className={`sc-result-secondary-grid${isConversion ? " sc-result-secondary-grid--3" : ""}`}
                      >
                        {result.secondaryValues.map((row) => (
                          <div key={row.label}>
                            <dt>{row.label}</dt>
                            <dd>{row.value}</dd>
                          </div>
                        ))}
                      </dl>
                    ) : null}
                    <p className="mt-3 text-sm leading-relaxed text-body-charcoal">
                      {result.explanation}
                    </p>
                  </div>

                  <div className="grid min-w-0 gap-3 sm:grid-cols-2">
                    <div className="sc-industrial-panel p-4">
                      <h2 className="sc-premium-report-section__title">{t("tool.includesTitle")}</h2>
                      <ul className="mt-2 space-y-1.5 text-sm text-body-charcoal">
                        <li>{t("tool.includes1")}</li>
                        <li>{t("tool.includes2")}</li>
                        <li>{t("tool.includes3")}</li>
                      </ul>
                    </div>
                    <div className="sc-industrial-panel p-4">
                      <h2 className="sc-premium-report-section__title">{t("tool.excludesTitle")}</h2>
                      <ul className="mt-2 space-y-1.5 text-sm text-body-charcoal">
                        <li>{t("tool.excludes1")}</li>
                        <li>{t("tool.excludes2")}</li>
                        <li>{t("tool.excludes3")}</li>
                        <li>{t("tool.excludes4")}</li>
                      </ul>
                    </div>
                  </div>

                  {premiumAnalyzerHref ? (
                    <div className="sc-decision-block">
                      <p className="sc-decision-block__title">{t("tool.premiumBlockTitle")}</p>
                      <p className="mt-2 text-sm text-body-charcoal">{t("tool.premiumBlockBody")}</p>
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
                      <p className="mt-3 text-xs leading-relaxed text-body-charcoal">
                        {t("tool.premiumBlockNote")}
                      </p>
                    </div>
                  ) : null}

                  <p className="text-xs leading-relaxed text-body-charcoal">{result.legalNote}</p>
                </>
              ) : (
                <p className="text-sm text-body-charcoal">{t("tool.awaiting")}</p>
              )}
            </div>
              }
              hasCalculated={submitted && result !== null}
              resultSummary={result ? {
                primaryLabel: result.primaryLabel,
                primaryValue: result.primaryValue,
                secondaryMetrics: result.secondaryValues.map((sv, i) => ({
                  id: `sv-${i}`,
                  label: sv.label,
                  value: sv.value,
                })),
                actionRecommendation: result.explanation,
              } : null}
              trustTraceSlot={undefined}
            />
          </div>

          {relatedTools.length > 0 ? (
            <div className="sc-industrial-panel mt-4 p-4">
              <h2 className="sc-premium-report-section__title">{t("tool.relatedTitle")}</h2>
              <ul className="sc-craft-grid sc-craft-grid--2 mt-3">
                {relatedTools.map((related) => (
                  <li key={related.slug} className="min-w-0">
                    <Link
                      href={getToolHref("free", related.slug)}
                      className="block break-words text-sm font-medium text-premium-velvet underline underline-offset-2 hover:text-[#E65100]"
                    >
                      {resolveFreeToolDisplayTitle(related.slug, locale, related.title)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <CalculationFeedbackButton
            toolSlug={tool.slug}
            toolType={surfaceTier === "premium" ? "premium" : "free"}
            locale={locale}
            routePath={pagePath}
            inputSnapshot={feedbackInputSnapshot}
            resultSnapshot={feedbackResultSnapshot}
          />

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
          </>
          ) : (
          <>
          <FreeToolForm
            title={displayTitle}
            category={t(`categories.${tool.category}`)}
            inputs={tool.inputs.map(i => ({
              key: i.key,
              label: i.label,
              unit: i.unit,
              type: i.type,
              required: true,
              min: i.min,
              max: i.max,
              step: i.step,
              hint: i.helper,
            } as PremiumInputDef))}
            values={values}
            errors={errors}
            onChange={handleSmartFormChange}
            calculateEngine={(vals) => {
             const inputValues = vals as unknown as FreeTrafficInputValues;
             let calcResult: FreeTrafficResult;
             try {
              calcResult = calculateFreeTrafficTool(tool.slug, inputValues, locale);
             } catch (e) {
              return {
               resultRows: [],
               resultWarnings: [{ severity: "CRITICAL", source: "Calculation", message: "Calculation error: " + String(e) }],
              };
             }
             const resultRows: PremiumResultRow[] = [
              { label: calcResult.primaryLabel, value: calcResult.primaryValue, unit: "", highlight: true },
              ...calcResult.secondaryValues.map(sv => ({
               label: sv.label, value: sv.value, unit: "",
              })),
             ];
             try {
              trackRevenueEvent(REVENUE_EVENTS.free_tool_completed, { toolSlug: tool.slug, source: "traffic_catalog" });
              trackConversionEvent({
               stage: "calculation", eventName: "free_tool_calculate", locale,
               pagePath, toolSlug: tool.slug,
               campaignId: attribution.utmCampaign, source: attribution.utmSource,
               medium: attribution.utmMedium, valueType: "free", category: tool.category,
              });
             } catch {}
             return {
              resultRows,
              resultWarnings: [],
              resultOkMessage: calcResult.headline,
             };
            }}
            calculateLabel={t("tool.calculate")}
            onReset={() => { setValues(buildInitialValues(tool)); setSubmitted(false); setErrors({}); setFullLoopResult(null); }}
          />

          {relatedTools.length > 0 ? (
            <div className="sc-industrial-panel mt-4 p-4">
              <h2 className="sc-premium-report-section__title">{t("tool.relatedTitle")}</h2>
              <ul className="sc-craft-grid sc-craft-grid--2 mt-3">
                {relatedTools.map((related) => (
                  <li key={related.slug} className="min-w-0">
                    <Link
                      href={getToolHref("free", related.slug)}
                      className="block break-words text-sm font-medium text-premium-velvet underline underline-offset-2 hover:text-[#E65100]"
                    >
                      {resolveFreeToolDisplayTitle(related.slug, locale, related.title)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <CalculationFeedbackButton
            toolSlug={tool.slug}
            toolType={surfaceTier === "premium" ? "premium" : "free"}
            locale={locale}
            routePath={pagePath}
            inputSnapshot={feedbackInputSnapshot}
            resultSnapshot={undefined}
          />

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
          </>
          )}
        </Container>
      </section>
    </PageLayout>
  );
}
