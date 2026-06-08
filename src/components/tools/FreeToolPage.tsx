"use client";

import { useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { usePathname } from "@/i18n/routing";
import { CalculatorFeedbackBox } from "@/components/tools/CalculatorFeedbackBox";
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
  trackSmartFormPilotCompleted,
  trackSmartFormPilotStarted,
} from "@/components/tools/smart-form/smart-form-pilot-analytics";
import { riskLevelToStatus, STATUS_TEXT_CLASS } from "@/lib/ui/status-colors";
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
import { RuntimeTrustTracePanel } from "@/components/tools/RuntimeTrustTracePanel";
import { SmartFormValidationSummary } from "@/components/tools/smart-form/SmartFormValidationSummary";
import { SmartToolForm } from "@/components/tools/smart-form/SmartToolForm";
import { runFreeFullLoopCalculation, type FreeFullLoopResult } from "@/lib/formula-governance/runtime-validation/free-full-loop-bridge";
import { isFreeFullLoopRuntimeSlug } from "@/lib/formula-governance/runtime-validation/full-loop-runtime-registry";
import {
  buildSmartFormInitialValues,
  validateSmartFormFieldValues,
} from "@/lib/formula-governance/runtime-validation/smart-form-contract-adapter";


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

function validationMessage(input: RevenueToolInput, value: number | string): string {
 if (input.type === "select") {
 return `Please select ${input.label.toLowerCase()} before continuing.`;
 }
 const numeric = typeof value === "number" ? value : Number(value);
 if (!Number.isFinite(numeric)) {
 return `${input.label} must be a valid number.`;
 }
 if (numeric <= 0) {
 return `${input.label} must be greater than 0.`;
 }
 return `${input.label} must be a valid number.`;
}

interface FreeToolInputFieldProps {
 input: RevenueToolInput;
 value: number | string;
 error?: string;
 onChange: (key: string, value: number | string) => void;
}

function FreeToolInputField({
 input,
 value,
 error,
 onChange,
}: FreeToolInputFieldProps) {
 const inputId = `free-tool-${input.key}`;
 const errorId = `${inputId}-error`;
 const showUnit = Boolean(input.unit) && input.type !== "currency";

 if (input.type === "select" && input.options) {
 return (
 <div className="sc-industrial-field">
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

 const isCurrency = input.type === "currency";

 return (
 <div className="sc-industrial-field">
 <div className="sc-industrial-field__label-row">
 <label htmlFor={inputId} className="sc-ledger-label sc-industrial-field__label">
 {input.label}
 {input.required ? <span aria-hidden> *</span> : null}
 </label>
 {showUnit ? <span className="sc-industrial-field__unit">{input.unit}</span> : null}
 </div>
 <div className="relative">
 {isCurrency ? (
 <span className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 font-mono text-xs text-body-charcoal">
 $
 </span>
 ) : null}
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
 aria-describedby={error ? errorId : undefined}
 className={`sc-ledger-input-underline${isCurrency ? " pl-5" : ""}${error ? " sc-ledger-input--error" : ""}`}
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
 <p className="sc-ledger-eyebrow">Hızlı çetele</p>
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
}

export function FreeToolPage({ tool, featuredAnswer, smartFormPilotManifest }: FreeToolPageProps) {
 const pathname = usePathname();
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

 if (useFullLoopRuntime) {
  if (!startedTracked.current) {
   startedTracked.current = true;
   trackRevenueEvent(REVENUE_EVENTS.free_tool_started, {
    toolSlug: tool.freeSlug,
   });
  }

  const nextErrors = validateSmartFormFieldValues(tool.freeSlug, values);
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
 nextErrors[input.key] = validationMessage(input, value);
 }
 continue;
 }
 const numeric =
 typeof value === "number" ? value : Number(value);
 if (
 typeof numeric !== "number" ||
 !Number.isFinite(numeric) ||
 numeric <= 0
 ) {
 nextErrors[input.key] = validationMessage(input, value);
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
 }, 400);
 };

 return (
 <PageLayout>
 <section className="sc-craft-section">
 <Container size="wide" className="sc-craft-container sc-craft-container--wide min-w-0">
 <SectorToolSelect tier="free" currentSlug={tool.freeSlug} />
 <OsModuleHeader title={tool.freeTitle} tier="utility" />

 {featuredAnswer ? <div className="mt-5">{featuredAnswer}</div> : null}

 <div className="sc-ledger-cetele sc-tool-workspace mt-4">
 {useSmartFormPilot && smartFormPilotManifest ? (
  <>
   <SmartFormBridgeRenderer
    manifest={smartFormPilotManifest}
    calculationConnected
    isCalculating={isCalculating}
    fieldErrors={pilotErrors}
    onPilotCalculate={handlePilotCalculate}
    onPilotStarted={handlePilotStarted}
   />
   <div className="sc-ledger-cetele__result sc-tool-workspace__result mt-4 min-w-0">
    {isCalculating ? (
     <p className="text-sm text-body-charcoal">Calculating…</p>
    ) : null}
    {!isCalculating && result ? <FreeToolResultCard result={result} /> : null}
    {!isCalculating && !result ? (
     <p className="text-sm text-body-charcoal">
      Enter mapped pilot inputs and run Pilot calculate.
     </p>
    ) : null}
   </div>
  </>
 ) : useFullLoopRuntime ? (
  <>
   <SmartToolForm
    slug={tool.freeSlug}
    values={values}
    errors={errors}
    onChange={handleChange}
    onSubmit={handleSubmit}
    calculateLabel={isCalculating ? "…" : "Run"}
    blocked={fullLoopResult?.status === "blocked"}
    blockers={fullLoopResult?.status === "blocked" ? fullLoopResult.blockers : []}
    isCalculating={isCalculating}
   />

   <div className="sc-ledger-cetele__result sc-tool-workspace__result min-w-0 space-y-4">
    {fullLoopResult?.status === "blocked" ? (
     <>
      <SmartFormValidationSummary
       title="Result blocked"
       blockers={fullLoopResult.blockers}
      />
      <RuntimeTrustTracePanel trustTrace={fullLoopResult.trustTrace} />
     </>
    ) : null}
    {isCalculating ? (
     <p className="text-sm text-body-charcoal">Calculating…</p>
    ) : null}
    {!isCalculating && result ? (
     <>
      <FreeToolResultCard result={result} />
      {fullLoopResult?.status === "success" ? (
       <>
        <RuntimeTrustTracePanel trustTrace={fullLoopResult.trustTrace} />
        <CalculatorFeedbackBox
         toolSlug={tool.freeSlug}
         tier="free"
         pagePath={pagePath}
         inputSnapshot={feedbackInputSnapshot}
         resultSnapshot={feedbackResultSnapshot}
        />
       </>
      ) : null}
     </>
    ) : null}
    {!isCalculating && !result && fullLoopResult?.status !== "blocked" ? (
     <p className="text-sm text-body-charcoal">Enter values and run the calculator.</p>
    ) : null}
   </div>
  </>
 ) : (
  <>
   <form
    ref={formRef}
    onSubmit={handleSubmit}
    className="sc-ledger-cetele__form sc-ledger-cetele-form sc-ledger-panel sc-industrial-panel sc-ledger-letterpress p-4 sm:p-5"
    noValidate
   >
    {tool.freeInputs.map((input) => (
     <FreeToolInputField
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
      disabled={isCalculating}
      className="sc-cta-primary disabled:opacity-60"
     >
      {isCalculating ? "…" : "Run"}
     </button>
    </div>
   </form>

   <div className="sc-ledger-cetele__result sc-tool-workspace__result min-w-0 space-y-4">
    {useFullLoopRuntime && fullLoopResult?.status === "blocked" ? (
     <>
      <SmartFormValidationSummary
       title="Result blocked"
       blockers={fullLoopResult.blockers}
      />
      <RuntimeTrustTracePanel trustTrace={fullLoopResult.trustTrace} />
     </>
    ) : null}
    {isCalculating ? (
     <p className="text-sm text-body-charcoal">Calculating…</p>
    ) : null}
    {!isCalculating && result ? (
     <>
      <FreeToolResultCard result={result} />
      {useFullLoopRuntime && fullLoopResult?.status === "success" ? (
       <>
        <RuntimeTrustTracePanel trustTrace={fullLoopResult.trustTrace} />
        <CalculatorFeedbackBox
         toolSlug={tool.freeSlug}
         tier="free"
         pagePath={pagePath}
         inputSnapshot={feedbackInputSnapshot}
         resultSnapshot={feedbackResultSnapshot}
        />
       </>
      ) : null}
     </>
    ) : null}
    {!isCalculating && !result && fullLoopResult?.status !== "blocked" ? (
     <p className="text-sm text-body-charcoal">Enter values and run the calculator.</p>
    ) : null}
   </div>
  </>
 )}
 </div>
 </Container>
 </section>
 </PageLayout>
 );
}
