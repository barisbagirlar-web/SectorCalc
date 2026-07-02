/**
 * Industrial PDF Renderer - renders IndustrialPdfDocument to buffer.
 */

import React from "react";
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import { IndustrialPdfDocument } from "@/lib/content/pdf/industrial-pdf/IndustrialPdfDocument";
import type { IndustrialPdfData } from "@/lib/content/pdf/industrial-pdf/types";

export async function renderIndustrialPdf(data: IndustrialPdfData): Promise<Buffer> {
  const element = React.createElement(IndustrialPdfDocument, { data });
  return renderToBuffer(element as React.ReactElement<DocumentProps>);
}

export function buildIndustrialPdfFileName(
  schemaSlug: string,
  locale: string,
  generatedAt: string,
): string {
  const date = generatedAt.slice(0, 10).replace(/-/g, "");
  const lang = locale.split("-")[0]?.toLowerCase() || "en";
  return `sectorcalc-${schemaSlug}-report-${date}-${lang}.pdf`;
}
