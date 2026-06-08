"use client";

import { useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { SmartFormBridgeRenderer } from "@/components/tools/smart-form/SmartFormBridgeRenderer";
import { PageLayout } from "@/components/layout/PageLayout";
import { OsModuleHeader } from "@/components/os/OsModuleHeader";
import { SectorToolSelect } from "@/components/os/SectorToolSelect";
import { Container } from "@/components/ui/Container";
import { LedgerNumberTick } from "@/components/ui/LedgerNumberTick";
import { handleNumericInputChange } from "@/lib/input/numeric-input";
import {
 REVENUE_EVENTS,
 trackRevenueEvent,
} from "@/lib/analytics/revenue-events";
import { riskLevelToStatus, STATUS_TEXT_CLASS } from "@/lib/ui/status-colors";
import {
 areFreeToolInputsValid,
 calculateFreeToolResult,
 type FreeToolInputValues,
 type FreeToolResult,
} from "@/lib/tools/free-tool-results";
import type { SmartFormUiBridgeManifest } from "@/lib/formula-governance/smart-form-ui-bridge/smart-form-ui-bridge-types";
import { type RevenueTool, type RevenueToolInput } from "@/lib/tools/revenue-tools";


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
 const useSmartFormPilot = Boolean(smartFormPilotManifest);

 const [values, setValues] = useState<FreeToolInputValues>(() =>
 buildInitialValues(tool)
 );
 const [submitted, setSubmitted] = useState(false);
 const [isCalculating, setIsCalculating] = useState(false);
 const [errors, setErrors] = useState<Record<string, string>>({});
 const startedTracked = useRef(false);
 const formRef = useRef<HTMLFormElement>(null);

 const result = useMemo(() => {
 if (!submitted) {
 return null;
 }
 return calculateFreeToolResult(tool, values);
 }, [submitted, tool, values]);

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
   <SmartFormBridgeRenderer manifest={smartFormPilotManifest} />
   <div className="sc-ledger-cetele__result sc-tool-workspace__result mt-4 min-w-0">
    <p className="text-sm text-body-charcoal">
     Pilot render only — standard calculator is available when SMART_FORM_PILOT is disabled.
    </p>
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

   <div className="sc-ledger-cetele__result sc-tool-workspace__result min-w-0">
    {isCalculating ? (
     <p className="text-sm text-body-charcoal">Calculating…</p>
    ) : null}
    {!isCalculating && result ? <FreeToolResultCard result={result} /> : null}
    {!isCalculating && !result ? (
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
