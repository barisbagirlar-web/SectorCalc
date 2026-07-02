"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { useLocale, useTranslations } from "@/lib/i18n-stub";
import { formatSmartFormFieldError } from "@/lib/infrastructure/i18n/smart-form-validation-i18n";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { FreeToolAuthorityBlock } from "@/components/content/FreeToolAuthorityBlock";
import { ExpertAuthoritySection } from "@/components/content/ExpertAuthoritySection";
import { resolveToolCategory } from "@/lib/catalog/resolve-tool-category";
import { getPremiumCatalogCategoryDetail } from "@/lib/features/premium/premium-category-resolver";
import { CalculationFeedbackButton } from "@/components/feedback/CalculationFeedbackButton";
import { SmartFormBridgeRenderer } from "@/components/tools/smart-form/SmartFormBridgeRenderer";
import { FreeToolPremiumCalculator } from "@/components/tools/FreeToolPremiumCalculator";
import type { PremiumInputDef, PremiumFormulaRow, PremiumValidationRule, PremiumResultRow, PremiumWarning } from "@/components/tools/FreeToolPremiumCalculator";
import { stripLocalePrefix } from "@/i18n/locales";
import { buildSmartFormPilotCalculationPayload } from "@/components/tools/smart-form/build-smart-form-pilot-calculation-payload";
import type { PilotFieldValues } from "@/components/tools/smart-form/pilot-calculation-payload";
import { PageLayout } from "@/components/layout/PageLayout";
import { OsModuleHeader } from "@/components/os/OsModuleHeader";
import { SectorToolSelect } from "@/components/os/SectorToolSelect";
import { Container } from "@/components/ui/Container";
import { LedgerNumberTick } from "@/components/ui/LedgerNumberTick";
import { handleNumericInputChange } from "@/lib/features/input/numeric-input";
import {
  CalculatorCurrencyPrefix,
  CalculatorUnitSelect,
} from "@/components/tools/CalculatorUnitCurrencyControls";
import {
  trackSmartFormPilotCompleted,
  trackSmartFormPilotStarted,
} from "@/components/tools/smart-form/smart-form-pilot-analytics";
import { riskLevelToStatus, STATUS_TEXT_CLASS } from "@/lib/ui-shared/ui/status-colors";
import { trackConversionEvent } from "@/lib/infrastructure/analytics/conversion-funnel";
import { useAttributionContext } from "@/lib/infrastructure/analytics/use-attribution-context";
import {
 REVENUE_EVENTS,
 trackRevenueEvent,
} from "@/lib/infrastructure/analytics/revenue-events";
import {
 areFreeToolInputsValid,
 calculateFreeToolResult,
 type FreeToolInputValues,
 type FreeToolResult,
} from "@/lib/features/tools/free-tool-results";
import type { SmartFormUiBridgeManifest } from "@/lib/features/formula-governance/smart-form-ui-bridge/smart-form-ui-bridge-types";
import { type RevenueTool, type RevenueToolInput } from "@/lib/features/tools/revenue-tools";
import { useGuidanceFieldFocus } from "@/components/guidance/GuidanceContext";
import { SmartFormWorkspace } from "@/components/smart-form/SmartFormWorkspace";
import { SmartFormValidationSummary } from "@/components/tools/smart-form/SmartFormValidationSummary";
import { SmartToolForm } from "@/components/tools/smart-form/SmartToolForm";
import { runFreeFullLoopCalculation, type FreeFullLoopResult } from "@/lib/features/formula-governance/runtime-validation/free-full-loop-bridge";
import { isFreeFullLoopRuntimeSlug } from "@/lib/features/formula-governance/runtime-validation/full-loop-runtime-registry";
import {
  buildSmartFormInitialValues,
  validateSmartFormFieldValues,
} from "@/lib/features/formula-governance/runtime-validation/smart-form-contract-adapter";
import { evaluateRuntimeTrust } from "@/lib/features/tools/runtime-trust-engine";
import { ToolSafeReviewState } from "@/components/tools/ToolSafeReviewState";
import { HMI_CSS } from "@/lib/features/dynamic-form-v2/hmi-css";


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
   category: "finance-business" as any,
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
 const [utcTime, setUtcTime] = useState("");
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

 // UTC clock
 useEffect(() => {
   const tick = () => setUtcTime("UTC · " + new Date().toISOString().replace("T", " ").slice(0, 19));
   tick();
   const id = setInterval(tick, 1000);
   return () => clearInterval(id);
 }, []);

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

 const statusBadge = result
   ? result.riskLevel === "LOW" ? "ok"
   : result.riskLevel === "MEDIUM" ? "warn"
   : "danger"
   : null;

 const decisionLabel = result?.headline?.toUpperCase() || "AWAITING INPUTS";
 const decisionVal = result?.summary != null ? String(result.summary) : "\u2014";

 return (
 <PageLayout>
  <style>{HMI_CSS}</style>
  <section className="sc-craft-section">
  <Container size="wide" className="sc-craft-container sc-craft-container--wide min-w-0">
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
       <span className="text-premium-velvet font-medium">{tool.freeTitle}</span>
     </nav>
   )}
  <SectorToolSelect tier="free" currentSlug={tool.freeSlug} />
  <OsModuleHeader title={tool.freeTitle} tier="utility" slug={tool.freeSlug} locale={locale} surface={surfaceTier} />

  {featuredAnswer ? <div className="mt-5">{featuredAnswer}</div> : null}

 {!showCalculationSurface ? (
  <ToolSafeReviewState slug={tool.freeSlug} locale={locale} findings={runtimeTrust.findings} />
 ) : (
  <div className="wrap" style={{ padding: "20px 0" }}>
   {/* STATUS STRIP */}
   <div className="status-strip">
     <div className="brand">
       <span className="led ok pulse" />
       <div>
         <div className="brand-mark">SECTORCALC FREE</div>
         <div className="brand-sub">Industrial Free Tool Engine · {(tool.sector || "").toUpperCase()}</div>
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
       <div className="module-id">MODULE · {tool.freeSlug} · FREE</div>
       <h1>{tool.freeTitle}</h1>
       <div className="sub-cap">{tool.painStatement}</div>
     </div>
     <div className="meta">
       <div className="pill-row">
         <span className="pill">{surfaceTier === "premium" ? "PREMIUM" : "FREE"}</span>
         <span className="pill">RISK · {result ? decisionLabel : "\u2014"}</span>
       </div>
     </div>
   </div>

   <div className="grid">
     <main>
       <form ref={formRef} onSubmit={handleSubmit} noValidate data-calculation-form="true">
         {tool.freeInputs.map((input, idx) => {
           const value = values[input.key] ?? (input.type === "select" ? "" : 0);
           const showUnit = Boolean(input.unit) && input.type !== "currency";

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
                   autoComplete="off"
                   value={String(value)}
                   onChange={(event) => {
                     const { numeric } = handleNumericInputChange(event.target.value);
                     handleChange(input.key, numeric);
                   }}
                   aria-label={input.label}
                 />
                 {showUnit ? <span className="ubtn static">{input.unit}</span> : null}
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
                   {input.helperText ? (
                     <div className="ref">
                       <span className="info" tabIndex={0}>i<span className="tip">{input.helperText}</span></span>
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
               <div className="tx">{(isCalculating || result) ? `Last · ${tool.freeSlug}` : "Enter inputs below"}</div>
             </div>
           </div>
           <button type="submit" className="btn-exec" disabled={isCalculating}>
             <span>{isCalculating ? "CALCULATING..." : "\u25b6 EXECUTE"}</span>
             <span className="kbd">F9</span>
           </button>
         </div>
       </form>
     </main>

     <aside className="rail">
       {/* Decision */}
       <div className={`decision ${statusBadge === "danger" ? "review" : statusBadge === "ok" ? "ok" : ""}`}>
         <div className="d-label">PRIMARY READOUT · STATUS</div>
         {result ? (
           <>
             <div className="d-text">{decisionVal}</div>
             <div className="d-sub">{decisionLabel}</div>
           </>
         ) : (
           <div className="d-text" style={{ fontSize: "14px", color: "var(--ink-50)" }}>{"\u2014"}</div>
         )}
       </div>

       {/* Full-loop blockers */}
       {fullLoopResult?.status === "blocked" ? (
         <div className="card readout">
           <h3>VALIDATION SUMMARY</h3>
           <div className="readout">
             <SmartFormValidationSummary
               title={tUi("analysisBlockedTitle")}
               blockers={fullLoopResult.blockers}
             />
           </div>
         </div>
       ) : null}

       {/* Result KPIs */}
       {result ? (
         <div className="card readout">
           <h3>PRIMARY READOUTS</h3>
           <div className="kpis">
             <div className="kpi">
               <div className="k-label">Summary Value</div>
               <div className="k-val">{result.summary} <span className="k-unit">{tool.sector ? tool.sector.toUpperCase() : ""}</span></div>
             </div>
             <div className="kpi">
               <div className="k-label">Risk Level</div>
               <div className="k-val">{result.riskLevel}</div>
             </div>
           </div>
         </div>
       ) : null}

       {/* No result state */}
       {!result && fullLoopResult?.status !== "blocked" ? (
         <div className="card readout">
           <h3>ENGINEERING DIAGNOSTICS</h3>
           <div className="readout" style={{ color: "var(--ink-50)", fontSize: "11px", fontFamily: "var(--mono)", letterSpacing: ".08em", textTransform: "uppercase" }}>
             {isCalculating ? "Calculating..." : "Enter inputs and execute."}
           </div>
         </div>
       ) : null}

       {/* Authority block (in HMI style) */}
       {surfaceTier === "premium" && (
         <div className="card readout">
           <h3>INDUSTRY REFERENCE</h3>
           <div className="readout">
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
         </div>
       )}

       {/* Export */}
       <button className="btn-export" onClick={() => window.print()}>⏎ EXPORT REPORT</button>
     </aside>
   </div>
  </div>
 )}
 <ExpertAuthoritySection toolName={tool.freeTitle} />
 </Container>
 </section>
</PageLayout>
 );
}
