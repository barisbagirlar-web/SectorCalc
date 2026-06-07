"use server";

import React from "react";
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import { PremiumPdfTemplate } from "@/components/reports/PremiumPdfTemplate";
import { verifyProSubscriber } from "@/lib/billing/verify-pro-subscriber";
import {
 buildPremiumPdfFileName,
 parsedVerdictToPremiumPdfData,
 savedReportToPremiumPdfData,
 type MargincorePdfSnapshot,
 type PremiumPdfData,
} from "@/lib/reports/premium-pdf-data";
import { getVerdictReportByIdAdmin } from "@/lib/reports/report-admin";
import type { VerdictReportInput } from "@/lib/reports/verdict-report";

export type GeneratePremiumPdfResult =
 | { ok: true; pdfBase64: string; fileName: string }
 | { ok: false; error: string };

async function renderPremiumPdfBuffer(data: PremiumPdfData): Promise<Buffer> {
 const element = React.createElement(PremiumPdfTemplate, { data });
 return renderToBuffer(
 element as React.ReactElement<DocumentProps>
 );
}

export async function generatePremiumPdf({
 reportId,
 idToken,
}: {
 reportId: string;
 idToken: string;
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
 const buffer = await renderPremiumPdfBuffer(data);

 return {
 ok: true,
 pdfBase64: buffer.toString("base64"),
 fileName: buildPremiumPdfFileName(report.toolSlug, report.createdAt),
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
}: {
 idToken: string;
 toolTitle: string;
 toolSlug: string;
 sector: string;
 snapshot: MargincorePdfSnapshot;
 inputs?: VerdictReportInput[];
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
 const buffer = await renderPremiumPdfBuffer(data);

 return {
 ok: true,
 pdfBase64: buffer.toString("base64"),
 fileName: buildPremiumPdfFileName(toolSlug, data.generatedAt),
 };
 } catch {
 return { ok: false, error: "Could not generate PDF." };
 }
}
