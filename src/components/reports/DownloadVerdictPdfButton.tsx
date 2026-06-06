"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import { VerdictPdfDocument } from "@/components/reports/VerdictPdfDocument";
import {
  buildVerdictReportFileName,
  type VerdictReportData,
} from "@/lib/reports/verdict-report";
import type { PremiumSeverity } from "@/lib/tools/premium-tool-results";

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
  const fileName = buildVerdictReportFileName(slug, data.generatedAt);

  return (
    <PDFDownloadLink
      document={<VerdictPdfDocument data={data} severity={severity} />}
      fileName={fileName}
      className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-slate/15 bg-white px-5 text-sm font-semibold text-deep-navy transition-colors hover:border-professional-blue hover:text-professional-blue"
    >
      {({ loading }) => (loading ? "Preparing PDF…" : "Download Verdict PDF")}
    </PDFDownloadLink>
  );
}
