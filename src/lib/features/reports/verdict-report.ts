import type { RevenueTool, RevenueToolInput } from "@/lib/features/tools/revenue-tools";
import { getIndustryDisplayName } from "@/lib/features/tools/industry-registry";
import type { PremiumDecisionReport } from "@/lib/features/tools/premium-tool-contract";
import { getPremiumToolContract } from "@/lib/features/tools/premium-tool-contracts";
import type { PremiumReportExportPayload } from "@/lib/features/premium-schema/premium-report-export";
import type {
 PremiumToolInputValues,
 PremiumToolResult,
} from "@/lib/features/tools/premium-tool-results";
import type { PremiumSeverity } from "@/lib/features/tools/premium-tool-results";

export type VerdictReportInput = {
 label: string;
 value: string;
};

export type VerdictReportScenarioLine = {
 title: string;
 detail: string;
 metric?: string;
};

export type VerdictReportData = {
 toolTitle: string;
 sector: string;
 generatedAt: string;
 verdict: string;
 headline: string;
 primaryMetricLabel: string;
 primaryMetricValue: string;
 riskDrivers: string[];
 suggestedAction: string;
 inputs: VerdictReportInput[];
 legalDisclaimer: string;
 assumptions: string[];
 scenarios: VerdictReportScenarioLine[];
 validationNotes: string[];
 methodologyNote: string;
 usageNote: string;
};

export const VERDICT_REPORT_LEGAL_DISCLAIMER =
 "This Calculation summary is for decision support only. It is a technical simulation — not financial, legal or engineering advice. Results depend on user-provided inputs. Verify all outputs before making business decisions.";

export const PREMIUM_DECISION_SUMMARY_METHODOLOGY =
 "Methodology note: SectorCalc applies deterministic formulas, sector defaults, and documented tolerance rules to user inputs. Scenario lines show directional stress checks. Outputs are indicative working estimates.";

export const PREMIUM_DECISION_SUMMARY_USAGE_NOTE =
 "Usage agreement: Share this summary with your team for planning conversations only. Do not treat it as an external audit, regulatory filing, or authoritative measurement record.";

export const PREMIUM_DECISION_SUMMARY_TITLE = "Premium Decision Summary";

function formatInputValue(
 input: RevenueToolInput,
 value: number | string | undefined
): string {
 if (input.type === "select" && input.options) {
 const raw = typeof value === "string" ? value : String(value ?? "");
 const match = input.options.find((option) => option.value === raw);
 if (match) {
 return match.label;
 }
 return raw.trim().length > 0 ? raw.trim() : "-";
 }

 if (typeof value === "number" && Number.isFinite(value)) {
 if (input.type === "currency") {
 return `$${value.toFixed(2)}`;
 }
 if (input.type === "percent") {
 return `${value.toFixed(1)}%`;
 }
 if (input.unit) {
 return `${value} ${input.unit}`;
 }
 return String(value);
 }

 if (typeof value === "string" && value.trim().length > 0) {
 return value.trim();
 }

 return "-";
}

export function formatVerdictReportDate(isoDate: string): string {
 const parsed = new Date(isoDate);
 if (Number.isNaN(parsed.getTime())) {
 return isoDate;
 }
 return parsed.toLocaleString("en-US", {
 dateStyle: "medium",
 timeStyle: "short",
 });
}

export function buildVerdictReportFileName(paidSlug: string, generatedAt: string): string {
 const date = generatedAt.slice(0, 10);
 return `sectorcalc-${paidSlug}-decision-summary-${date}.pdf`;
}

function buildAssumptionsFromDecisionReport(
 tool: RevenueTool,
 decisionReport?: PremiumDecisionReport
): string[] {
 const contract = getPremiumToolContract(tool.paidSlug);
 const lines: string[] = [];

 for (const hidden of contract?.hiddenVariables ?? []) {
  lines.push(`${hidden.label}: ${hidden.description}`);
 }

 for (const rule of contract?.toleranceRules ?? []) {
  lines.push(`${rule.label}: ${rule.triggerDescription}`);
 }

 if (decisionReport) {
  lines.push(`Target margin applied: ${decisionReport.targetMarginDisplay}`);
  lines.push(`Volatility buffer: ${decisionReport.volatilityBufferDisplay}`);
  lines.push(`Adjusted cost basis: ${decisionReport.adjustedCostDisplay}`);
 }

 return lines.slice(0, 12);
}

function buildScenariosFromDecisionReport(
 decisionReport?: PremiumDecisionReport
): VerdictReportScenarioLine[] {
 if (!decisionReport) {
  return [];
 }

 return decisionReport.sensitivity.slice(0, 6).map((row) => ({
  title: row.factor,
  detail: row.impactSummary,
  metric: row.minimumSafePriceDisplay,
 }));
}

function buildValidationNotesFromDecisionReport(
 tool: RevenueTool,
 decisionReport?: PremiumDecisionReport
): string[] {
 const contract = getPremiumToolContract(tool.paidSlug);
 const lines: string[] = [
  "Required inputs validated in browser before calculation.",
 ];

 if (decisionReport) {
  lines.push(`Verdict band: ${decisionReport.verdict.label}`);
  lines.push(`Primary metric: ${decisionReport.primaryMetricLabel} = ${decisionReport.primaryMetricValue}`);
 }

 for (const rule of contract?.toleranceRules ?? []) {
  lines.push(`Tolerance check: ${rule.label}`);
 }

 return lines.slice(0, 10);
}

export function buildVerdictReportData({
 tool,
 values,
 result,
 decisionReport,
}: {
 tool: RevenueTool;
 values: PremiumToolInputValues;
 result: PremiumToolResult;
 decisionReport?: PremiumDecisionReport;
}): VerdictReportData {
 return {
 toolTitle: tool.paidTitle,
 sector: getIndustryDisplayName(tool.sector),
 generatedAt: new Date().toISOString(),
 verdict: result.verdict,
 headline: result.headline,
 primaryMetricLabel: result.primaryMetricLabel,
 primaryMetricValue: result.primaryMetricValue,
 riskDrivers: result.riskDrivers,
 suggestedAction: result.suggestedAction,
 inputs: tool.paidInputs.map((input) => ({
 label: input.label,
 value: formatInputValue(input, values[input.key]),
 })),
 legalDisclaimer: decisionReport?.legalNote ?? VERDICT_REPORT_LEGAL_DISCLAIMER,
 assumptions: buildAssumptionsFromDecisionReport(tool, decisionReport),
 scenarios: buildScenariosFromDecisionReport(decisionReport),
 validationNotes: buildValidationNotesFromDecisionReport(tool, decisionReport),
 methodologyNote: PREMIUM_DECISION_SUMMARY_METHODOLOGY,
 usageNote: PREMIUM_DECISION_SUMMARY_USAGE_NOTE,
 };
}

export function mapPremiumReportExportToVerdictReportData(
 payload: PremiumReportExportPayload
): { data: VerdictReportData; severity: PremiumSeverity } {
 const severity: PremiumSeverity =
  payload.executiveVerdict.status === "critical"
   ? "danger"
   : payload.executiveVerdict.status === "warning"
     ? "watch"
     : "safe";

 return {
  severity,
  data: {
   toolTitle: payload.schemaName,
   sector: payload.sectorSlug,
   generatedAt: payload.generatedAt,
   verdict: payload.executiveVerdict.verdict,
   headline: payload.executiveVerdict.explanation,
   primaryMetricLabel: payload.bigNumber.label,
   primaryMetricValue: payload.bigNumber.value,
   riskDrivers: payload.hiddenDrivers.map(
    (driver) => `${driver.label}: ${driver.value} — ${driver.description}`
   ),
   suggestedAction: payload.suggestedActions.filter(Boolean).join(" "),
   inputs: [],
   legalDisclaimer: payload.legalNote,
   assumptions: [...payload.assumptions],
   scenarios: payload.thresholds.map((item) => ({
    title: item.label,
    detail: item.message,
    metric: item.value,
   })),
   validationNotes: payload.thresholds.map(
    (item) => `${item.label} (${item.level}): ${item.message}`
   ),
   methodologyNote: PREMIUM_DECISION_SUMMARY_METHODOLOGY,
   usageNote: PREMIUM_DECISION_SUMMARY_USAGE_NOTE,
  },
 };
}
