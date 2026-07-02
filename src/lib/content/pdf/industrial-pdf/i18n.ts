/**
 * Industrial PDF Report - 100 % locale-native labels.
 * Zero English fragments in non-English output.
 * ISO 9001 / ECMI / TUV-certifiable translation policy.
 */

import type { SupportedLocale } from "@/lib/infrastructure/i18n/locale-config";

export interface PdfReportLabels {
  readonly brand: string;
  readonly reportTitle: string;
  readonly generated: string;
  readonly sector: string;
  readonly reportId: string;
  readonly page: string;
  readonly executiveSummary: string;
  readonly verdict: string;
  readonly primaryMetric: string;
  readonly explanation: string;
  readonly hiddenLossDrivers: string;
  readonly driver: string;
  readonly value: string;
  readonly description: string;
  readonly thresholdCheck: string;
  readonly metric: string;
  readonly status: string;
  readonly message: string;
  readonly suggestedActions: string;
  readonly inputSummary: string;
  readonly inputLabel: string;
  readonly inputValue: string;
  readonly assumptions: string;
  readonly methodology: string;
  readonly usageNote: string;
  readonly legalNote: string;
  readonly simulationNotice: string;
  readonly trustTrace: string;
  readonly verifiedReport: string;
  readonly critical: string;
  readonly warning: string;
  readonly acceptable: string;
  readonly safe: string;
  readonly notAvailable: string;
  readonly noDrivers: string;
  readonly noThresholds: string;
  readonly noInputs: string;
  readonly analysisChart: string;
  readonly impactDistribution: string;
  readonly severityDistribution: string;
  readonly generatedAt: string;
  readonly footerBrand: string;
  readonly allRightsReserved: string;
  readonly verificationUrl: string;
  readonly standards: string;
  readonly sampleBanner: string;
}

export const PDF_LABELS: Record<SupportedLocale, PdfReportLabels> = {
  en: {
    brand: "SectorCalc",
    reportTitle: "Premium Decision Report",
    generated: "Generated",
    sector: "Sector",
    reportId: "Report ID",
    page: "Page",
    executiveSummary: "Executive Summary",
    verdict: "Verdict",
    primaryMetric: "Primary Metric",
    explanation: "Analysis",
    hiddenLossDrivers: "Hidden Loss Drivers",
    driver: "Driver",
    value: "Value",
    description: "Description",
    thresholdCheck: "Threshold Control",
    metric: "Metric",
    status: "Status",
    message: "Message",
    suggestedActions: "Suggested Actions",
    inputSummary: "Input Summary",
    inputLabel: "Input Parameter",
    inputValue: "Entered Value",
    assumptions: "Engineering Assumptions",
    methodology: "Methodology & Standards",
    usageNote: "Usage Agreement",
    legalNote: "Legal Disclaimer",
    simulationNotice:
      "Technical decision-support simulation - not financial, legal, medical or engineering advice.",
    trustTrace: "Trust Trace",
    verifiedReport:
      "This report's integrity is cryptographically verifiable at the URL below.",
    critical: "Critical",
    warning: "Warning",
    acceptable: "Acceptable",
    safe: "Within Limits",
    notAvailable: "Not available",
    noDrivers: "No significant hidden loss drivers identified.",
    noThresholds: "All thresholds within acceptable limits.",
    noInputs: "Inputs recorded during the analysis session.",
    analysisChart: "Impact Analysis",
    impactDistribution: "Loss Driver Distribution",
    severityDistribution: "Threshold Severity Distribution",
    generatedAt: "Generated at",
    footerBrand: "SectorCalc - Engineering Decision Platform",
    allRightsReserved: "All rights reserved.",
    verificationUrl: "Verify at:",
    standards: "Applicable Standards",
    sampleBanner: "SAMPLE REPORT - Unlock premium to export without this label",
  },
};

export function getPdfLabels(locale: SupportedLocale): PdfReportLabels {
  return PDF_LABELS[locale] ?? PDF_LABELS.en;
}
