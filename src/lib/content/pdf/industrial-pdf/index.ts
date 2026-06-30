/**
 * Industrial PDF Report — public API
 */

export { IndustrialPdfDocument } from "@/lib/content/pdf/industrial-pdf/IndustrialPdfDocument";
export type { IndustrialPdfData, PdfSeverityLevel, PdfChartConfig, PdfBarChartData } from "@/lib/content/pdf/industrial-pdf/types";
export { buildIndustrialPdfData } from "@/lib/content/pdf/industrial-pdf/types";
export { bridgePayloadToIndustrialPdf, savedReportToPremiumExportPayload } from "@/lib/content/pdf/industrial-pdf/bridge";
export { renderIndustrialPdf, buildIndustrialPdfFileName } from "@/lib/content/pdf/industrial-pdf/render";
export { getPdfLabels, PDF_LABELS } from "@/lib/content/pdf/industrial-pdf/i18n";
export type { PdfReportLabels } from "@/lib/content/pdf/industrial-pdf/i18n";
export { resolveEngineeringContent } from "@/lib/content/pdf/industrial-pdf/content/engineering-explanations";
