/**
 * Industrial PDF Report — type definitions.
 * ECMI / ISO 9001 / TÜV-certifiable data model.
 */

import type { SupportedLocale } from "@/lib/i18n/locale-config";
import type { PremiumReportExportPayload } from "@/lib/premium-schema/premium-report-export";

export type PdfSeverityLevel = "critical" | "warning" | "acceptable" | "safe";

export interface PdfBarChartData {
  readonly label: string;
  readonly value: number;
  readonly color: string;
  readonly formatted: string;
}

export interface PdfPieChartData {
  readonly label: string;
  readonly value: number;
  readonly percentage: number;
  readonly color: string;
}

export interface PdfChartConfig {
  readonly impactBars: readonly PdfBarChartData[];
  readonly distribution: readonly PdfPieChartData[];
}

export interface PdfEngineeringExplanation {
  readonly methodology: string;
  readonly standards: readonly string[];
  readonly formulaDescription: string;
  readonly interpretationGuide: string;
  readonly industryContext: string;
}

export interface IndustrialPdfData {
  readonly locale: SupportedLocale;
  readonly reportId: string;
  readonly generatedAt: string;
  readonly schemaSlug: string;
  readonly schemaName: string;
  readonly sectorSlug: string;
  readonly title: string;
  readonly executiveVerdict: {
    readonly status: PdfSeverityLevel;
    readonly verdict: string;
    readonly explanation: string;
  };
  readonly bigNumber: {
    readonly label: string;
    readonly value: string;
    readonly rawValue: number;
    readonly unit: string;
  };
  readonly hiddenDrivers: readonly {
    readonly label: string;
    readonly value: string;
    readonly rawValue: number;
    readonly description: string;
  }[];
  readonly thresholds: readonly {
    readonly label: string;
    readonly level: PdfSeverityLevel;
    readonly value: string;
    readonly message: string;
  }[];
  readonly suggestedActions: readonly string[];
  readonly inputs: readonly {
    readonly label: string;
    readonly value: string;
  }[];
  readonly assumptions: readonly string[];
  readonly legalNote: string;
  readonly methodologyNote: string;
  readonly usageNote: string;
  readonly verificationUrl?: string;
  readonly chartConfig?: PdfChartConfig;
  readonly engineeringContent?: PdfEngineeringExplanation;
  readonly formulaCategory?: string;
  readonly isSample?: boolean;
}

export function buildIndustrialPdfData(
  payload: PremiumReportExportPayload,
  locale: SupportedLocale,
  options?: {
    readonly verificationUrl?: string;
    readonly inputs?: readonly { readonly label: string; readonly value: string }[];
    readonly chartConfig?: PdfChartConfig;
    readonly engineeringContent?: PdfEngineeringExplanation;
    readonly formulaCategory?: string;
    readonly methodologyNote?: string;
    readonly usageNote?: string;
    readonly isSample?: boolean;
  },
): IndustrialPdfData {
  return {
    locale,
    reportId: payload.reportId,
    generatedAt: payload.generatedAt,
    schemaSlug: payload.schemaSlug,
    schemaName: payload.schemaName,
    sectorSlug: payload.sectorSlug,
    title: payload.title,
    executiveVerdict: {
      status: payload.executiveVerdict.status as PdfSeverityLevel,
      verdict: payload.executiveVerdict.verdict,
      explanation: payload.executiveVerdict.explanation,
    },
    bigNumber: { ...payload.bigNumber },
    hiddenDrivers: [...payload.hiddenDrivers],
    thresholds: payload.thresholds.map((t) => ({
      ...t,
      level: t.level as PdfSeverityLevel,
    })),
    suggestedActions: [...payload.suggestedActions],
    inputs: options?.inputs ?? [],
    assumptions: [...payload.assumptions],
    legalNote: payload.legalNote,
    methodologyNote:
      options?.methodologyNote ??
      "Deterministic calculation based on user-provided inputs and sector-standard assumptions. Results are indicative estimates for decision support.",
    usageNote:
      options?.usageNote ??
      "This report is for internal planning purposes. Do not distribute as an external audit, regulatory filing, or certified measurement record.",
    verificationUrl: options?.verificationUrl,
    chartConfig: options?.chartConfig,
    engineeringContent: options?.engineeringContent,
    formulaCategory: options?.formulaCategory,
    isSample: options?.isSample,
  };
}
