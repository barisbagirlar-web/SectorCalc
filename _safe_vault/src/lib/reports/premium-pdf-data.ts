import type { SensitivityMatrixRow } from "@/lib/premium/parse-premium-verdict-txt";
import {
 formatVerdictReportDate,
 VERDICT_REPORT_LEGAL_DISCLAIMER,
 type VerdictReportInput,
} from "@/lib/reports/verdict-report";
import type { SavedVerdictReport } from "@/lib/reports/report-storage";

export type MargincorePdfSnapshot = {
 naivePrice: number;
 riskBuffer: number;
 p90SafePrice: number;
 verdict: string;
 matrixRows: SensitivityMatrixRow[];
};

export type PremiumPdfData = {
 toolTitle: string;
 toolSlug: string;
 sector: string;
 generatedAt: string;
 naivePrice: number;
 riskBuffer: number;
 p90SafePrice: number;
 verdict: string;
 matrixRows: SensitivityMatrixRow[];
 inputs: VerdictReportInput[];
 legalDisclaimer: string;
};

export function formatPremiumPdfUsd(value: number): string {
 return `$${value.toLocaleString("en-US", {
 minimumFractionDigits: 2,
 maximumFractionDigits: 2,
 })}`;
}

export function buildPremiumPdfFileName(toolSlug: string, generatedAt: string): string {
 const date = generatedAt.slice(0, 10);
 return `sectorcalc-pro-${toolSlug}-decision-${date}.pdf`;
}

function parseCurrency(value: string): number {
 const cleaned = value.replace(/[^0-9.-]/g, "");
 const parsed = Number(cleaned);
 return Number.isFinite(parsed) ? parsed : 0;
}

export function savedReportToPremiumPdfData(report: SavedVerdictReport): PremiumPdfData {
 if (report.margincore) {
 return {
 toolTitle: report.toolTitle,
 toolSlug: report.toolSlug,
 sector: report.sector,
 generatedAt: report.createdAt,
 naivePrice: report.margincore.naivePrice,
 riskBuffer: report.margincore.riskBuffer,
 p90SafePrice: report.margincore.p90SafePrice,
 verdict: report.margincore.verdict,
 matrixRows: report.margincore.matrixRows,
 inputs: report.inputs,
 legalDisclaimer: report.legalDisclaimer,
 };
 }

 const p90SafePrice = parseCurrency(report.result.primaryMetricValue);

 return {
 toolTitle: report.toolTitle,
 toolSlug: report.toolSlug,
 sector: report.sector,
 generatedAt: report.createdAt,
 naivePrice: 0,
 riskBuffer: 0,
 p90SafePrice,
 verdict: report.result.verdict,
 matrixRows: [],
 inputs: report.inputs,
 legalDisclaimer: report.legalDisclaimer,
 };
}

export function parsedVerdictToPremiumPdfData({
 toolTitle,
 toolSlug,
 sector,
 snapshot,
 inputs = [],
}: {
 toolTitle: string;
 toolSlug: string;
 sector: string;
 snapshot: MargincorePdfSnapshot;
 inputs?: VerdictReportInput[];
}): PremiumPdfData {
 return {
 toolTitle,
 toolSlug,
 sector,
 generatedAt: new Date().toISOString(),
 naivePrice: snapshot.naivePrice,
 riskBuffer: snapshot.riskBuffer,
 p90SafePrice: snapshot.p90SafePrice,
 verdict: snapshot.verdict,
 matrixRows: snapshot.matrixRows,
 inputs,
 legalDisclaimer: VERDICT_REPORT_LEGAL_DISCLAIMER,
 };
}

export function formatPremiumPdfGeneratedLabel(isoDate: string): string {
 return formatVerdictReportDate(isoDate);
}
