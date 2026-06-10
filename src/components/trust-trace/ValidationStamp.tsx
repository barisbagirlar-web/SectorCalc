"use client";

import type { ApprovedReportPayload } from "@/lib/trust-trace/types";

type Props = {
  report: ApprovedReportPayload;
  locale?: string;
};

export function ValidationStamp({ report, locale: _locale }: Props) {
  return (
    <div
      data-validation-stamp="true"
      className="flex items-start gap-3 rounded-md border border-green-200 bg-green-50 p-3"
    >
      <div className="mt-0.5 flex-shrink-0">
        <svg
          className="h-4 w-4 text-green-600"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-green-800">
          Approved Calculation Report
        </p>
        <p className="mt-0.5 break-all font-mono text-xs text-green-700">
          {report.reportId}
        </p>
        <p className="mt-0.5 text-xs text-green-600">
          Stamp: <span className="font-mono">{report.validationStampId.slice(0, 40)}…</span>
        </p>
        <a
          href={report.qrTargetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-block text-xs text-green-700 underline hover:text-green-900"
        >
          Verify online
        </a>
      </div>
    </div>
  );
}