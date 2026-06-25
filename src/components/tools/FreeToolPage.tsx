"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { formatSmartFormFieldError } from "@/lib/i18n/smart-form-validation-i18n";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/routing";
import { FreeToolAuthorityBlock } from "@/components/content/FreeToolAuthorityBlock";
import { resolveToolCategory } from "@/lib/catalog/resolve-tool-category";
import { getPremiumCatalogCategoryDetail } from "@/lib/premium/premium-category-resolver";
import { CalculationFeedbackButton } from "@/components/feedback/CalculationFeedbackButton";
import { SmartFormBridgeRenderer } from "@/components/tools/smart-form/SmartFormBridgeRenderer";
import { stripLocalePrefix } from "@/i18n/locales";
import { buildSmartFormPilotCalculationPayload } from "@/components/tools/smart-form/build-smart-form-pilot-calculation-payload";
import type { PilotFieldValues } from "@/components/tools/smart-form/pilot-calculation-payload";
import { PageLayout } from "@/components/layout/PageLayout";
import { OsModuleHeader } from "@/components/os/OsModuleHeader";
import { SectorToolSelect } from "@/components/os/SectorToolSelect";
import { Container } from "@/components/ui/Container";
import { LedgerNumberTick } from "@/components/ui/LedgerNumberTick";
import { handleNumericInputChange } from "@/lib/input/numeric-input";
import {
  CalculatorCurrencyPrefix,
  CalculatorUnitSelect,
} from "@/components/tools/CalculatorUnitCurrencyControls";
import {
  trackSmartFormPilotCompleted,
  trackSmartFormPilotStarted,
} from "@/components/tools/smart-form/smart-form-pilot-analytics";
import { riskLevelToStatus, STATUS_TEXT_CLASS } from "@/lib/ui/status-colors";
import { trackConversionEvent } from "@/lib/analytics/conversion-funnel";
import { useAttributionContext } from "@/lib/analytics/use-attribution-context";
import {
 REVENUE_EVENTS,
 trackRevenueEvent,
} from "@/lib/analytics/revenue-events";
import {
 areFreeToolInputsValid,
 calculateFreeToolResult,
 type FreeToolInputValues,
 type FreeToolResult,
} from "@/lib/tools/free-tool-results";
import type { SmartFormUiBridgeManifest } from "@/lib/formula-governance/smart-form-ui-bridge/smart-form-ui-bridge-types";
import { type RevenueTool, type RevenueToolInput } from "@/lib/tools/revenue-tools";
import { useGuidanceFieldFocus } from "@/components/guidance/GuidanceContext";
import { SmartFormWorkspace } from "@/components/smart-form/SmartFormWorkspace";
import { SmartFormValidationSummary } from "@/components/tools/smart-form/SmartFormValidationSummary";
import { SmartToolForm } from "@/components/tools/smart-form/SmartToolForm";
import { runFreeFullLoopCalculation, type FreeFullLoopResult } from "@/lib/formula-governance/runtime-validation/free-full-loop-bridge";
import { isFreeFullLoopRuntimeSlug } from "@/lib/formula-governance/runtime-validation/full-loop-runtime-registry";
import {
  buildSmartFormInitialValues,
  validateSmartFormFieldValues,
} from "@/lib/formula-governance/runtime-validation/smart-form-contract-adapter";
import { evaluateRuntimeTrust } from "@/lib/tools/runtime-trust-engine";
import { ToolSafeReviewState } from "@/components/tools/ToolSafeReviewState";


function buildInitialValues(tool: RevenueTool): FreeToolInputValues {
  const values: FreeToolInputValues = {};
  for (const input of tool.freeInputs) {
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

function validationMessage(
  input: RevenueToolInput,
  value: number | string,
  locale: string,
): string {
  if (input.type === "select") {
    return formatSmartFormFieldError(locale, "required", { label: input.label });
  }
  const numeric = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(numeric) || numeric <= 0) {
    return formatSmartFormFieldError(locale, "invalidNumber", { label: input.label });
  }
  return formatSmartFormFieldError(locale, "invalidNumber", { label: input.label });
}

interface FreeToolInputFieldProps {
 input: RevenueToolInput;
 value: number | string;
 error?: string;
 onChange: (key: string, value: number | string) => void;
}

const getPlaceholderForRevenueInput = (input: RevenueToolInput) => {
  if (input.type === "currency") return "1,000";
  if (input.type === "percent") return "15";
  const k = input.key.toLowerCase();
  if (k.includes("year") || k.includes("month") || k.includes("day") || k.includes("period")) return "12";
  return "100";
};

function FreeToolInputField({
 input,
 value,
 error,
 onChange,
}: FreeToolInputFieldProps) {
 const { onFocus, onBlur } = useGuidanceFieldFocus(input.key);
 const inputId = `free-tool-${input.key}`;
 const errorId = `${inputId}-error`;
 const isCurrency = input.type === "currency";
 const showUnit = Boolean(input.unit) && !isCurrency;

 if (input.type === "select" && input.options) {
 return (
 <div className="sc-industrial-field sc-form-field">
 <div className="sc-industrial-field__label-row">
 <label htmlFor={inputId} className="sc-ledger-label sc-industrial-field__label">
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
 aria-describedby={error ? errorId : undefined}
 className={error ? "sc-industrial-input--error" : undefined}
 >
 {input.options.map((option) => (
 <option key={option.value} value={option.value}>
 {option.label}
 </option>
 ))}
 </select>
 {error ? (
 <p id={errorId} className="sc-industrial-field__error" role="alert">
 {error}
 </p>
 ) : null}
 </div>
 );
 }

 return (
 <div className="sc-industrial-field sc-form-field">
 <div className="sc-industrial-field__label-row">
 <label htmlFor={inputId} className="sc-ledger-label sc-industrial-field__label">
 {input.label}
 {input.required ? <span aria-hidden> *</span> : null}
 </label>
 {showUnit ? <span className="sc-industrial-field__unit">{input.unit}</span> : null}
 </div>
 <div className="flex min-w-0 items-stretch gap-2">
 <div className="relative min-w-0 flex-1">
 {isCurrency ? <CalculatorCurrencyPrefix currency={input.unit} /> : null}
 <input
 id={inputId}
 type="text"
 inputMode="decimal"
 autoComplete="off"
 placeholder={getPlaceholderForRevenueInput(input)}
 value={String(value)}
 onFocus={onFocus}
 onBlur={onBlur}
 onChange={(event) => {
 const { numeric } = handleNumericInputChange(event.target.value);
 onChange(input.key, numeric);
 }}
 aria-invalid={Boolean(error)}
 aria-describedby={error ? errorId : undefined}
 className={`sc-ledger-input-underline w-full${isCurrency ? " pl-5" : ""}${error ? " sc-ledger-input--error" : ""}`}
 />
 </div>
 <CalculatorUnitSelect
   inputId={inputId}
   fieldKey={input.key}
   explicitUnit={input.unit}
   isCurrency={isCurrency}
 />
 </div>
 {error ? (
 <p id={errorId} className="sc-industrial-field__error" role="alert">
 {error}
 </p>
 ) : null}
 </div>
 );
}

function FreeToolResultCard({ result }: { result: FreeToolResult }) {
 const status = riskLevelToStatus(result.riskLevel);
 const primaryClass =
  status === "safe"
   ? "sc-result-primary sc-result-primary--safe"
   : status === "warning"
     ? "sc-result-primary sc-result-primary--warn"
     : status === "critical"
       ? "sc-result-primary sc-result-primary--danger"
       : "sc-result-primary";

 return (
 <div className="sc-ledger-result sc-result-panel sc-ledger-letterpress" aria-live="polite">
 <p className="sc-ledger-eyebrow">Quick tally</p>
 <p className={`mt-2 text-base font-semibold leading-snug ${STATUS_TEXT_CLASS[status]}`} data-status={status}>
 {result.headline}
 </p>
 <LedgerNumberTick value={result.summary} className={`mt-3 ${primaryClass}`} />
 </div>
 );
}

interface FreeToolPageProps {
 tool: RevenueTool;
 featuredAnswer?: ReactNode;
 smartFormPilotManifest?: SmartFormUiBridgeManifest | null;
 surfaceTier?: "free" | "premium";
}

export function FreeToolPage({
 tool,
 featuredAnswer,
 smartFormPilotManifest,
 surfaceTier = "free",
}: FreeToolPageProps) {
 const locale = useLocale();
 const tAuthority = useTranslations("contentAuthority.freeTool");
 const tPremiumAuthority = useTranslations("contentAuthority.premium");
 const categorySlug = useMemo(() => resolveToolCategory({ slug: tool.freeSlug }), [tool.freeSlug]);
 const categoryDetail = useMemo(() => getPremiumCatalogCategoryDetail(categorySlug, locale), [categorySlug, locale]);
 const categoryTitle = categoryDetail?.title ?? "Category";

 const mockTrafficTool = useMemo(() => ({
   slug: tool.freeSlug,
   title: tool.freeTitle,
   description: tool.painStatement,
   category: "finance-business" as any, // default fallback
   inputs: tool.freeInputs.map(input => ({
     key: input.key,
     label: input.label,
     type: input.type,
     unit: input.unit,
     helper: input.helperText || ""
   })),
   relatedPremiumSlug: tool.paidSlug
 }), [tool]);

 const tUi = useTranslations("freeToolUi");
 const tCalc = useTranslations("calculator");
 const pathname = usePathname();
 const attribution = useAttributionContext();
 const pagePath = stripLocalePrefix(pathname);
 const useSmartFormPilot = Boolean(smartFormPilotManifest);
 const useFullLoopRuntime = isFreeFullLoopRuntimeSlug(tool.freeSlug);

 const [values, setValues] = useState<FreeToolInputValues>(() =>
 useFullLoopRuntime
  ? buildSmartFormInitialValues(tool.freeSlug)
  : buildInitialValues(tool)
 );
 const [submitted, setSubmitted] = useState(false);
 const [isCalculating, setIsCalculating] = useState(false);
 const [errors, setErrors] = useState<Record<string, string>>({});
 const [fullLoopResult, setFullLoopResult] = useState<FreeFullLoopResult | null>(null);
 const [pilotErrors, setPilotErrors] = useState<Record<string, string>>({});
 const [pilotValues, setPilotValues] = useState<FreeToolInputValues | null>(null);
 const startedTracked = useRef(false);
 const formRef = useRef<HTMLFormElement>(null);
 const runtimeTrust = useMemo(
  () =>
   evaluateRuntimeTrust({
    slug: tool.freeSlug,
    locale,
    surface: surfaceTier,
    premiumSurfaceUsesFreeCopy: surfaceTier === "premium",
   }),
  [tool.freeSlug, locale, surfaceTier],
 );
 const showCalculationSurface = runtimeTrust.calculationEligible;

 useEffect(() => {
  trackConversionEvent({
   stage: "tool_open",
   eventName: "free_tool_open",
   locale,
   pagePath,
   toolSlug: tool.freeSlug,
   campaignId: attribution.utmCampaign,
   source: attribution.utmSource,
   medium: attribution.utmMedium,
   valueType: "free",
   category: tool.sector,
  });
 }, [
  attribution.utmCampaign,
  attribution.utmMedium,
  attribution.utmSource,
  locale,
  pagePath,
  tool.freeSlug,
  tool.sector,
 ]);

 const result = useMemo(() => {
 if (!submitted) {
 return null;
 }
 if (useFullLoopRuntime && fullLoopResult?.status === "success" && fullLoopResult.revenueResult) {
 return fullLoopResult.revenueResult;
 }
 const calculationValues = useSmartFormPilot && pilotValues ? pilotValues : values;
 return calculateFreeToolResult(tool, calculationValues);
 }, [fullLoopResult, submitted, tool, useFullLoopRuntime, useSmartFormPilot, pilotValues, values]);

 const feedbackInputSnapshot = useMemo(
  () => ({ ...values }),
  [values]
 );
 const feedbackResultSnapshot = useMemo(() => {
  if (!result) {
   return undefined;
  }
  return {
   headline: result.headline,
   summary: result.summary,
   riskLevel: result.riskLevel,
  };
 }, [result]);

 const handlePilotCalculate = (fieldValues: PilotFieldValues) => {
  if (!showCalculationSurface) {
   return;
  }
  if (!smartFormPilotManifest) {
   return;
  }

  const pilotSlug = smartFormPilotManifest.slug;

  if (!startedTracked.current) {
   startedTracked.current = true;
   trackSmartFormPilotStarted(pilotSlug);
  }

  const { payload, errors: nextPilotErrors, supported } = buildSmartFormPilotCalculationPayload({
   slug: pilotSlug,
   fieldValues,
   manifest: smartFormPilotManifest,
  });
  if (!supported || !payload) {
   setPilotErrors(nextPilotErrors);
   setSubmitted(false);
   return;
  }

  setPilotErrors({});
  setPilotValues(payload);
  setIsCalculating(true);
  setSubmitted(false);
  window.setTimeout(() => {
   setIsCalculating(false);
   setSubmitted(true);
   trackSmartFormPilotCompleted(pilotSlug);
  }, 400);
 };

 const handlePilotStarted = () => {
  if (!smartFormPilotManifest || startedTracked.current) {
   return;
  }
  startedTracked.current = true;
  trackSmartFormPilotStarted(smartFormPilotManifest.slug);
 };

 const handleChange = (key: string, value: number | string) => {
 if (!startedTracked.current) {
 startedTracked.current = true;
 trackRevenueEvent(REVENUE_EVENTS.free_tool_started, {
 toolSlug: tool.freeSlug,
 });
 }
 setValues((prev) => ({ ...prev, [key]: value }));
 setSubmitted(false);
 setErrors((prev) => {
 const next = { ...prev };
 delete next[key];
 return next;
 });
 };

 const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
 event.preventDefault();
 if (!showCalculationSurface) {
  return;
 }

 if (useFullLoopRuntime) {
  if (!startedTracked.current) {
   startedTracked.current = true;
   trackRevenueEvent(REVENUE_EVENTS.free_tool_started, {
    toolSlug: tool.freeSlug,
   });
  }

  const nextErrors = validateSmartFormFieldValues(tool.freeSlug, values, locale);
  setErrors(nextErrors);
  if (Object.keys(nextErrors).length > 0) {
   setSubmitted(false);
   setFullLoopResult(null);
   const firstKey = Object.keys(nextErrors)[0];
   if (firstKey && formRef.current) {
    const el = formRef.current.querySelector(`#smart-form-${firstKey}`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
   }
   return;
  }
  setErrors({});

  const loopResult = runFreeFullLoopCalculation(tool.freeSlug, values);
  setFullLoopResult(loopResult);
  if (loopResult.status === "blocked") {
   setSubmitted(false);
   setIsCalculating(false);
   return;
  }

  setIsCalculating(true);
  setSubmitted(false);
  window.setTimeout(() => {
   setIsCalculating(false);
   setSubmitted(true);
   trackRevenueEvent(REVENUE_EVENTS.free_tool_completed, {
    toolSlug: tool.freeSlug,
   });
   trackConversionEvent({
    stage: "calculation",
    eventName: "free_tool_calculate",
    locale,
    pagePath,
    toolSlug: tool.freeSlug,
    campaignId: attribution.utmCampaign,
    source: attribution.utmSource,
    medium: attribution.utmMedium,
    valueType: "free",
    category: tool.sector,
   });
  }, 0);
  return;
 }

 if (!areFreeToolInputsValid(tool, values)) {
 const nextErrors: Record<string, string> = {};
 for (const input of tool.freeInputs) {
 if (!input.required) {
 continue;
 }
 const value = values[input.key] ?? (input.type === "select" ? "" : 0);
 if (input.type === "select") {
 if (typeof value !== "string" || value === "") {
 nextErrors[input.key] = validationMessage(input, value, locale);
 }
 continue;
 }
 const numericString = typeof value === "string" ? value.replace(/,/g, '.') : String(value);
 const numeric = typeof value === "number" ? value : Number(numericString);
 if (
 typeof numeric !== "number" ||
 !Number.isFinite(numeric) ||
 numeric <= 0
 ) {
 nextErrors[input.key] = validationMessage(input, value, locale);
 }
 }
 setErrors(nextErrors);
 setSubmitted(false);
 const firstKey = Object.keys(nextErrors)[0];
 if (firstKey && formRef.current) {
 const el = formRef.current.querySelector(`#free-tool-${firstKey}`);
 el?.scrollIntoView({ behavior: "smooth", block: "center" });
 }
 return;
 }
 setErrors({});

 setIsCalculating(true);
 setSubmitted(false);
 window.setTimeout(() => {
 setIsCalculating(false);
 setSubmitted(true);
 trackRevenueEvent(REVENUE_EVENTS.free_tool_completed, {
 toolSlug: tool.freeSlug,
 });
 trackConversionEvent({
  stage: "calculation",
  eventName: "free_tool_calculate",
  locale,
  pagePath,
  toolSlug: tool.freeSlug,
  campaignId: attribution.utmCampaign,
  source: attribution.utmSource,
  medium: attribution.utmMedium,
  valueType: "free",
  category: tool.sector,
 });
 }, 400);
 };

 return (
 <PageLayout>
 <section className="sc-craft-section">
 <Container size="wide" className="sc-craft-container sc-craft-container--wide min-w-0">
  {surfaceTier === "premium" && (
    <nav aria-label="Breadcrumb" className="mb-4 text-xs text-body-charcoal">
      <Link href="/pricing" prefetch={false} className="hover:underline">
        {locale === "tr" ? "Premium Araçlar" : "Premium"}
      </Link>
      <span className="mx-1.5">/</span>
      <Link href={`/pricing?tool=${categorySlug}`} prefetch={false} className="hover:underline">
        {categoryTitle}
      </Link>
      <span className="mx-1.5">/</span>
      <span className="text-premium-velvet font-medium">{tool.freeTitle}</span>
    </nav>
  )}
 <SectorToolSelect tier="free" currentSlug={tool.freeSlug} />
 <OsModuleHeader title={tool.freeTitle} tier="utility" slug={tool.freeSlug} locale={locale} surface={surfaceTier} />

 {featuredAnswer ? <div className="mt-5">{featuredAnswer}</div> : null}

 {!showCalculationSurface ? (
  <ToolSafeReviewState slug={tool.freeSlug} locale={locale} findings={runtimeTrust.findings} />
 ) : (
 <div className="sc-ledger-cetele sc-ledger-cetele--stacked sc-tool-workspace sc-tool-workspace--stacked mt-4">
  <SmartFormWorkspace
   toolSlug={tool.freeSlug}
   tier="free"
   title={tool.freeTitle}
   description={tool.painStatement}
   toolSector={tool.sector}
   inputConfig={{ kind: "revenue", inputs: tool.freeInputs }}
   values={values}
   errors={errors}
   onChange={handleChange}
   onSubmit={handleSubmit}
   calculateLabel={isCalculating ? tUi("calculating") : tCalc("calculate")}
   isCalculating={isCalculating}
   forceFallback={Boolean(useSmartFormPilot && smartFormPilotManifest)}
   nativeContractForm={useFullLoopRuntime}
   formFallback={
    useSmartFormPilot && smartFormPilotManifest ? (
     <SmartFormBridgeRenderer
      manifest={smartFormPilotManifest}
      calculationConnected
      isCalculating={isCalculating}
      fieldErrors={pilotErrors}
      onPilotCalculate={handlePilotCalculate}
      onPilotStarted={handlePilotStarted}
     />
    ) : useFullLoopRuntime ? (
     <SmartToolForm
      slug={tool.freeSlug}
      values={values}
      errors={errors}
      onChange={handleChange}
      onSubmit={handleSubmit}
      calculateLabel={isCalculating ? tUi("calculating") : tCalc("calculate")}
      blocked={fullLoopResult?.status === "blocked"}
      blockers={fullLoopResult?.status === "blocked" ? fullLoopResult.blockers : []}
      isCalculating={isCalculating}
     />
    ) : (
      <form
       ref={formRef}
       onSubmit={handleSubmit}
       className="sc-form-shell sc-ledger-cetele__form sc-ledger-cetele-form sc-ledger-panel sc-industrial-panel sc-ledger-letterpress p-4 sm:p-5"
       noValidate
       data-calculation-form="true"
      >
       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {tool.freeInputs.map((input) => (
         <FreeToolInputField
          key={input.key}
          input={input}
          value={values[input.key] ?? (input.type === "select" ? "" : 0)}
          error={errors[input.key]}
          onChange={handleChange}
         />
        ))}
       </div>
       <div className="sc-industrial-form-actions mt-4">
        <button
         type="submit"
         disabled={isCalculating}
         className="sc-cta-primary disabled:opacity-60"
        >
         {isCalculating ? tUi("calculating") : tCalc("calculate")}
        </button>
       </div>
      </form>
    )
   }
   resultPanel={
    <>
     {fullLoopResult?.status === "blocked" ? (
      <SmartFormValidationSummary
       title={tUi("analysisBlockedTitle")}
       blockers={fullLoopResult.blockers}
      />
     ) : null}
     {isCalculating ? (
      <p className="text-sm text-body-charcoal">{tUi("calculating")}</p>
     ) : null}
     {!isCalculating && result ? (
      <>
       <FreeToolResultCard result={result} />
      </>
     ) : null}
     {!isCalculating && !result && fullLoopResult?.status !== "blocked" ? (
      <p className="text-sm text-body-charcoal">
       {useSmartFormPilot ? tUi("pilotAwaiting") : tCalc("awaiting")}
      </p>
     ) : null}
    </>
   }
   hasCalculated={submitted && !isCalculating && result !== null}
   resultSummary={result ? {
    primaryValue: result.summary,
    status: result.riskLevel === "LOW" ? "safe" : result.riskLevel === "MEDIUM" ? "watch" : "danger",
    actionRecommendation: result.headline,
   } : null}
   trustTraceSlot={undefined}
  />
   <CalculationFeedbackButton
    toolSlug={tool.freeSlug}
    toolType={surfaceTier === "premium" ? "premium" : "free"}
    locale={locale}
    routePath={pagePath}
    inputSnapshot={feedbackInputSnapshot}
    resultSnapshot={feedbackResultSnapshot}
   />
   {surfaceTier === "premium" && (
     <div className="mt-8 border-t border-technical-gray/20 pt-6">
       <FreeToolAuthorityBlock
         tool={mockTrafficTool as any}
         locale={locale}
         localizedTitle={tool.freeTitle}
         localizedDescription={tool.painStatement}
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
           faqTitle: tPremiumAuthority("faqTitle"),
           faqUseTitle: tPremiumAuthority("faqMeasureTitle"),
           faqFreeTitle: tPremiumAuthority("faqIsFreeTitle"),
           faqPremiumTitle: tPremiumAuthority("faqPremiumTitle"),
           faqUseAnswer: tPremiumAuthority("faqMeasureAnswer", { name: tool.freeTitle }),
           faqFreeAnswer: tPremiumAuthority("faqIsFreeAnswer"),
           faqPremiumAnswer: tPremiumAuthority("faqPremiumAnswer"),
           relatedGuideTitle: tAuthority("relatedGuideTitle"),
           relatedHubTitle: tAuthority("relatedHubTitle"),
           relatedPremiumTitle: tAuthority("relatedPremiumTitle"),
           relatedPremiumCta: tAuthority("relatedPremiumCta"),
         }}
       />
     </div>
   )}
 </div>
 )}
 </Container>
 </section>
 </PageLayout>
 );
}
