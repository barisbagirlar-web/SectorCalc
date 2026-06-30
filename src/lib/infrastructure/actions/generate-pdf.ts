"use server";

import React from "react";
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import { IndustrialPdfDocument, buildIndustrialPdfFileName } from "@/lib/content/pdf/industrial-pdf";
import { bridgePayloadToIndustrialPdf } from "@/lib/content/pdf/industrial-pdf/bridge";
import { verifyProSubscriber } from "@/lib/features/billing/verify-pro-subscriber";
import {
  parsedVerdictToPremiumPdfData,
  savedReportToPremiumPdfData,
  type MargincorePdfSnapshot,
  type PremiumPdfData,
} from "@/lib/features/reports/premium-pdf-data";
import { getVerdictReportByIdAdmin } from "@/lib/features/reports/report-admin";
import type { VerdictReportInput } from "@/lib/features/reports/verdict-report";
import type { SupportedLocale } from "@/lib/infrastructure/i18n/locale-config";

export type GeneratePremiumPdfResult =
  | { ok: true; pdfBase64: string; fileName: string }
  | { ok: false; error: string };

async function renderIndustrialBuffer(data: PremiumPdfData, locale: SupportedLocale = "en"): Promise<Buffer> {
  const industrialData = bridgePayloadToIndustrialPdf(
    {
      reportId: `${data.toolSlug}-${Date.parse(data.generatedAt)}`,
      generatedAt: data.generatedAt,
      schemaSlug: data.toolSlug,
      schemaName: data.toolTitle,
      sectorSlug: data.sector,
      title: data.toolTitle,
      executiveVerdict: {
        status: "warning",
        verdict: data.verdict,
        explanation: data.verdict,
      },
      bigNumber: {
        label: "P90 Safe Price",
        value: `$${data.p90SafePrice.toFixed(2)}`,
        rawValue: data.p90SafePrice,
        unit: data.sector,
      },
      hiddenDrivers: data.matrixRows.map((row) => ({
        label: row.scenario,
        value: row.deltaAmount,
        rawValue: parseFloat(row.deltaAmount.replace(/[^0-9.-]/g, "")) || 0,
        description: `${row.deltaPercent} impact on P90 adjusted price`,
      })),
      thresholds: [],
      suggestedActions: [],
      assumptions: [],
      legalNote: data.legalDisclaimer,
    },
    locale,
    {
      inputs: data.inputs.map((input) => ({
        label: input.label,
        value: input.value,
      })),
    },
  );
  const element = React.createElement(IndustrialPdfDocument, { data: industrialData });
  return renderToBuffer(element as React.ReactElement<DocumentProps>);
}

export async function generatePremiumPdf({
  reportId,
  idToken,
  locale = "en",
}: {
  reportId: string;
  idToken: string;
  locale?: SupportedLocale;
}): Promise<GeneratePremiumPdfResult> {
  const uid = await verifyProSubscriber(idToken);
  if (!uid) {
    return { ok: false, error: "Pro subscription required." };
  }

  const report = await getVerdictReportByIdAdmin(reportId);
  if (!report || report.uid !== uid) {
    return { ok: false, error: "Report not found." };
  }

  try {
    const data = savedReportToPremiumPdfData(report);
    const buffer = await renderIndustrialBuffer(data, locale);
    return {
      ok: true,
      pdfBase64: buffer.toString("base64"),
      fileName: buildIndustrialPdfFileName(report.toolSlug, locale, report.createdAt),
    };
  } catch {
    return { ok: false, error: "Could not generate PDF." };
  }
}

export async function generatePremiumPdfFromAnalysis({
  idToken,
  toolTitle,
  toolSlug,
  sector,
  snapshot,
  inputs = [],
  locale = "en",
}: {
  idToken: string;
  toolTitle: string;
  toolSlug: string;
  sector: string;
  snapshot: MargincorePdfSnapshot;
  inputs?: VerdictReportInput[];
  locale?: SupportedLocale;
}): Promise<GeneratePremiumPdfResult> {
  const uid = await verifyProSubscriber(idToken);
  if (!uid) {
    return { ok: false, error: "Pro subscription required." };
  }

  try {
    const data = parsedVerdictToPremiumPdfData({
      toolTitle,
      toolSlug,
      sector,
      snapshot,
      inputs,
    });
    const buffer = await renderIndustrialBuffer(data, locale);
    return {
      ok: true,
      pdfBase64: buffer.toString("base64"),
      fileName: buildIndustrialPdfFileName(toolSlug, locale, data.generatedAt),
    };
  } catch {
    return { ok: false, error: "Could not generate PDF." };
  }
}
