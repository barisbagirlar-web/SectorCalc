/**
 * Industrial PDF Report — public API
 */

export { IndustrialPdfDocument } from "@/lib/pdf/industrial-pdf/IndustrialPdfDocument";
export type { IndustrialPdfData, PdfSeverityLevel, PdfChartConfig, PdfBarChartData } from "@/lib/pdf/industrial-pdf/types";
export { buildIndustrialPdfData } from "@/lib/pdf/industrial-pdf/types";
export { bridgePayloadToIndustrialPdf } from "@/lib/pdf/industrial-pdf/bridge";
export { renderIndustrialPdf, buildIndustrialPdfFileName } from "@/lib/pdf/industrial-pdf/render";
export { getPdfLabels, PDF_LABELS } from "@/lib/pdf/industrial-pdf/i18n";
export type { PdfReportLabels } from "@/lib/pdf/industrial-pdf/i18n";
export { resolveEngineeringContent } from "@/lib/pdf/industrial-pdf/content/engineering-explanations";
