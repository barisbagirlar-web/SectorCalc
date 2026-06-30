"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import type { ApprovedReportPayload } from "@/lib/trust-trace/types";
import {
  buildApprovedReportHtml,
  buildApprovedReportCsv,
  buildApprovedReportWordHtml,
} from "@/lib/trust-trace/export";
import { FileDown } from "lucide-react";

type Props = {
  report: ApprovedReportPayload;
};

function downloadBlob(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function ApprovedReportActions({ report }: Props) {
  const t = useTranslations("verify");
  const tt = useTranslations("verify.ttLabels");
  const [copied, setCopied] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  const ttLabels = {
    htmlLang: tt("htmlLang"),
    reportTitle: tt("reportTitle"),
    trustTrace: tt("trustTrace"),
    scanToVerify: tt("scanToVerify"),
    validation: tt("validation"),
    field: tt("field"),
    value: tt("value"),
    validationStamp: tt("validationStamp"),
    calculationHash: tt("calculationHash"),
    formulaVersion: tt("formulaVersion"),
    verifyUrl: tt("verifyUrl"),
    inputSnapshot: tt("inputSnapshot"),
    resultSnapshot: tt("resultSnapshot"),
    input: tt("input"),
    output: tt("output"),
    reportId: tt("reportId"),
    issued: tt("issued"),
    tool: tt("tool"),
    disclaimer: tt("disclaimer"),
    issuedStatus: tt("issuedStatus"),
  };

  function handleCopyReportId() {
    navigator.clipboard.writeText(report.reportId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleDownloadHtml() {
    const html = buildApprovedReportHtml(report, ttLabels);
    downloadBlob(html, `${report.reportId}.html`, "text/html;charset=utf-8");
  }

  function handleDownloadCsv() {
    const csv = buildApprovedReportCsv(report, ttLabels);
    downloadBlob(csv, `${report.reportId}.csv`, "text/csv;charset=utf-8");
  }

  function handleDownloadWord() {
    const word = buildApprovedReportWordHtml(report, ttLabels);
    downloadBlob(
      word,
      `${report.reportId}.doc`,
      "application/msword;charset=utf-8"
    );
  }

  function handlePrint() {
    const html = buildApprovedReportHtml(report, ttLabels);
    const win = window.open("", "_blank");
    if (win) {
      win.document.write(html);
      win.document.close();
      win.print();
    }
  }

  async function handleDownloadPdf() {
    setPdfLoading(true);
    try {
      const { pdf } = await import("@react-pdf/renderer");
      const { TrustTracePdfDocument } = await import(
        "./TrustTracePdfDocument"
      );
      const blob = await pdf(<TrustTracePdfDocument report={report} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${report.reportId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("[PDF download] failed:", err);
    } finally {
      setPdfLoading(false);
    }
  }

  return (
    <div
      data-approved-report-actions="true"
      className="flex flex-wrap items-center gap-2"
    >
      <button
        type="button"
        onClick={handleCopyReportId}
        className="inline-flex items-center gap-1.5 rounded border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {copied ? t("copied") : t("copyReportId")}
      </button>

      <button
        type="button"
        onClick={handleDownloadHtml}
        className="inline-flex items-center gap-1.5 rounded border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {t("downloadHtml")}
      </button>

      <button
        type="button"
        onClick={handleDownloadCsv}
        className="inline-flex items-center gap-1.5 rounded border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {t("downloadCsv")}
      </button>

      <button
        type="button"
        onClick={handleDownloadWord}
        className="inline-flex items-center gap-1.5 rounded border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {t("downloadWord")}
      </button>

      <button
        type="button"
        onClick={handlePrint}
        className="inline-flex items-center gap-1.5 rounded border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {t("print")}
      </button>

      <button
        type="button"
        onClick={handleDownloadPdf}
        disabled={pdfLoading}
        className="inline-flex items-center gap-1.5 rounded border border-blue-300 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
      >
        <FileDown className="h-3.5 w-3.5" />
        {pdfLoading ? t("loadingPdf") : t("downloadPdf")}
      </button>
    </div>
  );
}
