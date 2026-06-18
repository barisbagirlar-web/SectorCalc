"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("verify");
  const tt = useTranslations("verify.ttLabels");
  const [copied, setCopied] = useState(false);

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
    </div>
  );
}
