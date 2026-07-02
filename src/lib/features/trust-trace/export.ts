/**
 * Export helpers - HTML/CSV/Word for approved reports (no heavy deps)
 */
import type { ApprovedReportPayload } from "./types";
import { buildQrCodeImageUrl } from "./verification";

export interface TrustTraceLabels {
  readonly htmlLang: string;
  readonly reportTitle: string;
  readonly trustTrace: string;
  readonly scanToVerify: string;
  readonly validation: string;
  readonly field: string;
  readonly value: string;
  readonly validationStamp: string;
  readonly calculationHash: string;
  readonly formulaVersion: string;
  readonly verifyUrl: string;
  readonly inputSnapshot: string;
  readonly resultSnapshot: string;
  readonly input: string;
  readonly output: string;
  readonly reportId: string;
  readonly issued: string;
  readonly tool: string;
  readonly disclaimer: string;
  readonly issuedStatus: string;
}

const EN_LABELS: TrustTraceLabels = {
  htmlLang: "en",
  reportTitle: "SectorCalc Approved Calculation Report",
  trustTrace: "Trust Trace",
  scanToVerify: "Scan to verify this report on SectorCalc.com",
  validation: "Validation",
  field: "Field",
  value: "Value",
  validationStamp: "Validation Stamp",
  calculationHash: "Calculation Hash",
  formulaVersion: "Formula Version",
  verifyUrl: "Verify URL",
  inputSnapshot: "Input Snapshot",
  resultSnapshot: "Result Snapshot",
  input: "Input",
  output: "Output",
  reportId: "Report ID",
  issued: "Issued",
  tool: "Tool",
  disclaimer: "Technical simulation only. Not financial, legal, or engineering advice.",
  issuedStatus: "ISSUED",
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function snapshotRows(snapshot: Record<string, unknown>): string {
  return Object.entries(snapshot)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:4px 8px;border:1px solid #e5e7eb;font-weight:500">${escapeHtml(k)}</td><td style="padding:4px 8px;border:1px solid #e5e7eb">${escapeHtml(String(v ?? ""))}</td></tr>`
    )
    .join("\n");
}

/**
 * Build a print-ready HTML representation of an approved report.
 */
export function buildApprovedReportHtml(
  report: ApprovedReportPayload,
  labels: TrustTraceLabels = EN_LABELS,
): string {
  const qrImageUrl = buildQrCodeImageUrl(report.qrTargetUrl, 140);
  return (
    "<!DOCTYPE html>\n" +
    `<html lang="${escapeHtml(labels.htmlLang)}">\n` +
    "<head>\n" +
    '<meta charset="UTF-8" />\n' +
    '<meta name="viewport" content="width=device-width, initial-scale=1.0" />\n' +
    "<title>SectorCalc Approved Report " +
    escapeHtml(report.reportId) +
    "</title>\n" +
    "<style>\n" +
    "body{font-family:system-ui,sans-serif;color:#1a1915;margin:0;padding:24px}\n" +
    "h1{font-size:1.25rem;margin-bottom:4px}\n" +
    ".stamp{display:inline-block;background:#f0fdf4;color:#15803d;border:1px solid #86efac;border-radius:4px;padding:2px 10px;font-size:0.8rem;font-weight:600}\n" +
    "table{border-collapse:collapse;width:100%;margin-bottom:16px}\n" +
    "th{background:#f9fafb;text-align:left;padding:4px 8px;border:1px solid #e5e7eb;font-size:0.8rem;color:#6b7280}\n" +
    ".meta{font-size:0.8rem;color:#6b7280;margin-bottom:16px}\n" +
    ".section-title{font-size:0.9rem;font-weight:600;margin:16px 0 4px}\n" +
    ".disclaimer{font-size:0.7rem;color:#9ca3af;margin-top:24px;border-top:1px solid #e5e7eb;padding-top:12px}\n" +
    ".trust-trace{display:flex;gap:16px;align-items:flex-start;margin:16px 0;padding:12px;border:1px solid #e5e7eb;border-radius:8px;background:#f9fafb}\n" +
    ".trust-trace img{width:140px;height:140px}\n" +
    "@media print{body{padding:0}}\n" +
    "</style>\n" +
    "</head>\n" +
    "<body>\n" +
    `<h1>${escapeHtml(labels.reportTitle)}</h1>\n` +
    '<p class="meta">\n' +
    `<span class="stamp">${escapeHtml(labels.issuedStatus)}</span>&nbsp;\n` +
    `${escapeHtml(labels.reportId)}: <strong>` +
    escapeHtml(report.reportId) +
    `</strong> &nbsp;|&nbsp;\n` +
    `${escapeHtml(labels.issued)}: ` +
    escapeHtml(report.issuedAt) +
    ` &nbsp;|&nbsp;\n` +
    `${escapeHtml(labels.tool)}: ` +
    escapeHtml(report.toolSlug) +
    "\n</p>\n" +
    "\n</p>\n" +
    '<div class="trust-trace">\n' +
    '<img src="' +
    escapeHtml(qrImageUrl) +
    '" alt="Trust Trace QR" width="140" height="140" />\n' +
    "<div>\n" +
    `<div class="section-title">${escapeHtml(labels.trustTrace)}</div>\n` +
    `<p>${escapeHtml(labels.scanToVerify)}</p>\n` +
    "</div>\n" +
    "</div>\n" +
    `<div class="section-title">${escapeHtml(labels.validation)}</div>\n` +
    "<table>\n" +
    `<tr><th>${escapeHtml(labels.field)}</th><th>${escapeHtml(labels.value)}</th></tr>\n` +
    `<tr><td style="padding:4px 8px;border:1px solid #e5e7eb">${escapeHtml(labels.validationStamp)}</td><td style="padding:4px 8px;border:1px solid #e5e7eb">` +
    escapeHtml(report.validationStampId) +
    "</td></tr>\n" +
    `<tr><td style="padding:4px 8px;border:1px solid #e5e7eb">${escapeHtml(labels.calculationHash)}</td><td style="padding:4px 8px;border:1px solid #e5e7eb;font-family:monospace;font-size:0.7rem">` +
    escapeHtml(report.calculationHash) +
    "</td></tr>\n" +
    `<tr><td style="padding:4px 8px;border:1px solid #e5e7eb">${escapeHtml(labels.formulaVersion)}</td><td style="padding:4px 8px;border:1px solid #e5e7eb">` +
    escapeHtml(report.formulaVersion) +
    "</td></tr>\n" +
    `<tr><td style="padding:4px 8px;border:1px solid #e5e7eb">${escapeHtml(labels.verifyUrl)}</td><td style="padding:4px 8px;border:1px solid #e5e7eb"><a href="` +
    escapeHtml(report.qrTargetUrl) +
    '">' +
    escapeHtml(report.qrTargetUrl) +
    "</a></td></tr>\n" +
    "</table>\n" +
    `<div class="section-title">${escapeHtml(labels.inputSnapshot)}</div>\n` +
    `<table><tr><th>${escapeHtml(labels.input)}</th><th>${escapeHtml(labels.value)}</th></tr>\n` +
    snapshotRows(report.inputSnapshot) +
    "\n</table>\n" +
    `<div class="section-title">${escapeHtml(labels.resultSnapshot)}</div>\n` +
    `<table><tr><th>${escapeHtml(labels.output)}</th><th>${escapeHtml(labels.value)}</th></tr>\n` +
    snapshotRows(report.resultSnapshot) +
    "\n</table>\n" +
    '<div class="disclaimer">\n' +
    `${escapeHtml(labels.disclaimer)} ` +
    `${escapeHtml(labels.reportId)}: ` +
    escapeHtml(report.reportId) +
    ". Disclaimer v" +
    escapeHtml(report.disclaimerVersion) +
    ".\n</div>\n" +
    "</body>\n</html>"
  );
}

/**
 * Build a CSV export of an approved report.
 */
export function buildApprovedReportCsv(
  report: ApprovedReportPayload,
  labels: TrustTraceLabels = EN_LABELS,
): string {
  const header = `${labels.field},${labels.value}`;

  const metaRows = [
    `"${labels.reportId}","${report.reportId.replace(/"/g, '""')}"`,
    `"${labels.tool}","${report.toolSlug.replace(/"/g, '""')}"`,
    `"${labels.formulaVersion}","${report.formulaVersion.replace(/"/g, '""')}"`,
    `"${labels.validationStamp}","${report.validationStampId.replace(/"/g, '""')}"`,
    `"${labels.calculationHash}","${report.calculationHash.replace(/"/g, '""')}"`,
    `"${labels.issued}","${report.issuedAt.replace(/"/g, '""')}"`,
    `"${labels.verifyUrl}","${report.qrTargetUrl.replace(/"/g, '""')}"`,
  ].join("\n");

  const inputRows = Object.entries(report.inputSnapshot)
    .map(
      ([k, v]) =>
        `"${labels.input}","` +
        k.replace(/"/g, '""') +
        '","' +
        String(v ?? "").replace(/"/g, '""') +
        '"'
    )
    .join("\n");

  const resultRows = Object.entries(report.resultSnapshot)
    .map(
      ([k, v]) =>
        `"${labels.output}","` +
        k.replace(/"/g, '""') +
        '","' +
        String(v ?? "").replace(/"/g, '""') +
        '"'
    )
    .join("\n");

  return [header, metaRows, inputRows, resultRows].filter(Boolean).join("\n");
}

/**
 * Build a Word-compatible HTML export of an approved report.
 */
export function buildApprovedReportWordHtml(
  report: ApprovedReportPayload,
  labels: TrustTraceLabels = EN_LABELS,
): string {
  return (
    '<html xmlns:o="urn:schemas-microsoft-com:office:office"\n' +
    '  xmlns:w="urn:schemas-microsoft-com:office:word"\n' +
    '  xmlns="http://www.w3.org/TR/REC-html40">\n' +
    "<head>\n" +
    '<meta charset="UTF-8"/>\n' +
    "<title>SectorCalc Report " +
    escapeHtml(report.reportId) +
    "</title>\n" +
    "<style>\n" +
    "body{font-family:Calibri,sans-serif;font-size:11pt}\n" +
    "h1{font-size:14pt}\n" +
    "table{border-collapse:collapse;width:100%}\n" +
    "td,th{border:1px solid #d1d5db;padding:4pt 8pt;font-size:10pt}\n" +
    "th{background:#f3f4f6;font-weight:bold}\n" +
    "</style>\n" +
    "</head>\n" +
    "<body>\n" +
    `<h1>${escapeHtml(labels.reportTitle)}</h1>\n` +
    `<p>${escapeHtml(labels.reportId)}: <strong>` +
    escapeHtml(report.reportId) +
    `</strong></p>\n` +
    `<p>${escapeHtml(labels.tool)}: ` +
    escapeHtml(report.toolSlug) +
    ` | ${escapeHtml(labels.issued)}: ` +
    escapeHtml(report.issuedAt) +
    `</p>\n` +
    `<p>${escapeHtml(labels.validationStamp)}: ` +
    escapeHtml(report.validationStampId) +
    `</p>\n` +
    `<h2>${escapeHtml(labels.inputSnapshot)}</h2>\n` +
    `<table><tr><th>${escapeHtml(labels.input)}</th><th>${escapeHtml(labels.value)}</th></tr>` +
    snapshotRows(report.inputSnapshot) +
    "</table>\n" +
    `<h2>${escapeHtml(labels.resultSnapshot)}</h2>\n` +
    `<table><tr><th>${escapeHtml(labels.output)}</th><th>${escapeHtml(labels.value)}</th></tr>` +
    snapshotRows(report.resultSnapshot) +
    "</table>\n" +
    '<p style="font-size:8pt;color:#9ca3af">\n' +
    `${escapeHtml(labels.disclaimer)}\n` +
    "SectorCalc.com | Disclaimer v" +
    escapeHtml(report.disclaimerVersion) +
    "\n</p>\n" +
    "</body>\n</html>"
  );
}
