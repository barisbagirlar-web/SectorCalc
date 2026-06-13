"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import { VerdictPdfDocument } from "@/components/reports/VerdictPdfDocument";
import {
 REVENUE_EVENTS,
 trackRevenueEvent,
} from "@/lib/analytics/revenue-events";
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
 onClick={() =>
 trackRevenueEvent(REVENUE_EVENTS.verdict_pdf_downloaded, { slug })
 }
 className="inline-flex min-h-[44px] w-full items-center justify-center rounded-lg border border-border-subtle bg-white px-5 text-sm font-semibold text-text-primary transition-colors hover:border-deep-navy hover:text-deep-navy sm:w-auto"
 >
 {({ loading }) =>
  loading ? "Preparing PDF…" : "Download Premium Decision Summary PDF"
 }
 </PDFDownloadLink>
 );
}
