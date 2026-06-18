"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { getCurrentUserIdToken } from "@/lib/firebase/auth";
import { calculatePremiumVerdict } from "@/lib/actions/calculate-premium";
import { generatePremiumPdfFromAnalysis } from "@/lib/actions/generate-pdf";
import { downloadPdfFromBase64 } from "@/lib/reports/download-pdf-client";
import {
 parsePremiumVerdictTxt,
 type ParsedPremiumVerdict,
} from "@/lib/premium/parse-premium-verdict-txt";
import {
 REVENUE_EVENTS,
 trackRevenueEvent,
} from "@/lib/analytics/revenue-events";
import {
 ANALYTICS_EVENTS,
 trackEvent,
} from "@/lib/analytics/events";
import type { PremiumDecisionReport } from "@/lib/calculators/premium-types";
import type { ResultTone } from "@/data/tool-schema";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/Badge";
import { REPORT_EXPORT_FORMATS } from "@/data/reports";
import { EXPORT_MOCK_MESSAGE } from "@/config/export-messages";
import { MARGINCORE_TERMS } from "@/lib/terminology/margincore-identity";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface StochasticPremiumPanelProps {
 variant: "stochastic";
 sector: string;
 inputs: Record<string, number>;
 inputsReady: boolean;
 toolSlug?: string;
 toolTitle: string;
}

interface LegacyPremiumPanelProps {
 variant?: "legacy";
 report: PremiumDecisionReport;
 riskLevel: ResultTone;
 scenariosSummary: string;
 toolSlug?: string;
 toolTitle: string;
}

export type PremiumDecisionReportPanelProps =
 | StochasticPremiumPanelProps
 | LegacyPremiumPanelProps;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const riskBadgeVariant: Record<
 ResultTone,
 "free" | "premium" | "muted" | "default"
> = {
 success: "free",
 warning: "premium",
 danger: "muted",
 neutral: "default",
};

const EXPORT_ACTIONS = [...REPORT_EXPORT_FORMATS, "Save"] as const;

function formatUsd(value: number): string {
 return `$${value.toLocaleString("en-US", {
 minimumFractionDigits: 2,
 maximumFractionDigits: 2,
 })}`;
}

export interface AuditVerdictReportData {
 naiveCost: number;
 riskBuffer: number;
 safePrice: number;
 verdictLabel: string;
 matrix: Array<{ scenario: string; impact: string }>;
}

function auditDataFromParsed(parsed: ParsedPremiumVerdict): AuditVerdictReportData {
 return {
 naiveCost: parsed.naivePrice,
 riskBuffer: parsed.riskBuffer,
 safePrice: parsed.p90SafePrice,
 verdictLabel: parsed.verdict,
 matrix: parsed.matrixRows.map((row) => ({
 scenario: row.scenario,
 impact: row.deltaPercent,
 })),
 };
}

interface AuditVerdictReportViewProps {
 data: AuditVerdictReportData;
 heading?: string;
 className?: string;
}

function AuditVerdictReportContent({ data }: { data: AuditVerdictReportData }) {
 return (
 <>
 <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2">
 <div className="space-y-6">
 <div>
 <p className="text-xs font-bold uppercase text-text-secondary">Exposure baseline (pre-P90)</p>
<p className="sc-result-nowrap font-mono text-2xl text-text-primary">{formatUsd(data.naiveCost)}</p>
</div>
<div>
<p className="text-xs font-bold uppercase text-amber">{MARGINCORE_TERMS.marginLeakBuffer}</p>
<p className="sc-result-nowrap font-mono text-2xl text-amber">{formatUsd(data.riskBuffer)}</p>
 </div>
 </div>

 <div className="bg-deep-navy p-6 text-white">
 <p className="text-xs font-bold uppercase text-white/70">{MARGINCORE_TERMS.safeBidLimit}</p>
 <p className="sc-result-nowrap mt-2 text-4xl font-bold text-amber">{formatUsd(data.safePrice)}</p>
 <div className="mt-4 border-t border-white/20 pt-4 text-sm leading-relaxed text-white/75">
 {data.verdictLabel}
 </div>
 </div>
 </div>

 <div className="mt-8 border-t border-border-subtle pt-8">
 <h3 className="mb-4 text-sm font-bold uppercase text-text-primary">
 Sensitivity Matrix
 </h3>
 {data.matrix.length > 0 ? (
 <table className="w-full text-left text-sm">
 <caption className="sr-only">Margin risk sensitivity matrix</caption>
 <thead>
 <tr className="border-b border-border-subtle text-text-secondary">
 <th scope="col" className="pb-2 font-semibold">
 Scenario
 </th>
 <th scope="col" className="pb-2 text-right font-semibold">
 Margin Impact
 </th>
 </tr>
 </thead>
 <tbody>
 {data.matrix.map((row) => (
 <tr key={row.scenario} className="border-b border-border-subtle/60">
 <td className="py-3 text-text-primary">{row.scenario}</td>
 <td className="sc-result-nowrap py-3 text-right font-mono text-text-primary">{row.impact}</td>
 </tr>
 ))}
 </tbody>
 </table>
 ) : (
 <p className="text-sm text-text-secondary">
 Sensitivity scenarios will appear after margin risk calculation completes.
 </p>
 )}
 </div>
 </>
 );
}

/** Big Four audit layout — premium-panel + report-heading. */
export function AuditVerdictReportView({
 data,
 heading = "Audit Verdict & Risk Calculation",
 className = "premium-panel mx-auto max-w-4xl shadow-none",
}: AuditVerdictReportViewProps) {
 return (
 <div className={className}>
 {heading ? <h2 className="report-heading">{heading}</h2> : null}
 <AuditVerdictReportContent data={data} />
 </div>
 );
}

// ---------------------------------------------------------------------------
// Stochastic panel (MarginCore server action)
// ---------------------------------------------------------------------------

function StochasticMarginReportPanel({
 sector,
 inputs,
 inputsReady,
 toolSlug,
 toolTitle,
}: StochasticPremiumPanelProps) {
 const [loading, setLoading] = useState(false);
 const [parsed, setParsed] = useState<ParsedPremiumVerdict | null>(null);
 const [pdfLoading, setPdfLoading] = useState(false);
 const [exportMessage, setExportMessage] = useState<string | null>(null);

 useEffect(() => {
 trackEvent(ANALYTICS_EVENTS.premium_preview_viewed, { toolSlug });
 }, [toolSlug]);

 const runAnalysis = useCallback(async () => {
 if (!inputsReady) return;

 setLoading(true);
 setParsed(null);

 try {
 const idToken = await getCurrentUserIdToken();
 if (!idToken) {
 setParsed({
 isError: true,
 errorMessage:
 "HATA: Giriş yapılmamış. Bu hesaplama yalnızca SectorCalc Pro üyelerine açıktır.",
 naivePrice: 0,
 riskBuffer: 0,
 p90SafePrice: 0,
 verdict: "",
 matrixRows: [],
 rawTxt: "",
 });
 return;
 }

 const txt = await calculatePremiumVerdict({
 sector,
 inputs,
 idToken,
 });

 setParsed(parsePremiumVerdictTxt(txt));

 if (!txt.startsWith("HATA:")) {
 trackRevenueEvent(REVENUE_EVENTS.premium_result_generated, {
 toolSlug,
 });
 }
 } catch {
 setParsed({
 isError: true,
 errorMessage: "Margin risk calculation failed. Please try again.",
 naivePrice: 0,
 riskBuffer: 0,
 p90SafePrice: 0,
 verdict: "",
 matrixRows: [],
 rawTxt: "",
 });
 } finally {
 setLoading(false);
 }
 }, [sector, inputs, inputsReady, toolSlug]);

 const handleDownloadPdf = useCallback(async () => {
 if (!parsed || parsed.isError) {
 return;
 }

 setPdfLoading(true);
 setExportMessage(null);

 try {
 const idToken = await getCurrentUserIdToken();
 if (!idToken) {
 setExportMessage("Sign in with an active Pro subscription to download PDF.");
 return;
 }

 trackEvent(ANALYTICS_EVENTS.export_clicked, { toolSlug, format: "PDF" });

 const result = await generatePremiumPdfFromAnalysis({
 idToken,
 toolTitle,
 toolSlug: toolSlug ?? "premium-verdict",
 sector,
 snapshot: {
 naivePrice: parsed.naivePrice,
 riskBuffer: parsed.riskBuffer,
 p90SafePrice: parsed.p90SafePrice,
 verdict: parsed.verdict,
 matrixRows: parsed.matrixRows,
 },
 });

 if (!result.ok) {
 setExportMessage(result.error);
 return;
 }

 downloadPdfFromBase64(result.pdfBase64, result.fileName);
 trackRevenueEvent(REVENUE_EVENTS.verdict_pdf_downloaded, {
 slug: toolSlug,
 });
 } catch {
 setExportMessage("Could not generate PDF. Please try again.");
 } finally {
 setPdfLoading(false);
 }
 }, [parsed, sector, toolSlug, toolTitle]);

 return (
 <div className="premium-panel mx-auto min-w-0 max-w-4xl shadow-none">
 <h2 className="report-heading">Audit Verdict &amp; Risk Calculation</h2>
 <p className="mt-1 text-sm text-text-secondary">{toolTitle}</p>
 <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-secondary">
 Stochastic P90 margin calculation — naive exposure vs safe price with sensitivity
 scenarios. Formulas run server-side; only the verdict is shown.
 </p>

 {!inputsReady ? (
 <p className="mt-6 text-sm text-text-secondary">
 Complete and validate calculator inputs before running margin risk calculation.
 </p>
 ) : null}

 {inputsReady && !parsed && !loading ? (
 <Button
 type="button"
 variant="secondary"
 size="md"
 className="mt-6 min-h-[44px] w-full sm:w-auto"
 onClick={runAnalysis}
 >
 {MARGINCORE_TERMS.runAnalysis}
 </Button>
 ) : null}

 {loading ? (
 <div
 className="mt-6 rounded-sm border border-border-subtle bg-bg-subtle p-6"
 role="status"
 aria-live="polite"
 >
 <p className="text-sm font-medium text-amber">Analyzing risk margins…</p>
 <div className="mt-4 h-2 overflow-hidden rounded-full bg-border-subtle">
 <div className="h-full w-1/2 animate-pulse rounded-full bg-amber/60" />
 </div>
 </div>
 ) : null}

 {parsed?.isError ? (
 <div
 className="mt-6 rounded-sm border border-amber/30 bg-amber/[0.08] p-5 text-sm text-amber"
 role="alert"
 >
 {parsed.errorMessage}
 </div>
 ) : null}

 {parsed && !parsed.isError ? (
 <AuditVerdictReportContent data={auditDataFromParsed(parsed)} />
 ) : null}

 {parsed && !parsed.isError ? (
 <>
 <div className="mt-8 border-t border-border-subtle pt-8">
 <h3 className="text-sm font-bold uppercase text-text-primary">Export Verdict</h3>
            <p className="mt-2 text-sm text-text-secondary">
              Download a decision summary PDF with P90 calculation and sensitivity matrix.
            </p>
 <div className="mt-4">
 <Button
 type="button"
 variant="secondary"
 className="min-h-[44px] w-full sm:w-auto"
 disabled={pdfLoading}
 onClick={() => void handleDownloadPdf()}
 >
              {pdfLoading ? "Preparing PDF…" : "Download Decision Summary PDF"}
 </Button>
 </div>
 {exportMessage ? (
 <p className="mt-4 text-sm text-text-secondary" role="status">
 {exportMessage}
 </p>
 ) : null}
 </div>
 <p className="mt-6 text-xs leading-relaxed text-text-secondary">
 Technical simulation only — not financial, legal or engineering advice. Verify
 all outputs before quoting or accepting work.
 </p>
 </>
 ) : null}
 </div>
 );
}

// ---------------------------------------------------------------------------
// Legacy panel (non-stochastic tool definitions)
// ---------------------------------------------------------------------------

function LegacyDecisionReportPanel({
 report,
 riskLevel,
 scenariosSummary,
 toolSlug,
 toolTitle,
}: LegacyPremiumPanelProps) {
 const [exportMessage, setExportMessage] = useState<string | null>(null);

 useEffect(() => {
 trackEvent(ANALYTICS_EVENTS.premium_preview_viewed, { toolSlug });
 }, [toolSlug]);

 const handleExportClick = (format: string) => {
 trackEvent(ANALYTICS_EVENTS.export_clicked, { toolSlug, format });
 setExportMessage(EXPORT_MOCK_MESSAGE);
 };

 const sections: { title: string; content: ReactNode }[] = [
 { title: "Executive Summary", content: report.executiveSummary },
 {
 title: "Key Findings",
 content: (
 <ul className="list-disc space-y-2.5 pl-5 marker:text-deep-navy">
 {report.keyFindings.map((finding) => (
 <li key={finding}>{finding}</li>
 ))}
 </ul>
 ),
 },
 { title: "Scenario calculation", content: scenariosSummary },
 {
 title: "Risk Level",
 content: (
 <Badge variant={riskBadgeVariant[riskLevel]} className="text-sm">
 {report.riskLevelLabel}
 </Badge>
 ),
 },
 { title: "Suggested Action", content: report.recommendation },
 {
 title: "Assumptions",
 content: <p className="italic text-text-secondary">{report.assumptions}</p>,
 },
 ];

 return (
 <div className="premium-panel mx-auto min-w-0 max-w-4xl shadow-none">
 <h2 className="report-heading">Decision Summary</h2>
 <p className="mt-1 text-sm text-text-secondary">{toolTitle}</p>
 <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-secondary">
 Export-ready view of your paid calculator result — verdict, key drivers and
 suggested action.
 </p>

 <div className="mt-6 space-y-4">
 {sections.map((section, index) => (
 <article
 key={section.title}
 className="relative border border-border-subtle bg-bg-subtle p-5 sm:p-6"
 >
 <div className="mb-4 flex items-center gap-3">
 <span className="flex h-8 w-8 shrink-0 items-center justify-center bg-deep-navy/10 text-sm font-bold text-deep-navy">
 {index + 1}
 </span>
 <h3 className="text-sm font-semibold uppercase tracking-wider text-deep-navy">
 {section.title}
 </h3>
 </div>
 <div className="text-sm leading-relaxed text-text-secondary sm:text-[15px]">
 {section.content}
 </div>
 </article>
 ))}

 <article className="border border-dashed border-amber/30 bg-amber/[0.06] p-5 sm:p-6">
 <h3 className="text-sm font-semibold uppercase tracking-wider text-amber">
 Export (PDF preview)
 </h3>
 <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
 {EXPORT_ACTIONS.map((format) => (
 <button
 key={format}
 type="button"
 onClick={() => handleExportClick(format)}
 className="min-h-[44px] w-full border border-border-subtle bg-white px-4 text-sm font-medium text-text-secondary transition-colors hover:border-amber/30 hover:bg-bg-subtle hover:text-text-primary sm:w-auto"
 >
 {format}
 <span className="ml-2 text-xs text-placeholder">(preview)</span>
 </button>
 ))}
 </div>
 {exportMessage ? (
 <p className="mt-4 text-sm text-text-secondary" role="status">
 {exportMessage}
 </p>
 ) : null}
 </article>
 </div>
 </div>
 );
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export function PremiumDecisionReportPanel(props: PremiumDecisionReportPanelProps) {
 if (props.variant === "stochastic") {
 return <StochasticMarginReportPanel {...props} />;
 }
 return <LegacyDecisionReportPanel {...props} />;
}

/** Map revenue-tool form values to MarginCore numeric inputs. */
export function toStochasticInputs(
 values: Record<string, number | string>,
): Record<string, number> {
 const out: Record<string, number> = {};
 for (const [key, value] of Object.entries(values)) {
 if (typeof value === "number" && Number.isFinite(value)) {
 out[key] = value;
 continue;
 }
 if (typeof value === "string") {
 const parsed = Number(value);
 if (Number.isFinite(parsed)) {
 out[key] = parsed;
 }
 }
 }
 return out;
}

/** Map legacy CNC tool-definition inputs to MarginCore sector keys. */
export function mapLegacyCncInputs(
 values: Record<string, number | string>,
): Record<string, number> {
 const quantity = Number(values.quantity) || 1;
 const materialPerPart = Number(values.materialCostPerPart) || 0;
 return {
 setupTime: Number(values.setupMinutes) || 0,
 cycleTime: Number(values.cycleMinutesPerPart) || 0,
 quantity,
 toolCost: Number(values.toolingCost) || 0,
 materialCost: materialPerPart * quantity,
 machineRate: Number(values.machineHourlyCost) || 75,
 };
}
