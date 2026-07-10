// SectorCalc PRO V2 — Export PDF Report
// Uses @react-pdf/renderer to generate a dedicated PDF blob (not browser print).
import { pdf } from "@react-pdf/renderer";
import ProReportPdfDocument from "./ProReportPdfDocument";
import type { ProInsightReport } from "../proInsightContract";

/**
 * Generate a PDF from a ProInsightReport and trigger a browser download.
 * Runs entirely client-side using @react-pdf/renderer.
 */
export async function exportProReportPdf(
  report: ProInsightReport,
  toolKey: string,
): Promise<void> {
  const reportId = report.traceId ?? `pro-v2-${Date.now()}`;
  const blob = await pdf(
    <ProReportPdfDocument report={report} />,
  ).toBlob();

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `sectorcalc-${toolKey}-${reportId.slice(0, 12)}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
