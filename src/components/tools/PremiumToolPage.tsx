"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { useLocale } from "next-intl";
import { usePathname } from "@/i18n/routing";
import { stripLocalePrefix } from "@/i18n/locales";
import { PremiumSubscribedBanner } from "@/components/billing/SubscriptionActivationBanner";
import { PremiumAccessBanner } from "@/components/premium/PremiumAccessBanner";
import { ProFeatureNotice } from "@/components/premium/ProFeatureNotice";
import { ProLockedAction } from "@/components/premium/ProLockedAction";
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/ui/Container";
import { OsModuleHeader } from "@/components/os/OsModuleHeader";
import { SectorToolSelect } from "@/components/os/SectorToolSelect";
import { handleNumericInputChange } from "@/lib/input/numeric-input";
import { trackConversionEvent } from "@/lib/analytics/conversion-funnel";
import { useAttributionContext } from "@/lib/analytics/use-attribution-context";
import {
 REVENUE_EVENTS,
 trackRevenueEvent,
} from "@/lib/analytics/revenue-events";
import { isDevelopmentProBypass } from "@/lib/billing/subscription";
import {
  canAccessPremiumFullFeatures,
  resolvePremiumAccessMode,
} from "@/lib/billing/premium-access-mode";
import { usePremiumToolAccess } from "@/lib/billing/use-premium-tool-access";
import { buildVerdictReportData } from "@/lib/reports/verdict-report";
import {
 PremiumDecisionReportPanel,
 toStochasticInputs,
} from "@/components/tools/PremiumDecisionReportPanel";
import {
 PremiumAnalyzerReportPanel,
} from "@/components/tools/PremiumAnalyzerReportPanel";
import { useGuidanceFieldFocus } from "@/components/guidance/GuidanceContext";
import { ToolGuidanceLayout } from "@/components/guidance/ToolGuidanceLayout";
import { buildGuidanceFieldsFromKeys } from "@/lib/guidance/build-guidance-fields";
import { SmartFormShell } from "@/components/smart-form/SmartFormShell";
import { SmartResultPanel } from "@/components/smart-form/SmartResultPanel";
import { ResultLayerTabs } from "@/components/results/ResultLayerTabs";
import {
  buildPremiumSchemaExperienceFields,
  filterVisibleCalculatorFields,
  resolveCalculatorExperience,
} from "@/lib/calculator-experience/resolve-calculator-experience";
import type { CalculatorExperienceMode } from "@/lib/calculator-experience/calculator-experience-types";
import { DynamicSmartFormPilot } from "@/components/smart-form/DynamicSmartFormPilot";
import { buildSmartFormForTool } from "@/lib/smart-form/smart-form-adapter";
import { hasPremiumSmartFormDefinition } from "@/lib/smart-form/premium-smart-form-definitions";
import { RuntimeTrustTracePanel } from "@/components/tools/RuntimeTrustTracePanel";
import { CalculationFeedbackButton } from "@/components/feedback/CalculationFeedbackButton";
import { SmartFormValidationSummary } from "@/components/tools/smart-form/SmartFormValidationSummary";
import { SmartToolForm } from "@/components/tools/smart-form/SmartToolForm";
import { DynamicPremiumCalculator } from "@/components/tools/DynamicPremiumCalculator";
import {
 isPremiumFullLoopRuntimeSlug,
 runPremiumFullLoopCalculation,
 type PremiumFullLoopResult,
} from "@/lib/formula-governance/runtime-validation/premium-full-loop-bridge";
import {
  buildSmartFormInitialValues,
  validateSmartFormFieldValues,
} from "@/lib/formula-governance/runtime-validation/smart-form-contract-adapter";
import { getPremiumSchemaForPaidSlug } from "@/lib/premium-schema/schema-registry";
import {
 arePremiumToolInputsValid,
 calculatePremiumDecisionReport,
 calculatePremiumToolResult,
 type PremiumToolInputValues,
 type PremiumToolResult,
} from "@/lib/tools/premium-tool-results";
import {
 type RevenueTool,
 type RevenueToolInput,
 revenueLegalDisclaimer,
} from "@/lib/tools/revenue-tools";
import { evaluateRuntimeTrust } from "@/lib/tools/runtime-trust-engine";
import { ToolSafeReviewState } from "@/components/tools/ToolSafeReviewState";

const DownloadVerdictPdfButton = dynamic(
 () =>
 import("@/components/reports/DownloadVerdictPdfButton").then(
 (mod) => mod.DownloadVerdictPdfButton
 ),
 {
 ssr: false,
 loading: () => (
 <span className="inline-flex min-h-[44px] items-center text-sm text-text-secondary">
 Preparing PDF…
 </span>
 ),
 }
);

const SaveVerdictReportButton = dynamic(
 () =>
 import("@/components/reports/SaveVerdictReportButton").then(
 (mod) => mod.SaveVerdictReportButton
 ),
 {
 ssr: false,
 loading: () => (
 <span className="inline-flex min-h-[44px] items-center text-sm text-text-secondary">
 Loading save…
 </span>
 ),
 }
);

function buildInitialValues(tool: RevenueTool): PremiumToolInputValues {
 const values: PremiumToolInputValues = {};
 for (const input of tool.paidInputs) {
 if (input.type === "select") {
 values[input.key] = input.options?.[0]?.value ?? "";
 continue;
 }
 if (input.defaultValue !== undefined) {
 values[input.key] = input.defaultValue;
 continue;
 }
 values[input.key] = 0;
 }
 return values;
}

interface PremiumToolInputFieldProps {
 input: RevenueToolInput;
 value: number | string;
 error?: string;
 onChange: (key: string, value: number | string) => void;
}

function PremiumToolInputField({
 input,
 value,
 error,
 onChange,
}: PremiumToolInputFieldProps) {
 const { onFocus, onBlur } = useGuidanceFieldFocus(input.key);
 const inputId = `premium-tool-${input.key}`;
 const errorId = `${inputId}-error`;
 const helperId = `${inputId}-helper`;
 const showUnit = Boolean(input.unit) && input.type !== "currency";

 if (input.type === "select" && input.options) {
 return (
 <div className="sc-industrial-field">
 <div className="sc-industrial-field__label-row">
 <label htmlFor={inputId} className="sc-industrial-field__label">
 {input.label}
 {input.required ? <span aria-hidden> *</span> : null}
 </label>
 </div>
 <select
 id={inputId}
 value={String(value)}
 onChange={(event) => onChange(input.key, event.target.value)}
 onFocus={onFocus}
 onBlur={onBlur}
 aria-invalid={Boolean(error)}
 aria-describedby={error ? errorId : helperId}
 className={error ? "sc-industrial-input--error" : undefined}
 >
 {input.options.map((option) => (
 <option key={option.value} value={option.value}>
 {option.label}
 </option>
 ))}
 </select>
 {input.helperText ? (
 <p id={helperId} className="sc-industrial-field__helper">{input.helperText}</p>
 ) : null}
 {error ? (
 <p id={errorId} className="sc-industrial-field__error" role="alert">
 {error}
 </p>
 ) : null}
 </div>
 );
 }

 const isCurrency = input.type === "currency";

 return (
 <div className="sc-industrial-field">
 <div className="sc-industrial-field__label-row">
 <label htmlFor={inputId} className="sc-industrial-field__label">
 {input.label}
 {input.required ? <span aria-hidden> *</span> : null}
 </label>
 {showUnit ? <span className="sc-industrial-field__unit">{input.unit}</span> : null}
 </div>
 <div className="sc-industrial-input-wrap">
 {isCurrency ? (
 <span className="sc-industrial-input-wrap__prefix" aria-hidden>$</span>
 ) : null}
 <input
 id={inputId}
 type="text"
 inputMode="decimal"
 autoComplete="off"
 value={String(value)}
 onFocus={onFocus}
 onBlur={onBlur}
 onChange={(event) => {
 const { numeric } = handleNumericInputChange(event.target.value);
 onChange(input.key, numeric);
 }}
 aria-invalid={Boolean(error)}
 aria-describedby={error ? errorId : helperId}
 className={`sc-ledger-input-boxed sc-industrial-input${isCurrency ? " sc-industrial-input--currency" : ""}${showUnit ? " sc-industrial-input--unit" : ""}${error ? " sc-industrial-input--error" : ""}`}
 />
 </div>
 {input.helperText ? (
 <p id={helperId} className="sc-industrial-field__helper">{input.helperText}</p>
 ) : null}
 {error ? (
 <p id={errorId} className="sc-industrial-field__error" role="alert">
 {error}
 </p>
 ) : null}
 </div>
 );
}

interface PremiumToolPageProps {
 tool: RevenueTool;
 /** URL slug — funnel alias routes use governance runtime slug, not paidSlug. */
 routeSlug?: string;
}

export function PremiumToolPage({ tool, routeSlug }: PremiumToolPageProps) {
 const locale = useLocale();
 const pathname = usePathname();
 const attribution = useAttributionContext();
 const pagePath = stripLocalePrefix(pathname);
 const runtimeSlug = routeSlug ?? tool.paidSlug;
 const useFullLoopRuntime = isPremiumFullLoopRuntimeSlug(runtimeSlug);
 const runtimeTrust = useMemo(
  () => evaluateRuntimeTrust({ slug: runtimeSlug, locale, surface: "premium" }),
  [runtimeSlug, locale],
 );
 const showCalculationSurface = runtimeTrust.calculationEligible;
 const {
 user,
 canAccessAnalyzer,
 isSuperUser,
 loading,
 error,
 creditBalance,
 hasCredits,
 needsCreditLoad,
 requiresCreditConsume,
 creditPending,
 consumeCreditForRun,
 startCreditPackCheckout,
 resetCreditRunSession,
 } = usePremiumToolAccess(tool.paidSlug);

 const [values, setValues] = useState<PremiumToolInputValues>(() =>
 useFullLoopRuntime
  ? buildSmartFormInitialValues(runtimeSlug)
  : buildInitialValues(tool)
 );
 const [submitted, setSubmitted] = useState(false);
 const [isCalculating, setIsCalculating] = useState(false);
 const [errors, setErrors] = useState<Record<string, string>>({});
 const [mode, setMode] = useState<CalculatorExperienceMode>("quick");

 const usePremiumSmartForm = hasPremiumSmartFormDefinition(runtimeSlug);
 const isCncStochastic = tool.paidSlug === "cnc-quote-risk-analyzer";
 const schemaPilot = getPremiumSchemaForPaidSlug(tool.paidSlug);
 const showSchemaPilot = Boolean(schemaPilot) && !useFullLoopRuntime;
 const smartFormAdapter = useMemo(
  () =>
   buildSmartFormForTool(runtimeSlug, { kind: "revenue", inputs: tool.paidInputs }),
  [runtimeSlug, tool.paidInputs],
 );

 const experience = useMemo(() => {
  const base = resolveCalculatorExperience({
   toolSlug: runtimeSlug,
   fields: buildPremiumSchemaExperienceFields(
    tool.paidInputs.map((input) => ({
     id: input.key,
     required: Boolean(input.required),
    })),
   ),
   category: tool.sector,
  });
  if (smartFormAdapter.ok && smartFormAdapter.expertSections.length > 0) {
   return { ...base, hasExpertMode: true };
  }
  return base;
 }, [runtimeSlug, tool.paidInputs, tool.sector, smartFormAdapter]);

 const visiblePaidInputs = useMemo(
  () => filterVisibleCalculatorFields(tool.paidInputs, experience, mode),
  [tool.paidInputs, experience, mode],
 );

 const premiumGuidanceFields = useMemo(() => {
  if (smartFormAdapter.ok) {
   return [
    ...smartFormAdapter.simpleSections.flatMap((section) => section.inputs),
    ...smartFormAdapter.expertSections.flatMap((section) => section.inputs),
   ].map((input) => ({
    key: input.key,
    label: input.label,
    type: input.type,
    unitGroup: input.unit,
   }));
  }
  return buildGuidanceFieldsFromKeys(
   tool.paidInputs.map((input) => ({
    key: input.key,
    label: input.label,
    unit: input.unit,
    type: input.type,
   })),
  );
 }, [smartFormAdapter, tool.paidInputs]);

 const wrapPremiumGuidance = (node: ReactNode) => (
  <ToolGuidanceLayout
   toolSlug={runtimeSlug}
   tier="premium"
   fields={premiumGuidanceFields}
   toolTitle={tool.paidTitle}
   toolSector={tool.sector}
  >
   {node}
  </ToolGuidanceLayout>
 );

 const devPro = isDevelopmentProBypass();
 const accessMode = resolvePremiumAccessMode({
  user,
  canAccessAnalyzer,
  isSuperUser,
  devPro,
 });
 const hasFullPremiumFeatures = canAccessPremiumFullFeatures(accessMode);

 const fullLoopResult = useMemo((): PremiumFullLoopResult | null => {
 if (!submitted || !useFullLoopRuntime) {
 return null;
 }
 return runPremiumFullLoopCalculation(runtimeSlug, values);
 }, [submitted, useFullLoopRuntime, runtimeSlug, values]);

 const decisionReport = useMemo(() => {
 if (!submitted) {
 return null;
 }
 if (useFullLoopRuntime) {
 return fullLoopResult?.status === "success" ? fullLoopResult.report : null;
 }
 if (!arePremiumToolInputsValid(tool, values)) {
 return null;
 }
 return calculatePremiumDecisionReport(tool.paidSlug, values);
 }, [submitted, useFullLoopRuntime, fullLoopResult, tool, values]);

 const result = useMemo((): PremiumToolResult | null => {
 if (useFullLoopRuntime) {
 return fullLoopResult?.status === "success" ? fullLoopResult.toolResult : null;
 }
 if (!decisionReport) {
 return null;
 }
 return calculatePremiumToolResult(tool, values);
 }, [useFullLoopRuntime, fullLoopResult, decisionReport, tool, values]);

 const hasCalculated = submitted && Boolean(result) && !isCalculating;

 const verdictReportData = useMemo(() => {
 if (!result) {
 return null;
 }
 return buildVerdictReportData({
  tool,
  values,
  result,
  decisionReport: useFullLoopRuntime ? undefined : decisionReport ?? undefined,
 });
 }, [result, tool, values, decisionReport, useFullLoopRuntime]);

 const feedbackInputSnapshot = useMemo(() => ({ ...values }), [values]);
 const feedbackResultSnapshot = useMemo(() => {
  if (!result) {
   return undefined;
  }
  return {
   severity: result.severity,
   verdict: result.verdict,
   headline: result.headline,
   primaryMetricValue: result.primaryMetricValue,
  };
 }, [result]);

 const resultTracked = useRef(false);

 useEffect(() => {
 trackRevenueEvent(REVENUE_EVENTS.premium_analyzer_viewed, {
 toolSlug: tool.paidSlug,
 });
 }, [tool.paidSlug]);

 useEffect(() => {
  if (showSchemaPilot) {
   return;
  }
  trackConversionEvent({
   stage: "premium_preview",
   eventName: "premium_analyzer_open",
   locale,
   pagePath,
   premiumSlug: tool.paidSlug,
   campaignId: attribution.utmCampaign,
   source: attribution.utmSource,
   medium: attribution.utmMedium,
   valueType: "premium",
   category: tool.sector,
  });
 }, [
  attribution.utmCampaign,
  attribution.utmMedium,
  attribution.utmSource,
  locale,
  pagePath,
  showSchemaPilot,
  tool.paidSlug,
  tool.sector,
 ]);

 useEffect(() => {
 if (!loading && user && !canAccessAnalyzer) {
 trackRevenueEvent(REVENUE_EVENTS.paywall_viewed, {
 toolSlug: tool.paidSlug,
 });
 }
 }, [loading, user, canAccessAnalyzer, tool.paidSlug]);

 useEffect(() => {
 if (result && canAccessAnalyzer && !resultTracked.current) {
 resultTracked.current = true;
 trackRevenueEvent(REVENUE_EVENTS.premium_result_generated, {
 toolSlug: tool.paidSlug,
 severity: result.severity,
 });
 }
 if (!result) {
 resultTracked.current = false;
 }
 }, [result, canAccessAnalyzer, tool.paidSlug]);

 const renderAnalysisOutput = (variant: "legacy" | "primary") => {
 if (isCalculating) {
 return variant === "primary" ? (
 <p className="text-sm text-body-charcoal">Calculating…</p>
 ) : null;
 }

 if (useFullLoopRuntime && submitted && fullLoopResult?.status === "blocked") {
 return (
 <>
 <SmartFormValidationSummary
  title="Calculation blocked"
  blockers={fullLoopResult.blockers}
 />
 {hasFullPremiumFeatures ? (
  <RuntimeTrustTracePanel trustTrace={fullLoopResult.trustTrace} />
 ) : (
  <ProFeatureNotice messageKey="lockedTrustTrace" />
 )}
 </>
 );
 }

 if (decisionReport && result) {
 return (
 <>
 <PremiumAnalyzerReportPanel report={decisionReport} />
 {hasFullPremiumFeatures && verdictReportData ? (
  <>
   <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
    <DownloadVerdictPdfButton
     data={verdictReportData}
     slug={tool.paidSlug}
     severity={result.severity}
    />
    {user ? (
     <SaveVerdictReportButton uid={user.uid} tool={tool} values={values} result={result} />
    ) : null}
   </div>
   {useFullLoopRuntime && fullLoopResult?.status === "success" ? (
    <>
     <RuntimeTrustTracePanel trustTrace={fullLoopResult.trustTrace} />
    </>
   ) : null}
  </>
 ) : (
  <ProLockedAction paidSlug={tool.paidSlug} messageKey="lockedExport">
   {verdictReportData ? (
    <DownloadVerdictPdfButton
     data={verdictReportData}
     slug={tool.paidSlug}
     severity={result.severity}
    />
   ) : null}
  </ProLockedAction>
 )}
 {isCncStochastic ? (
 <PremiumDecisionReportPanel
 variant="stochastic"
 sector={tool.sector}
 inputs={toStochasticInputs(values)}
 inputsReady={arePremiumToolInputsValid(tool, values)}
 toolSlug={tool.paidSlug}
 toolTitle={tool.paidTitle}
 />
 ) : null}
 </>
 );
 }

 if (!submitted) {
 return (
 <p className="text-sm text-body-charcoal">Enter job inputs and run the calculation.</p>
 );
 }

 return null;
 };

 const handleChange = (key: string, value: number | string) => {
 resetCreditRunSession(tool.paidSlug);
 setValues((prev) => ({ ...prev, [key]: value }));
 setSubmitted(false);
 setErrors((prev) => {
 const next = { ...prev };
 delete next[key];
 return next;
 });
 };

 const trackPremiumCalculate = () => {
  if (showSchemaPilot) {
   return;
  }
  trackConversionEvent({
   stage: "premium_preview",
   eventName: "premium_calculate",
   locale,
   pagePath,
   premiumSlug: tool.paidSlug,
   campaignId: attribution.utmCampaign,
   source: attribution.utmSource,
   medium: attribution.utmMedium,
   valueType: "premium",
   category: tool.sector,
  });
 };

 const finalizePremiumCalculation = () => {
  setIsCalculating(true);
  setSubmitted(false);
  window.setTimeout(() => {
   setIsCalculating(false);
   setSubmitted(true);
   trackPremiumCalculate();
  }, 400);
 };

 const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
 event.preventDefault();

 if (!showCalculationSurface) {
  return;
 }

 void (async () => {
 if (useFullLoopRuntime) {
  if (!usePremiumSmartForm) {
   const nextErrors = validateSmartFormFieldValues(runtimeSlug, values, locale);
   setErrors(nextErrors);
   if (Object.keys(nextErrors).length > 0) {
    setSubmitted(false);
    return;
   }
  } else {
   setErrors({});
  }

  if (needsCreditLoad) {
   return;
  }

  if (requiresCreditConsume) {
   const creditResult = await consumeCreditForRun(tool.paidSlug);
   if (!creditResult.ok) {
    return;
   }
  }

  finalizePremiumCalculation();
  return;
 }

 if (!arePremiumToolInputsValid(tool, values)) {
 const nextErrors: Record<string, string> = {};
 for (const input of tool.paidInputs) {
 if (!input.required) {
 continue;
 }
 if (input.type === "select") {
 if (typeof values[input.key] !== "string" || values[input.key] === "") {
 nextErrors[input.key] = "Required";
 }
 continue;
 }
 const numeric =
 typeof values[input.key] === "number"
 ? values[input.key]
 : Number(values[input.key]);
 if (
 typeof numeric !== "number" ||
 !Number.isFinite(numeric) ||
 numeric < 0
 ) {
 nextErrors[input.key] = "Enter a valid number";
 }
 }
 setErrors(nextErrors);
 setSubmitted(false);
 return;
 }

 if (needsCreditLoad) {
  return;
 }

 if (requiresCreditConsume) {
  const creditResult = await consumeCreditForRun(tool.paidSlug);
  if (!creditResult.ok) {
   return;
  }
 }

 setErrors({});
 finalizePremiumCalculation();
 })();
 };

 return (
 <PageLayout>
 <section className="sc-craft-section">
 <Container size="wide" className="sc-craft-container sc-craft-container--wide min-w-0">
 {loading ? (
 <p className="text-sm text-body-charcoal">Loading access…</p>
 ) : (
 <>
 <SectorToolSelect tier="premium" currentSlug={tool.paidSlug} />
 <OsModuleHeader title={tool.paidTitle} tier="intelligence" slug={runtimeSlug} locale={locale} surface="premium" />
 {!hasFullPremiumFeatures ? (
  <PremiumAccessBanner mode={accessMode} paidSlug={tool.paidSlug} />
 ) : null}
 {user && !hasFullPremiumFeatures && !isSuperUser ? (
  <Suspense fallback={null}>
   <PremiumSubscribedBanner toolSlug={tool.paidSlug} />
  </Suspense>
 ) : null}
 {user && requiresCreditConsume && showCalculationSurface ? (
  <p className="mt-2 text-sm text-body-charcoal">
   Credits: {creditBalance}
   {hasCredits ? " — 1 credit per premium run." : null}
  </p>
 ) : null}
 {needsCreditLoad && showCalculationSurface ? (
  <div className="mt-4 rounded-sm border border-amber/30 bg-premium-surface p-4 sm:p-5">
   <p className="text-xs font-semibold uppercase tracking-wider text-amber">Credits required</p>
   <h2 className="mt-2 text-lg font-bold text-premium-velvet">Load credits to run this analyzer</h2>
   <p className="mt-2 text-sm leading-relaxed text-body-charcoal">
    Each full premium calculation uses 1 credit. SectorCalc Pro subscribers run without credits.
   </p>
   <button
    type="button"
    disabled={creditPending}
    onClick={() =>
     void startCreditPackCheckout({
      toolSlug: tool.paidSlug,
      returnPath: `/tools/premium/${tool.paidSlug}`,
      locale,
      creditPackSize: 5,
     }).catch(() => undefined)
    }
    className="sc-cta-primary mt-4 inline-flex min-h-[44px] items-center justify-center px-4 disabled:opacity-60"
   >
    Load 5 credits — $4.99
   </button>
  </div>
 ) : null}
 {error ? (
  <p className="mt-2 text-sm text-crit-red status-crit" role="alert">
   {error}
  </p>
 ) : null}
 {!showCalculationSurface ? (
  <ToolSafeReviewState slug={runtimeSlug} locale={locale} findings={runtimeTrust.findings} />
 ) : showSchemaPilot ? (
 <>
 <DynamicPremiumCalculator schema={schemaPilot!} />
 <details className="mt-4 sc-industrial-panel p-4">
 <summary className="cursor-pointer text-xs font-semibold uppercase tracking-wider text-body-charcoal">
 Legacy contract engine (PDF-compatible)
 </summary>
 <div className="sc-tool-workspace mt-4">
 <form
 onSubmit={handleSubmit}
 className="sc-form-shell sc-form-grid sc-tool-workspace__form sc-industrial-form sc-industrial-panel p-4 sm:p-5"
 noValidate
 data-calculation-form="true"
 >
 {tool.paidInputs.map((input) => (
 <PremiumToolInputField
 key={input.key}
 input={input}
 value={values[input.key] ?? (input.type === "select" ? "" : 0)}
 error={errors[input.key]}
 onChange={handleChange}
 />
 ))}
 <div className="sc-industrial-form-actions">
 <button type="submit" disabled={isCalculating} className="sc-cta-primary disabled:opacity-60">
 {isCalculating ? "Calculating…" : "Run legacy calculation"}
 </button>
 </div>
 </form>
 <div className="sc-tool-workspace__result min-w-0 space-y-4">
 {renderAnalysisOutput("legacy")}
 </div>
 </div>
 </details>
 </>
 ) : (
 <>
 <SmartFormShell
  title={tool.paidTitle}
  description={tool.paidValue}
  tier="premium"
  experience={experience}
  mode={mode}
  onModeChange={setMode}
  hasCalculated={hasCalculated}
  fallback={useFullLoopRuntime || !smartFormAdapter.ok}
  formContent={wrapPremiumGuidance(
   useFullLoopRuntime ? (
    usePremiumSmartForm ? (
     <DynamicSmartFormPilot
      slug={runtimeSlug}
      values={values}
      errors={errors}
      onChange={handleChange}
      onSubmit={handleSubmit}
      calculateLabel={isCalculating ? "Calculating…" : "Run calculation"}
      isCalculating={isCalculating}
     />
    ) : (
     <SmartToolForm
      slug={runtimeSlug}
      values={values}
      errors={errors}
      onChange={handleChange}
      onSubmit={handleSubmit}
      calculateLabel={isCalculating ? "Calculating…" : "Run calculation"}
      blocked={submitted && fullLoopResult?.status === "blocked"}
      blockers={
       submitted && fullLoopResult?.status === "blocked" ? fullLoopResult.blockers : []
      }
      isCalculating={isCalculating}
     />
    )
   ) : (
    <form
     onSubmit={handleSubmit}
     className="sc-form-shell sc-form-grid sc-industrial-form sc-ledger-panel sc-industrial-panel sc-ledger-letterpress p-4 sm:p-5"
     noValidate
     data-calculation-form="true"
    >
     {visiblePaidInputs.map((input) => (
      <PremiumToolInputField
       key={input.key}
       input={input}
       value={values[input.key] ?? (input.type === "select" ? "" : 0)}
       error={errors[input.key]}
       onChange={handleChange}
      />
     ))}
     <div className="sc-industrial-form-actions">
      <button
       type="submit"
       disabled={isCalculating || creditPending || needsCreditLoad}
       className="sc-ledger-cta-primary sc-cta-primary disabled:opacity-60"
      >
       {isCalculating ? "Calculating…" : "Run calculation"}
      </button>
     </div>
    </form>
   )
  )}
  resultContent={
   hasCalculated ? (
    <ResultLayerTabs
     quickContent={
      <SmartResultPanel
       calculationSteps={smartFormAdapter.ok ? smartFormAdapter.calculationSteps : []}
       trustTraceSlot={
        useFullLoopRuntime && fullLoopResult && hasFullPremiumFeatures ? (
         <RuntimeTrustTracePanel trustTrace={fullLoopResult.trustTrace} />
        ) : undefined
       }
      >
       <div className="min-w-0 space-y-4">{renderAnalysisOutput("primary")}</div>
      </SmartResultPanel>
     }
     deepContent={
      useFullLoopRuntime && fullLoopResult && hasFullPremiumFeatures ? (
       <RuntimeTrustTracePanel trustTrace={fullLoopResult.trustTrace} />
      ) : undefined
     }
    />
   ) : undefined
  }
 />
 </>
 )}
 </>
 )}
 </Container>
 </section>
 <section className="border-t border-technical-gray/20 bg-white py-6">
 <Container>
 <CalculationFeedbackButton
  toolSlug={runtimeSlug}
  toolType="premium"
  locale={locale}
  routePath={pagePath}
  inputSnapshot={feedbackInputSnapshot}
  resultSnapshot={feedbackResultSnapshot}
 />
 </Container>
 </section>
 <section className="border-t border-technical-gray/40 bg-off-white py-6">
 <Container>
 <p className="text-xs leading-relaxed text-body-charcoal">{tool.legalDisclaimer || revenueLegalDisclaimer}</p>
 </Container>
 </section>
 </PageLayout>
 );
}
