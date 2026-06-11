"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Link, usePathname } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
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
} from "@/lib/tools/free-traffic-calculators";
import {
  listRelatedTrafficTools,
  type FreeTrafficTool,
} from "@/lib/tools/free-traffic-catalog";
import { resolvePremiumAnalyzerHref } from "@/lib/premium-schema/premium-schema-catalog";
import { FreeToolAuthorityBlock } from "@/components/content/FreeToolAuthorityBlock";
import { SmartFormWorkspace } from "@/components/smart-form/SmartFormWorkspace";
import { RuntimeTrustTracePanel } from "@/components/tools/RuntimeTrustTracePanel";
import { ToolFeedbackPanel } from "@/components/feedback/ToolFeedbackPanel";
import { SmartFormValidationSummary } from "@/components/tools/smart-form/SmartFormValidationSummary";
import { SmartToolForm } from "@/components/tools/smart-form/SmartToolForm";
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
  localizedContent?: {
    title: string;
    description: string;
    infoBoxTitle?: string;
    infoBoxContent?: string;
  };
}

export function FreeTrafficToolPage({ tool, featuredAnswer, localizedContent }: FreeTrafficToolPageProps) {
  const t = useTranslations("freeTrafficCatalog");
  const tAuthority = useTranslations("contentAuthority.freeTool");
  const locale = useLocale();
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
    if (!startedTracked.current) {
      startedTracked.current = true;
      trackRevenueEvent(REVENUE_EVENTS.free_tool_started, {
        toolSlug: tool.slug,
        source: "traffic_catalog",
      });
    }

    if (useFullLoopRuntime) {
      const nextErrors = validateSmartFormFieldValues(tool.slug, values);
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
      const numeric = typeof raw === "number" ? raw : Number(raw);
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
          <p className="sc-craft-eyebrow">{t(`categories.${tool.category}`)}</p>
          <h1 className="sc-craft-headline">{displayTitle}</h1>
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
          <div className="sc-ledger-cetele sc-tool-workspace">
            <SmartFormWorkspace
              toolSlug={tool.slug}
              tier="free"
              title={displayTitle}
              description={displayDescription}
              inputConfig={{ kind: "traffic", inputs: tool.inputs }}
              values={values}
              errors={errors}
              onChange={handleSmartFormChange}
              onSubmit={handleSubmit}
              calculateLabel={t("tool.calculate")}
              nativeContractForm={useFullLoopRuntime}
              formFallback={
                useFullLoopRuntime ? (
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
                ) : (
            <form
              onSubmit={handleSubmit}
              className="sc-form-shell sc-ledger-cetele__form sc-ledger-cetele-form sc-ledger-panel sc-industrial-panel sc-ledger-letterpress p-4 sm:p-5"
              noValidate
              data-calculation-form="true"
            >
              {tool.inputs.map((input) => {
                const id = `ft-${tool.slug}-${input.key}`;
                const error = errors[input.key];
                const showUnit = Boolean(input.unit);

                if (input.type === "select" && input.options) {
                  return (
                    <div key={input.key} className="sc-industrial-field sc-form-field">
                      <div className="sc-industrial-field__label-row">
                        <label htmlFor={id} className="sc-industrial-field__label">
                          {input.label}
                        </label>
                      </div>
                      <select
                        id={id}
                        value={String(values[input.key] ?? "")}
                        onChange={(e) => {
                          setValues((prev) => ({ ...prev, [input.key]: e.target.value }));
                          setSubmitted(false);
                        }}
                        className={error ? "sc-industrial-input--error" : undefined}
                      >
                        {input.options.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <p className="sc-industrial-field__helper">{input.helper}</p>
                      {error ? (
                        <p className="sc-industrial-field__error" role="alert">
                          {error}
                        </p>
                      ) : null}
                    </div>
                  );
                }

                return (
                  <div key={input.key} className="sc-industrial-field">
                    <div className="sc-industrial-field__label-row">
                      <label htmlFor={id} className="sc-industrial-field__label">
                        {input.label}
                      </label>
                      {showUnit ? (
                        <span className="sc-industrial-field__unit">{input.unit}</span>
                      ) : null}
                    </div>
                    <input
                      id={id}
                      type="text"
                      inputMode="decimal"
                      autoComplete="off"
                      value={values[input.key] ?? ""}
                      onChange={(e) => {
                        setValues((prev) => ({ ...prev, [input.key]: e.target.value }));
                        setSubmitted(false);
                      }}
                      className={`sc-ledger-input-underline${error ? " sc-ledger-input--error" : ""}`}
                      aria-invalid={Boolean(error)}
                    />
                    <p className="sc-industrial-field__helper">{input.helper}</p>
                    {error ? (
                      <p className="sc-industrial-field__error" role="alert">
                        {error}
                      </p>
                    ) : null}
                  </div>
                );
              })}

              <div className="sc-industrial-form-actions">
                <button type="submit" className="sc-cta-primary">
                  {t("tool.calculate")}
                </button>
              </div>
            </form>
                )
              }
              resultPanel={
            <div className="min-w-0 space-y-4" aria-live="polite">
              {useFullLoopRuntime && fullLoopResult?.status === "blocked" ? (
                <>
                  <SmartFormValidationSummary
                    title="Result blocked"
                    blockers={fullLoopResult.blockers}
                  />
                  <RuntimeTrustTracePanel trustTrace={fullLoopResult.trustTrace} />
                </>
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

                  {useFullLoopRuntime && fullLoopResult?.status === "success" ? (
                    <RuntimeTrustTracePanel trustTrace={fullLoopResult.trustTrace} />
                  ) : null}

                  <p className="text-xs leading-relaxed text-body-charcoal">{result.legalNote}</p>
                </>
              ) : (
                <p className="text-sm text-body-charcoal">{t("tool.awaiting")}</p>
              )}
            </div>
              }
              trustTraceSlot={
                fullLoopResult?.status === "success" || fullLoopResult?.status === "blocked" ? (
                  <RuntimeTrustTracePanel trustTrace={fullLoopResult.trustTrace} />
                ) : undefined
              }
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
                      {related.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <ToolFeedbackPanel
            toolSlug={tool.slug}
            toolType="free"
            source={useFullLoopRuntime ? "smart_form" : "free_tool"}
            locale={locale}
            routePath={pagePath}
            formulaContractId={useFullLoopRuntime ? tool.slug : undefined}
            inputSnapshot={feedbackInputSnapshot}
            resultSnapshot={feedbackResultSnapshot}
          />

          <FreeToolAuthorityBlock
            tool={tool}
            labels={{
              howItWorksTitle: tAuthority("howItWorksTitle"),
              descriptionTitle: tAuthority("descriptionTitle"),
              formulaTitle: tAuthority("formulaTitle"),
              inputsTitle: tAuthority("inputsTitle"),
              includesTitle: tAuthority("includesTitle"),
              estimateMissesTitle: tAuthority("estimateMissesTitle"),
              faqTitle: tAuthority("faqTitle"),
              faqUseTitle: tAuthority("faqUseTitle"),
              faqFreeTitle: tAuthority("faqFreeTitle"),
              faqPremiumTitle: tAuthority("faqPremiumTitle"),
              faqUseAnswer: tAuthority("faqUseAnswer"),
              faqFreeAnswer: tAuthority("faqFreeAnswer"),
              faqPremiumAnswer: tAuthority("faqPremiumAnswer"),
              relatedGuideTitle: tAuthority("relatedGuideTitle"),
              relatedHubTitle: tAuthority("relatedHubTitle"),
              relatedPremiumTitle: tAuthority("relatedPremiumTitle"),
              relatedPremiumCta: tAuthority("relatedPremiumCta"),
            }}
          />
        </Container>
      </section>
    </PageLayout>
  );
}
