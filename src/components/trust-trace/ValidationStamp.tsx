"use client";

import { useTranslations } from "next-intl";
import type { ApprovedReportPayload } from "@/lib/features/trust-trace/types";

type Props = {
  report: ApprovedReportPayload;
  locale?: string;
};

export function ValidationStamp({ report, locale: _locale }: Props) {
  const t = useTranslations("verify");

  return (
    <div
      data-calculation-summary="true"
      className="flex items-start gap-3 rounded-md border border-blue-200 bg-blue-50 p-3"
    >
      <div className="mt-0.5 flex-shrink-0">
        <svg
          className="h-4 w-4 text-blue-600"
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
        <p className="text-sm font-semibold text-blue-800">
          {t("premiumSummary")}
        </p>
        <p className="mt-0.5 break-all font-mono text-xs text-blue-700">
          {report.reportId}
        </p>
        <p className="mt-0.5 text-xs text-blue-600">
          {t("calcId")}: <span className="font-mono">{report.calculationHash.slice(0, 16)}&hellip;</span>
        </p>
      </div>
    </div>
  );
}
