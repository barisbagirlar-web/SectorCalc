"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/routing";
import { FeaturedAnswerBlock } from "@/components/seo/FeaturedAnswerBlock";
import { PremiumAnalyzerAuthorityBlock } from "@/components/content/PremiumAnalyzerAuthorityBlock";
import { ExpertAuthoritySection } from "@/components/content/ExpertAuthoritySection";
import { resolveToolCategory } from "@/lib/catalog/resolve-tool-category";
import { getPremiumCatalogCategoryDetail } from "@/lib/features/premium/premium-category-resolver";
import { stripLocalePrefix } from "@/i18n/locales";
import { PremiumSubscribedBanner } from "@/components/billing/SubscriptionActivationBanner";
import { PremiumAccessBanner } from "@/components/premium/PremiumAccessBanner";
import { ProFeatureNotice } from "@/components/premium/ProFeatureNotice";
import { ProLockedAction } from "@/components/premium/ProLockedAction";
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/ui/Container";
import { OsModuleHeader } from "@/components/os/OsModuleHeader";
import { SectorToolSelect } from "@/components/os/SectorToolSelect";
import { handleNumericInputChange } from "@/lib/features/input/numeric-input";
import { trackConversionEvent } from "@/lib/infrastructure/analytics/conversion-funnel";
import { useAttributionContext } from "@/lib/infrastructure/analytics/use-attribution-context";
import {
 REVENUE_EVENTS,
 trackRevenueEvent,
} from "@/lib/infrastructure/analytics/revenue-events";
import { isDevelopmentProBypass } from "@/lib/features/billing/subscription";
import {
  canAccessPremiumFullFeatures,
  resolvePremiumAccessMode,
} from "@/lib/features/billing/premium-access-mode";
import { usePremiumToolAccess } from "@/lib/features/billing/use-premium-tool-access";
import { buildVerdictReportData } from "@/lib/features/reports/verdict-report";
import {
 PremiumDecisionReportPanel,
 toStochasticInputs,
} from "@/components/tools/PremiumDecisionReportPanel";
import {
 PremiumAnalyzerReportPanel,
} from "@/components/tools/PremiumAnalyzerReportPanel";
import { ProDecisionPanel } from "@/components/tools/ProDecisionPanel";
import { useGuidanceFieldFocus } from "@/components/guidance/GuidanceContext";
import { ToolGuidanceLayout } from "@/components/guidance/ToolGuidanceLayout";
import { buildGuidanceFieldsFromKeys } from "@/lib/content/guidance/build-guidance-fields";
import { SmartFormShell } from "@/components/smart-form/SmartFormShell";
import { SmartResultPanel } from "@/components/smart-form/SmartResultPanel";
import { ResultLayerTabs } from "@/components/results/ResultLayerTabs";
import {
  buildPremiumSchemaExperienceFields,
  filterVisibleCalculatorFields,
  resolveCalculatorExperience,
} from "@/lib/ui-shared/calculator-experience/resolve-calculator-experience";
import type { CalculatorExperienceMode } from "@/lib/ui-shared/calculator-experience/calculator-experience-types";
import { DynamicSmartFormPilot } from "@/components/smart-form/DynamicSmartFormPilot";
import { buildSmartFormForTool } from "@/lib/features/smart-form/smart-form-adapter";
import { hasPremiumSmartFormDefinition } from "@/lib/features/smart-form/premium-smart-form-definitions";
import { RuntimeTrustTracePanel } from "@/components/tools/RuntimeTrustTracePanel";
import { CalculationFeedbackButton } from "@/components/feedback/CalculationFeedbackButton";
import { SmartFormValidationSummary } from "@/components/tools/smart-form/SmartFormValidationSummary";
import { SmartToolForm } from "@/components/tools/smart-form/SmartToolForm";
import { PremiumSchemaToolForm } from "@/components/tools/PremiumSchemaToolForm";
import {
 isPremiumFullLoopRuntimeSlug,
 runPremiumFullLoopCalculation,
 type PremiumFullLoopResult,
} from "@/lib/features/formula-governance/runtime-validation/premium-full-loop-bridge";
import {
  buildSmartFormInitialValues,
  validateSmartFormFieldValues,
} from "@/lib/features/formula-governance/runtime-validation/smart-form-contract-adapter";
import { getPremiumSchemaForPaidSlug } from "@/lib/features/premium-schema/schema-registry";
import {
  arePremiumToolInputsValid,
  calculatePremiumToolResult,
  type PremiumToolInputValues,
  type PremiumToolResult,
} from "@/lib/features/tools/premium-tool-results";
import { calculatePremiumDecisionReport } from "@/lib/features/tools/premium-decision-engine";
import {
 type RevenueTool,
 type RevenueToolInput,
 revenueLegalDisclaimer,
} from "@/lib/features/tools/revenue-tools";
import { evaluateRuntimeTrust } from "@/lib/features/tools/runtime-trust-engine";
import { ToolSafeReviewState } from "@/components/tools/ToolSafeReviewState";
import { HMI_CSS } from "@/lib/features/dynamic-form-v2/hmi-css";

const DownloadVerdictPdfButton = dynamic(
 () =>
 import("@/components/reports/DownloadVerdictPdfButton").then(
 (mod) => mod.DownloadVerdictPdfButton
 ),
 {
 ssr: false,
 loading: () => (
 <span className="inline-flex min-h-[44px] items-center text-sm text-text-secondary">
 Preparing PDF\u2026
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
 Loading save\u2026
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
     <div className="field span">
       <label htmlFor={inputId}>
         <span className="f-name">{input.label}{input.required ? " *" : null}</span>
       </label>
       <button type="button" className="choice" onClick={() => {}}>
         <span className="cv">{String(value)}</span>
         <span className="car">\u25be</span>
       </button>
       {input.helperText ? (
         <div className="ref">
           <span className="info" tabIndex={0}>i<span className="tip">{input.helperText}</span></span>
         </div>
       ) : null}
       {error ? <span className="err" style={{ display: "block" }} aria-live="assertive">{error}</span> : null}
     </div>
   );
 }

 const isCurrency = input.type === "currency";

 return (
   <div className={`field${isCurrency ? "" : ""} ${!showUnit ? "span" : ""}`}>
     <label htmlFor={inputId}>
       <span className="f-name">{input.label}{input.required ? " *" : null}</span>
     </label>
     <div className="ctrl">
       <input
         id={inputId}
         type="text"
         inputMode="decimal"
         autoComplete="off"
         value={String(value)}
         onChange={(event) => {
           const { numeric } = handleNumericInputChange(event.target.value);
           onChange(input.key, numeric);
         }}
         aria-invalid={Boolean(error)}
         aria-describedby={error ? errorId : helperId}
       />
       {isCurrency ? <span className="ubtn static">$</span> : showUnit ? <span className="ubtn static">{input.unit}</span> : null}
     </div>
     {input.helperText ? (
       <div className="ref">
         <span className="info" tabIndex={0}>i<span className="tip">{input.helperText}</span></span>
       </div>
     ) : null}
     {error ? <span className="err" style={{ display: "block" }} aria-live="assertive">{error}</span> : null}
   </div>
 );
}

interface PremiumToolPageProps {
 tool: RevenueTool;
 /** URL slug \u2014 funnel alias routes use governance runtime slug, not paidSlug. */
 routeSlug?: string;
}

export function PremiumToolPage({ tool, routeSlug }: PremiumToolPageProps) {
  const locale = useLocale();
  const tAuthority = useTranslations("contentAuthority.premium");
  const tPage = useTranslations("premiumSchemaPage");
  const t = useTranslations("freeTrafficCatalog");
  const categorySlug = useMemo(() => resolveToolCategory({ slug: tool.paidSlug }), [tool.paidSlug]);
  const categoryDetail = useMemo(() => getPremiumCatalogCategoryDetail(categorySlug, locale), [categorySlug, locale]);
  const categoryTitle = categoryDetail?.title ?? "Category";

  const featuredQuestion = `What does ${tool.paidTitle} analyze?`;
  const featuredAnswer = tool.paidValue;

  const authoritySchema = useMemo(() => ({
    id: tool.paidSlug,
    name: tool.paidTitle,
    sectorSlug: tool.sector,
    category: categorySlug,
    painStatement: tool.paidValue,
    assumptions: {
      assumptionNotes: [
        "Verify your inputs against real operational data, invoices, and contracts.",
        "SectorCalc Pro outputs are indicative and do not replace professional financial or engineering audits.",
        "Cost, time, and efficiency estimates depend on the precision of your input parameters."
      ]
    }
  }), [tool, categorySlug, locale]);

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
 const [utcTime, setUtcTime] = useState("");

 const usePremiumSmartForm = hasPremiumSmartFormDefinition(runtimeSlug);
 const isCncStochastic = tool.paidSlug === "cnc-quote-risk-analyzer";
 const schemaPilot = getPremiumSchemaForPaidSlug(tool.paidSlug);
 const smartFormAdapter = useMemo(
  () =>
   buildSmartFormForTool(runtimeSlug, { kind: "revenue", inputs: tool.paidInputs }),
  [runtimeSlug, tool.paidInputs],
 );
 const showSchemaPilot = Boolean(schemaPilot) && (!useFullLoopRuntime || !smartFormAdapter.ok);

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

 const visiblePaidInputs = tool.paidInputs;

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

  const submitDisabled = isCalculating || needsCreditLoad;
  const submitText = needsCreditLoad
    ? "Load credits to calculate"
    : (isCalculating ? "Calculating\u2026" : "Run calculation");

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

 // UTC clock
 useEffect(() => {
   const tick = () => setUtcTime("UTC \u00b7 " + new Date().toISOString().replace("T", " ").slice(0, 19));
   tick();
   const id = setInterval(tick, 1000);
   return () => clearInterval(id);
 }, []);

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

 const isOK = (result?.severity as string) === "LOW" || result?.verdict === "ACCEPTABLE";
 const isDanger = (result?.severity as string) === "HIGH" || result?.verdict === "REJECT";

 return (
 <PageLayout>
  <style>{HMI_CSS}</style>
  <section className="sc-craft-section">
  <Container size="wide" className="sc-craft-container sc-craft-container--wide min-w-0">
  {loading ? (
   <p className="text-sm text-body-charcoal">Loading access\u2026</p>
  ) : (
  <>
   <nav aria-label="Breadcrumb" className="mb-4 text-xs text-body-charcoal">
       <Link href="/pricing" prefetch={false} className="hover:underline">
         {locale === "tr" ? "Premium" : "Premium"}
       </Link>
       <span className="mx-1.5">/</span>
       <Link href={`/pricing?tool=${categorySlug}`} prefetch={false} className="hover:underline">
         {categoryTitle}
       </Link>
     <span className="mx-1.5">/</span>
     <span className="text-premium-velvet font-medium">{tool.paidTitle}</span>
   </nav>
  <SectorToolSelect tier="premium" currentSlug={tool.paidSlug} />
  <OsModuleHeader title={tool.paidTitle} tier="intelligence" slug={runtimeSlug} locale={locale} surface="premium" />
   <div className="my-5">
     <FeaturedAnswerBlock
       question={featuredQuestion}
       answer={featuredAnswer}
       bullets={[
         "Precise input parameters and tolerance checks",
         "Cost, time or quality loss analysis",
         "Professional reporting and data integration"
       ]}
     />
   </div>
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
    {hasCredits ? " \u2014 1 credit per premium run." : null}
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
     Load 5 credits \u2014 $4.99
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
  <PremiumSchemaToolForm schema={schemaPilot!} locale={locale} />
  {tool.paidInputs.length > 0 && (
  <div className="wrap" style={{ padding: "20px 0" }}>
   {/* STATUS STRIP */}
   <div className="status-strip">
     <div className="brand">
       <span className="led ok pulse" />
       <div>
         <div className="brand-mark">SECTORCALC PRO</div>
         <div className="brand-sub">Legacy Contract Engine \u00b7 {(tool.sector || "").toUpperCase()}</div>
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
   <div className="display-header">
     <div>
       <div className="module-id">MODULE \u00b7 {tool.paidSlug} \u00b7 PREMIUM</div>
       <h1>{tool.paidTitle}</h1>
       <div className="sub-cap">Legacy engine (PDF-compatible)</div>
     </div>
     <div className="meta">
       <div className="pill-row">
         <span className="pill pro">PREMIUM</span>
         <span className="pill">{result ? result.verdict : "\u2014"}</span>
       </div>
     </div>
   </div>
   <div className="grid">
     <main>
       <form onSubmit={handleSubmit} noValidate data-calculation-form="true">
         {tool.paidInputs.map((input, idx) => {
           const value = values[input.key] ?? (input.type === "select" ? "" : 0);
           return (
             <div key={input.key} className="group">
               <div className="group-head">
                 <span className="led ok group-led" />
                 <span className="group-letter">INP \u00b7 {String.fromCharCode(65 + idx)}.01</span>
                 <span className="group-title">{input.label}</span>
                 <span className="group-count">1 CH</span>
               </div>
               <div className="fields">
                 <PremiumToolInputField
                   input={input}
                   value={value}
                   error={errors[input.key]}
                   onChange={handleChange}
                 />
               </div>
             </div>
           );
         })}
         <div className="exec-panel">
           <div className="exec-status">
             <span className={`led ${result ? "ok" : "off"}`} />
             <div>
               <div><b>{result ? "COMMITTED" : "READY"}</b></div>
               <div className="tx">{(hasCalculated) ? `Last \u00b7 ${tool.paidSlug}` : "Enter inputs below"}</div>
             </div>
           </div>
           <button type="submit" disabled={submitDisabled || creditPending} className="btn-exec">
             <span>{submitText}</span>
             <span className="kbd">F9</span>
           </button>
         </div>
       </form>
     </main>
     <aside className="rail">
       {/* Decision */}
       <div className={`decision ${isDanger ? "review" : isOK ? "ok" : ""}`}>
         <div className="d-label">PRIMARY READOUT \u00b7 STATUS</div>
         {result ? (
           <>
             <div className="d-text">{result.primaryMetricValue}</div>
             <div className="d-sub">{result.verdict} \u00b7 {result.headline}</div>
           </>
         ) : (
           <div className="d-text" style={{ fontSize: "14px", color: "var(--ink-50)" }}>{"\u2014"}</div>
         )}
       </div>

       {/* Full-loop blockers */}
       {useFullLoopRuntime && submitted && fullLoopResult?.status === "blocked" ? (
         <div className="card readout">
           <h3>VALIDATION</h3>
           <div className="readout">
             <SmartFormValidationSummary
               title="Calculation blocked"
               blockers={fullLoopResult.blockers}
             />
           </div>
           {hasFullPremiumFeatures && fullLoopResult ? (
             <RuntimeTrustTracePanel trustTrace={fullLoopResult.trustTrace} />
           ) : null}
         </div>
       ) : null}

       {/* Analysis output */}
       {decisionReport && result ? (
         <>
           <div className="card readout">
             <h3>PRIMARY READOUTS</h3>
             <div className="readout">
               <PremiumAnalyzerReportPanel report={decisionReport} />
             </div>
           </div>
           <div className="card readout">
             <h3>ACTIONS & EXPORT</h3>
             <div className="readout">
               {hasFullPremiumFeatures && verdictReportData ? (
                 <div className="blk">
                   <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                     <DownloadVerdictPdfButton
                       data={verdictReportData}
                       slug={tool.paidSlug}
                       severity={result.severity}
                     />
                     {user ? (
                       <SaveVerdictReportButton uid={user.uid} tool={tool} values={values} result={result} />
                     ) : null}
                   </div>
                 </div>
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
                 <div className="blk">
                   <PremiumDecisionReportPanel
                     variant="stochastic"
                     sector={tool.sector}
                     inputs={toStochasticInputs(values)}
                     inputsReady={arePremiumToolInputsValid(tool, values)}
                     toolSlug={tool.paidSlug}
                     toolTitle={tool.paidTitle}
                   />
                 </div>
               ) : null}
             </div>
           </div>
         </>
       ) : null}

       {/* No result state */}
       {!submitted && !result ? (
         <div className="card readout">
           <h3>ENGINEERING DIAGNOSTICS</h3>
           <div className="readout" style={{ color: "var(--ink-50)", fontSize: "11px", fontFamily: "var(--mono)", letterSpacing: ".08em", textTransform: "uppercase" }}>
             Enter job inputs and run the calculation.
           </div>
         </div>
       ) : null}

       {/* Export */}
       <button className="btn-export" onClick={() => window.print()}>{"\u2398"} EXPORT REPORT</button>
     </aside>
   </div>
  </div>
  )}
  </>
  ) : (
  <>
   {/* HMI form for premium */}
   <div className="wrap" style={{ padding: "20px 0" }}>
     <div className="status-strip">
       <div className="brand">
         <span className="led ok pulse" />
         <div>
           <div className="brand-mark">SECTORCALC PRO</div>
           <div className="brand-sub">Premium Analysis Engine \u00b7 {(tool.sector || "").toUpperCase()}</div>
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
     <div className="display-header">
       <div>
         <div className="module-id">MODULE \u00b7 {tool.paidSlug} \u00b7 PREMIUM</div>
         <h1>{tool.paidTitle}</h1>
         <div className="sub-cap">{tool.paidValue}</div>
       </div>
       <div className="meta">
         <div className="pill-row">
           <span className="pill pro">PREMIUM</span>
           <span className="pill">RISK \u00b7 {result ? result.verdict : "\u2014"}</span>
         </div>
         <div className="stds">
           <span className="std">Sector: {tool.sector}</span>
         </div>
       </div>
     </div>
     <div className="grid">
       <main>
         <form
           onSubmit={handleSubmit}
           noValidate
           data-calculation-form="true"
         >
           {(useFullLoopRuntime && smartFormAdapter.ok && !usePremiumSmartForm) ? (
             <>
               {tool.paidInputs.map((input, idx) => {
                 const value = values[input.key] ?? (input.type === "select" ? "" : 0);
                 return (
                   <div key={input.key} className="group">
                     <div className="group-head">
                       <span className="led ok group-led" />
                       <span className="group-letter">INP \u00b7 {String.fromCharCode(65 + idx)}.01</span>
                       <span className="group-title">{input.label}</span>
                       <span className="group-count">1 CH</span>
                     </div>
                     <div className="fields">
                       <PremiumToolInputField
                         input={input}
                         value={value}
                         error={errors[input.key]}
                         onChange={handleChange}
                       />
                     </div>
                   </div>
                 );
               })}
             </>
           ) : usePremiumSmartForm ? (
             <div className="group">
               <div className="group-head">
                 <span className="led ok group-led" />
                 <span className="group-letter">SMART</span>
                 <span className="group-title">Smart Form Inputs</span>
                 <span className="group-count">AUTO</span>
               </div>
               <div className="fields">
                 <div className="field span">
                   <DynamicSmartFormPilot
                     slug={runtimeSlug}
                     values={values}
                     errors={errors}
                     onChange={handleChange}
                     onSubmit={handleSubmit}
                     calculateLabel={submitText}
                     isCalculating={isCalculating}
                     disabled={submitDisabled}
                   />
                 </div>
               </div>
             </div>
           ) : (
             <>
               {visiblePaidInputs.map((input, idx) => {
                 const value = values[input.key] ?? (input.type === "select" ? "" : 0);
                 return (
                   <div key={input.key} className="group">
                     <div className="group-head">
                       <span className="led ok group-led" />
                       <span className="group-letter">INP \u00b7 {String.fromCharCode(65 + idx)}.01</span>
                       <span className="group-title">{input.label}</span>
                       <span className="group-count">1 CH</span>
                     </div>
                     <div className="fields">
                       <PremiumToolInputField
                         input={input}
                         value={value}
                         error={errors[input.key]}
                         onChange={handleChange}
                       />
                     </div>
                   </div>
                 );
               })}
             </>
           )}
           <div className="exec-panel">
             <div className="exec-status">
               <span className={`led ${result ? "ok" : "off"}`} />
               <div>
                 <div><b>{result ? "COMMITTED" : "READY"}</b></div>
                 <div className="tx">{hasCalculated ? `Last \u00b7 ${tool.paidSlug}` : "Enter inputs below"}</div>
               </div>
             </div>
             <button type="submit" disabled={submitDisabled || creditPending} className="btn-exec">
               <span>{submitText}</span>
               <span className="kbd">F9</span>
             </button>
           </div>
         </form>
       </main>
       <aside className="rail">
         {/* Decision */}
         <div className={`decision ${isDanger ? "review" : isOK ? "ok" : ""}`}>
           <div className="d-label">PRIMARY READOUT \u00b7 STATUS</div>
           {result ? (
             <>
               <div className="d-text">{result.primaryMetricValue}</div>
               <div className="d-sub">{result.verdict} \u00b7 {result.headline}</div>
             </>
           ) : (
             <div className="d-text" style={{ fontSize: "14px", color: "var(--ink-50)" }}>{"\u2014"}</div>
           )}
         </div>

         {/* Analysis output */}
         {decisionReport && result ? (
           <>
             <div className="card readout">
               <h3>PRIMARY READOUTS</h3>
               <div className="readout">
                 <PremiumAnalyzerReportPanel report={decisionReport} />
               </div>
             </div>
             <div className="card readout">
               <h3>ACTIONS & EXPORT</h3>
               <div className="readout">
                 {hasFullPremiumFeatures && verdictReportData ? (
                   <div className="blk">
                     <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                       <DownloadVerdictPdfButton
                         data={verdictReportData}
                         slug={tool.paidSlug}
                         severity={result.severity}
                       />
                       {user ? (
                         <SaveVerdictReportButton uid={user.uid} tool={tool} values={values} result={result} />
                       ) : null}
                     </div>
                   </div>
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
                   <div className="blk">
                     <PremiumDecisionReportPanel
                       variant="stochastic"
                       sector={tool.sector}
                       inputs={toStochasticInputs(values)}
                       inputsReady={arePremiumToolInputsValid(tool, values)}
                       toolSlug={tool.paidSlug}
                       toolTitle={tool.paidTitle}
                     />
                   </div>
                 ) : null}
               </div>
             </div>
             {/* Pro decision panel */}
             <div className="card readout">
               <h3>DECISION ANALYSIS</h3>
               <div className="readout">
                 <ProDecisionPanel
                   values={values}
                   result={result}
                   locale={locale}
                   toolSlug={tool.paidSlug}
                   toolTitle={tool.paidTitle}
                 />
               </div>
             </div>
           </>
         ) : null}

         {/* No result state */}
         {!submitted && !result ? (
           <div className="card readout">
             <h3>ENGINEERING DIAGNOSTICS</h3>
             <div className="readout" style={{ color: "var(--ink-50)", fontSize: "11px", fontFamily: "var(--mono)", letterSpacing: ".08em", textTransform: "uppercase" }}>
               Enter job inputs and run the calculation.
             </div>
           </div>
         ) : null}

         {/* Export */}
         <button className="btn-export" onClick={() => window.print()}>{"\u2398"} EXPORT REPORT</button>
       </aside>
     </div>
   </div>
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
  <section className="border-t border-technical-gray/20 bg-white pb-10">
    <Container className="max-w-4xl">
      <PremiumAnalyzerAuthorityBlock
        schema={authoritySchema as any}
        locale={locale}
        displayName={tool.paidTitle}
        displayPain={tool.paidValue}
        labels={{
          whenToUseTitle: tAuthority("whenToUseTitle"),
          whenToUseBody: tAuthority("whenToUseBody"),
          measuresTitle: tAuthority("measuresTitle"),
          promiseTitle: tAuthority("promiseTitle"),
          promiseBody: tAuthority("promiseBody"),
          decidesTitle: tAuthority("decidesTitle"),
          decidesBody: tAuthority("decidesBody"),
          reportTitle: tAuthority("reportTitle"),
          reportBullet1: tAuthority("reportBullet1"),
          reportBullet2: tAuthority("reportBullet2"),
          reportBullet3: tAuthority("reportBullet3"),
          reportBullet4: tAuthority("reportBullet4"),
          previewExcludesTitle: tAuthority("previewExcludesTitle"),
          previewExcludesBody: tAuthority("previewExcludesBody"),
          assumptionsTitle: tAuthority("assumptionsTitle"),
          faqTitle: tAuthority("faqTitle"),
          faqMeasureTitle: tAuthority("faqMeasureTitle"),
          faqReportTitle: tAuthority("faqReportTitle"),
          faqErpTitle: tAuthority("faqErpTitle"),
          faqMeasureAnswer: tAuthority("faqMeasureAnswer", { name: tool.paidTitle }),
          faqReportAnswer: tAuthority("faqReportAnswer"),
          faqErpAnswer: tAuthority("faqErpAnswer"),
          relatedGuideTitle: tAuthority("relatedGuideTitle"),
          relatedFreeTitle: tAuthority("relatedFreeTitle"),
          relatedHubTitle: tAuthority("relatedHubTitle"),
          relatedIndustryTitle: tAuthority("relatedIndustryTitle"),
          pricingCta: tAuthority("pricingCta"),
        }}
     />
   </Container>
  </section>
  <section className="border-t border-technical-gray/40 bg-off-white">
    <Container>
      <ExpertAuthoritySection toolName={tool.paidTitle} />
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
