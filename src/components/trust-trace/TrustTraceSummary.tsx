"use client";

import type { ApprovedReportPayload } from "@/lib/trust-trace/types";

type Props = {
  report: ApprovedReportPayload;
};

export function TrustTraceSummary({ report }: Props) {
  return (
    <div
      data-trust-trace-summary="true"
      className="space-y-2 rounded-md border border-gray-200 bg-gray-50 p-3 text-xs text-gray-600"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold text-gray-700">Calculation Summary</span>
        <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
          {report.status.toUpperCase()}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
        <div>
          <span className="text-gray-400">Report ID</span>
          <p className="break-all font-mono text-xs text-gray-700">{report.reportId}</p>
        </div>
        <div>
          <span className="text-gray-400">Formula Version</span>
          <p className="font-mono text-xs text-gray-700">{report.formulaVersion}</p>
        </div>
        <div>
          <span className="text-gray-400">Issued</span>
          <p className="text-xs text-gray-700">
            {new Date(report.issuedAt).toLocaleString()}
          </p>
        </div>
        <div>
          <span className="text-gray-400">Tool</span>
          <p className="font-mono text-xs text-gray-700">{report.toolSlug}</p>
        </div>
      </div>
      <div>
        <span className="text-gray-400">Hash (SHA-256)</span>
        <p className="break-all font-mono text-xs text-gray-500">
          {report.calculationHash}
        </p>
      </div>
      <div className="border-t border-gray-200 pt-1 text-xs text-gray-400">
        Technical simulation. Not financial, legal, or engineering advice. Disclaimer v{report.disclaimerVersion}.
      </div>
    </div>
  );
}