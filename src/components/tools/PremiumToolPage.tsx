"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { usePathname } from "@/i18n/routing";
import { stripLocalePrefix } from "@/i18n/locales";
import { PremiumLoginPrompt } from "@/components/billing/CustomerSignInPanel";
import { PremiumPaywall } from "@/components/subscription/PremiumPaywall";
import { PremiumSubscribedBanner } from "@/components/billing/SubscriptionActivationBanner";
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/ui/Container";
import { OsModuleHeader } from "@/components/os/OsModuleHeader";
import { SectorToolSelect } from "@/components/os/SectorToolSelect";
import { handleNumericInputChange } from "@/lib/input/numeric-input";
import {
 REVENUE_EVENTS,
 trackRevenueEvent,
} from "@/lib/analytics/revenue-events";
import { isDevelopmentProBypass } from "@/lib/billing/subscription";
import { usePremiumToolAccess } from "@/lib/billing/use-premium-tool-access";
import { buildVerdictReportData } from "@/lib/reports/verdict-report";
import {
 PremiumDecisionReportPanel,
 toStochasticInputs,
} from "@/components/tools/PremiumDecisionReportPanel";
import {
 PremiumAnalyzerReportPanel,
} from "@/components/tools/PremiumAnalyzerReportPanel";
import { RuntimeTrustTracePanel } from "@/components/tools/RuntimeTrustTracePanel";
import { CalculatorFeedbackBox } from "@/components/tools/CalculatorFeedbackBox";
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
 const pathname = usePathname();
 const pagePath = stripLocalePrefix(pathname);
 const runtimeSlug = routeSlug ?? tool.paidSlug;
 const useFullLoopRuntime = isPremiumFullLoopRuntimeSlug(runtimeSlug);
 const {
 user,
 canAccessAnalyzer,
 isSuperUser,
 loading,
 error,
 } = usePremiumToolAccess(tool.paidSlug);

 const [values, setValues] = useState<PremiumToolInputValues>(() =>
 useFullLoopRuntime
  ? buildSmartFormInitialValues(runtimeSlug)
  : buildInitialValues(tool)
 );
 const [submitted, setSubmitted] = useState(false);
 const [isCalculating, setIsCalculating] = useState(false);
 const [errors, setErrors] = useState<Record<string, string>>({});

 const isCncStochastic = tool.paidSlug === "cnc-quote-risk-analyzer";
 const schemaPilot = getPremiumSchemaForPaidSlug(tool.paidSlug);
 const showSchemaPilot = Boolean(schemaPilot) && !useFullLoopRuntime;

 const fullLoopResult = useMemo((): PremiumFullLoopResult | null => {
 if (!submitted || !canAccessAnalyzer || !useFullLoopRuntime) {
 return null;
 }
 return runPremiumFullLoopCalculation(runtimeSlug, values);
 }, [submitted, canAccessAnalyzer, useFullLoopRuntime, runtimeSlug, values]);

 const decisionReport = useMemo(() => {
 if (!submitted || !canAccessAnalyzer) {
 return null;
 }
 if (useFullLoopRuntime) {
 return fullLoopResult?.status === "success" ? fullLoopResult.report : null;
 }
 if (!arePremiumToolInputsValid(tool, values)) {
 return null;
 }
 return calculatePremiumDecisionReport(tool.paidSlug, values);
 }, [submitted, canAccessAnalyzer, useFullLoopRuntime, fullLoopResult, tool, values]);

 const result = useMemo((): PremiumToolResult | null => {
 if (useFullLoopRuntime) {
 return fullLoopResult?.status === "success" ? fullLoopResult.toolResult : null;
 }
 if (!decisionReport) {
 return null;
 }
 return calculatePremiumToolResult(tool, values);
 }, [useFullLoopRuntime, fullLoopResult, decisionReport, tool, values]);

 const verdictReportData = useMemo(() => {
 if (!result || !canAccessAnalyzer) {
 return null;
 }
 return buildVerdictReportData({ tool, values, result });
 }, [result, canAccessAnalyzer, tool, values]);

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

 const devPro = isDevelopmentProBypass();

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
  title="Analysis blocked"
  blockers={fullLoopResult.blockers}
 />
 <RuntimeTrustTracePanel trustTrace={fullLoopResult.trustTrace} />
 </>
 );
 }

 if (decisionReport && result && verdictReportData) {
 return (
 <>
 <PremiumAnalyzerReportPanel report={decisionReport} />
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
   <CalculatorFeedbackBox
    toolSlug={runtimeSlug}
    tier="premium"
    pagePath={pagePath}
    inputSnapshot={feedbackInputSnapshot}
    resultSnapshot={feedbackResultSnapshot}
   />
  </>
 ) : null}
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
 <p className="text-sm text-body-charcoal">Enter job inputs and run the analysis.</p>
 );
 }

 return null;
 };

 const handleChange = (key: string, value: number | string) => {
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
  const nextErrors = validateSmartFormFieldValues(runtimeSlug, values);
  setErrors(nextErrors);
  if (Object.keys(nextErrors).length > 0) {
   setSubmitted(false);
   return;
  }
  setErrors({});
  setIsCalculating(true);
  setSubmitted(false);
  window.setTimeout(() => {
   setIsCalculating(false);
   setSubmitted(true);
  }, 400);
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
 setErrors({});
 setIsCalculating(true);
 setSubmitted(false);
 window.setTimeout(() => {
 setIsCalculating(false);
 setSubmitted(true);
 }, 400);
 };

 return (
 <PageLayout>
 <section className="sc-craft-section">
 <Container size="wide" className="sc-craft-container sc-craft-container--wide min-w-0">
 {loading ? (
 <p className="text-sm text-body-charcoal">Loading access…</p>
 ) : !user && !devPro && !isSuperUser ? (
 <PremiumLoginPrompt paidSlug={tool.paidSlug} />
 ) : !canAccessAnalyzer && !isSuperUser ? (
 <div className="mx-auto max-w-2xl">
 <SectorToolSelect tier="premium" currentSlug={tool.paidSlug} />
 <OsModuleHeader title={tool.paidTitle} tier="intelligence" />
 <Suspense fallback={null}>
 <PremiumSubscribedBanner toolSlug={tool.paidSlug} />
 </Suspense>
 <PremiumPaywall tool={tool} />
 {error ? (
 <p className="mt-2 text-sm text-crit-red status-crit" role="alert">
 {error}
 </p>
 ) : null}
 </div>
 ) : (
 <>
 <SectorToolSelect tier="premium" currentSlug={tool.paidSlug} />
 <OsModuleHeader title={tool.paidTitle} tier="intelligence" />
 {showSchemaPilot ? (
 <>
 <DynamicPremiumCalculator schema={schemaPilot!} />
 <details className="mt-4 sc-industrial-panel p-4">
 <summary className="cursor-pointer text-xs font-semibold uppercase tracking-wider text-body-charcoal">
 Legacy contract engine (PDF-compatible)
 </summary>
 <div className="sc-tool-workspace mt-4">
 <form
 onSubmit={handleSubmit}
 className="sc-tool-workspace__form sc-industrial-form sc-industrial-panel p-4 sm:p-5"
 noValidate
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
 {isCalculating ? "Calculating…" : "Run legacy analysis"}
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
 <div className="sc-ledger-karar-masasi mt-4">
 {useFullLoopRuntime ? (
  <SmartToolForm
   slug={runtimeSlug}
   values={values}
   errors={errors}
   onChange={handleChange}
   onSubmit={handleSubmit}
   calculateLabel={isCalculating ? "Calculating…" : "Run analysis"}
   blocked={submitted && fullLoopResult?.status === "blocked"}
   blockers={
    submitted && fullLoopResult?.status === "blocked" ? fullLoopResult.blockers : []
   }
   isCalculating={isCalculating}
  />
 ) : (
 <form
 onSubmit={handleSubmit}
 className="sc-ledger-karar-masasi__entries sc-industrial-form sc-ledger-panel sc-industrial-panel sc-ledger-letterpress p-4 sm:p-5"
 noValidate
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
 <button
 type="submit"
 disabled={isCalculating}
 className="sc-ledger-cta-primary sc-cta-primary disabled:opacity-60"
 >
 {isCalculating ? "Calculating…" : "Run analysis"}
 </button>
 </div>
 </form>
 )}

 <div className="sc-ledger-karar-masasi__report min-w-0 space-y-4">
 {renderAnalysisOutput("primary")}
 </div>
 </div>
 </>
 )}
 </>
 )}
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
