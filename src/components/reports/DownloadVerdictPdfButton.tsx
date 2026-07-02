"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import { useLocale, useTranslations } from "@/lib/i18n-stub";
import { IndustrialPdfDocument } from "@/lib/content/pdf/industrial-pdf/IndustrialPdfDocument";
import { buildIndustrialPdfFileName } from "@/lib/content/pdf/industrial-pdf/render";
import type { IndustrialPdfData } from "@/lib/content/pdf/industrial-pdf/types";
import {
  REVENUE_EVENTS,
  trackRevenueEvent,
} from "@/lib/infrastructure/analytics/revenue-events";
import type { VerdictReportData } from "@/lib/features/reports/verdict-report";
import type { SupportedLocale } from "@/lib/infrastructure/i18n/locale-config";
import type { PremiumSeverity } from "@/lib/features/tools/premium-tool-results";

function verdictReportToIndustrialPdfData(
  data: VerdictReportData,
  slug: string,
  severity: PremiumSeverity,
  locale: string,
): IndustrialPdfData {
  const severityMap: Record<PremiumSeverity, "critical" | "warning" | "acceptable"> = {
    danger: "critical",
    watch: "warning",
    safe: "acceptable",
  };
  return {
    locale: locale as SupportedLocale,
    reportId: `${slug}-${Date.parse(data.generatedAt)}`,
    generatedAt: data.generatedAt,
    schemaSlug: slug,
    schemaName: data.toolTitle,
    sectorSlug: data.sector,
    title: data.toolTitle,
    executiveVerdict: {
      status: severityMap[severity] ?? "warning",
      verdict: data.verdict,
      explanation: data.headline,
    },
    bigNumber: {
      label: data.primaryMetricLabel,
      value: data.primaryMetricValue,
      rawValue: parseFloat(data.primaryMetricValue.replace(/[^0-9.,\-]/g, "").replace(",", ".")) || 0,
      unit: "",
    },
    hiddenDrivers: data.riskDrivers.map((d) => ({
      label: d,
      value: d,
      rawValue: 0,
      description: d,
    })),
    thresholds: data.validationNotes.map((note) => ({
      label: "Validation",
      level: "acceptable" as const,
      value: "",
      message: note,
    })),
    suggestedActions: data.suggestedAction ? [data.suggestedAction] : [],
    inputs: data.inputs.map((i) => ({
      label: i.label,
      value: i.value,
    })),
    assumptions: data.assumptions,
    legalNote: data.legalDisclaimer,
    methodologyNote: data.methodologyNote,
    usageNote: data.usageNote,
    isSample: false,
  };
}

interface DownloadVerdictPdfButtonProps {
  data: VerdictReportData;
  slug: string;
  severity: PremiumSeverity;
}

export function DownloadVerdictPdfButton({
  data,
  slug,
  severity,
}: DownloadVerdictPdfButtonProps) {
  const locale = useLocale();
  const t = useTranslations("premiumDecisionReport.export");
  const pdfData = verdictReportToIndustrialPdfData(data, slug, severity, locale);
  const fileName = buildIndustrialPdfFileName(slug, locale, data.generatedAt);

  return (
    <PDFDownloadLink
      document={<IndustrialPdfDocument data={pdfData} />}
      fileName={fileName}
      onClick={() =>
        trackRevenueEvent(REVENUE_EVENTS.verdict_pdf_downloaded, { slug })
      }
      className="inline-flex min-h-[44px] w-full items-center justify-center rounded-lg border border-border-subtle bg-white px-5 text-sm font-semibold text-text-primary transition-colors hover:border-deep-navy hover:text-deep-navy sm:w-auto"
    >
      {({ loading }) =>
        loading ? t("preparingPdf") : t("downloadPdf")
      }
    </PDFDownloadLink>
  );
}
