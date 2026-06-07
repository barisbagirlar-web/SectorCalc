"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { PremiumLoginPrompt } from "@/components/billing/CustomerSignInPanel";
import { PremiumPaywall } from "@/components/subscription/PremiumPaywall";
import { PremiumSubscribedBanner } from "@/components/billing/SubscriptionActivationBanner";
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/ui/Container";
import { OsModuleHeader } from "@/components/os/OsModuleHeader";
import { SectorToolSelect } from "@/components/os/SectorToolSelect";
import { handleNumericInputChange, SC_NUMERIC_INPUT_CLASS } from "@/lib/input/numeric-input";
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

function formatInputLabel(label: string, unit?: string): string {
 return unit ? `${label} (${unit})` : label;
}

function PremiumToolInputField({
 input,
 value,
 error,
 onChange,
}: PremiumToolInputFieldProps) {
 const inputId = `premium-tool-${input.key}`;
 const errorId = `${inputId}-error`;
 const label = formatInputLabel(input.label, input.unit);

 if (input.type === "select" && input.options) {
 return (
 <div className="space-y-1">
 <label htmlFor={inputId} className="label-badge block text-body-charcoal">
 {label}
 {input.required ? <span className="text-crit-red">*</span> : null}
 </label>
 <select
 id={inputId}
 value={String(value)}
 onChange={(event) => onChange(input.key, event.target.value)}
 aria-invalid={Boolean(error)}
 aria-describedby={error ? errorId : undefined}
 className={`sc-input min-h-[44px] ${error ? "sc-input-error" : ""}`}
 >
 {input.options.map((option) => (
 <option key={option.value} value={option.value}>
 {option.label}
 </option>
 ))}
 </select>
 {error ? (
 <p id={errorId} className="text-xs text-crit-red status-crit" role="alert">
 {error}
 </p>
 ) : null}
 </div>
 );
 }

 const isCurrency = input.type === "currency";
 const showUnit = Boolean(input.unit) && input.type !== "currency";

 return (
 <div className="space-y-1">
 <label htmlFor={inputId} className="label-badge block text-body-charcoal">
 {label}
 {input.required ? <span className="text-crit-red">*</span> : null}
 </label>
 <div className="relative">
 {isCurrency ? (
 <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 data-value text-xs text-body-charcoal">
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
 className={`${SC_NUMERIC_INPUT_CLASS} min-h-[44px] ${isCurrency ? "pl-8 pr-4" : "px-4"} ${showUnit ? "pr-14" : ""} ${
 error ? "sc-input-error" : ""
 }`}
 />
 {showUnit ? (
 <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 data-value text-xs text-body-charcoal">
 {input.unit}
 </span>
 ) : null}
 </div>
 {error ? (
 <p id={errorId} className="text-xs text-crit-red status-crit" role="alert">
 {error}
 </p>
 ) : null}
 </div>
 );
}

interface PremiumToolPageProps {
 tool: RevenueTool;
}

export function PremiumToolPage({ tool }: PremiumToolPageProps) {
 const {
 user,
 canAccessAnalyzer,
 isSuperUser,
 loading,
 error,
 } = usePremiumToolAccess(tool.paidSlug);

 const [values, setValues] = useState<PremiumToolInputValues>(() =>
 buildInitialValues(tool)
 );
 const [submitted, setSubmitted] = useState(false);
 const [isCalculating, setIsCalculating] = useState(false);
 const [errors, setErrors] = useState<Record<string, string>>({});

 const isCncStochastic = tool.paidSlug === "cnc-quote-risk-analyzer";

 const decisionReport = useMemo(() => {
 if (!submitted || !canAccessAnalyzer) {
 return null;
 }
 if (!arePremiumToolInputsValid(tool, values)) {
 return null;
 }
 return calculatePremiumDecisionReport(tool.paidSlug, values);
 }, [submitted, canAccessAnalyzer, tool, values]);

 const result = useMemo((): PremiumToolResult | null => {
 if (!decisionReport) {
 return null;
 }
 return calculatePremiumToolResult(tool, values);
 }, [decisionReport, tool, values]);

 const verdictReportData = useMemo(() => {
 if (!result || !canAccessAnalyzer) {
 return null;
 }
 return buildVerdictReportData({ tool, values, result });
 }, [result, canAccessAnalyzer, tool, values]);

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
 <section className="bg-industrial-matte py-3">
 <Container size="wide" className="min-w-0 font-mono">
 {loading ? (
 <p className="text-xs text-body-charcoal">…</p>
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
 <p className="mt-2 text-xs text-crit-red status-crit" role="alert">
 {error}
 </p>
 ) : null}
 </div>
 ) : (
 <>
 <SectorToolSelect tier="premium" currentSlug={tool.paidSlug} />
 <OsModuleHeader title={tool.paidTitle} tier="intelligence" />
 <div className="grid min-w-0 gap-4 lg:grid-cols-2 lg:items-start">
 <form onSubmit={handleSubmit} className="min-w-0 space-y-3" noValidate>
 {tool.paidInputs.map((input) => (
 <PremiumToolInputField
 key={input.key}
 input={input}
 value={values[input.key] ?? (input.type === "select" ? "" : 0)}
 error={errors[input.key]}
 onChange={handleChange}
 />
 ))}
 <button
 type="submit"
 disabled={isCalculating}
 className="sc-btn-primary w-full sm:w-auto disabled:opacity-60"
 >
 {isCalculating ? "…" : "Run"}
 </button>
 </form>

 <div className="min-w-0 space-y-4">
 {isCalculating ? <p className="text-xs text-body-charcoal">…</p> : null}
 {!isCalculating && decisionReport && result && verdictReportData ? (
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
 ) : null}
 </div>
 </div>
 </>
 )}
 </Container>
 </section>
 </PageLayout>
 );
}
