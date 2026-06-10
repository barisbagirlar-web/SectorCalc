"use client";

import { useState } from "react";
import type { ApprovedReportPayload } from "@/lib/trust-trace/types";
import {
  buildApprovedReportHtml,
  buildApprovedReportCsv,
  buildApprovedReportWordHtml,
} from "@/lib/trust-trace/export";

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
  const [copied, setCopied] = useState(false);

  function handleCopyReportId() {
    navigator.clipboard.writeText(report.reportId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleDownloadHtml() {
    const html = buildApprovedReportHtml(report);
    downloadBlob(html, `${report.reportId}.html`, "text/html;charset=utf-8");
  }

  function handleDownloadCsv() {
    const csv = buildApprovedReportCsv(report);
    downloadBlob(csv, `${report.reportId}.csv`, "text/csv;charset=utf-8");
  }

  function handleDownloadWord() {
    const word = buildApprovedReportWordHtml(report);
    downloadBlob(
      word,
      `${report.reportId}.doc`,
      "application/msword;charset=utf-8"
    );
  }

  function handlePrint() {
    const html = buildApprovedReportHtml(report);
    const win = window.open("", "_blank");
    if (win) {
      win.document.write(html);
      win.document.close();
      win.print();
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
        {copied ? "Copied!" : "Copy Report ID"}
      </button>

      <button
        type="button"
        onClick={handleDownloadHtml}
        className="inline-flex items-center gap-1.5 rounded border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Download PDF/HTML
      </button>

      <button
        type="button"
        onClick={handleDownloadCsv}
        className="inline-flex items-center gap-1.5 rounded border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Download CSV
      </button>

      <button
        type="button"
        onClick={handleDownloadWord}
        className="inline-flex items-center gap-1.5 rounded border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Download Word
      </button>

      <button
        type="button"
        onClick={handlePrint}
        className="inline-flex items-center gap-1.5 rounded border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Print
      </button>

      <a
        href={report.qrTargetUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded border border-blue-300 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        data-report-qr-block="true"
      >
        Verify Online
      </a>
    </div>
  );
}