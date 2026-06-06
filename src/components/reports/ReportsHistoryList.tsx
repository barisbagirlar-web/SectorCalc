"use client";

import Link from "next/link";
import { formatVerdictReportDate } from "@/lib/reports/verdict-report";
import type { SavedVerdictReport } from "@/lib/reports/report-storage";
import { getFreeToolsHref, getLoginHref } from "@/lib/tools/tool-links";

interface ReportsHistoryListProps {
  reports: SavedVerdictReport[];
}

export function ReportsHistoryList({ reports }: ReportsHistoryListProps) {
  if (reports.length === 0) {
    return (
      <div className="sc-card border-dashed text-center">
        <p className="text-base font-medium text-deep-navy dark:text-off-white">
          No reports yet.
        </p>
        <p className="mt-2 text-sm text-slate">
          Run your first free margin check to see where pricing risk appears.
        </p>
        <Link href={getFreeToolsHref()} className="sc-btn-primary mt-6 inline-flex">
          Run Free Check
        </Link>
      </div>
    );
  }

  return (
    <ul className="grid min-w-0 gap-6 sm:grid-cols-2">
      {reports.map((report) => (
        <li key={report.id}>
          <article className="sc-card sc-card-interactive flex h-full flex-col">
            <p className="text-xs font-semibold uppercase tracking-wider text-professional-blue">
              {report.sector}
            </p>
            <h2 className="mt-2 text-lg font-bold text-deep-navy dark:text-off-white">
              {report.toolTitle}
            </h2>
            <p className="mt-3 text-sm font-semibold text-deep-navy dark:text-off-white">
              {report.result.verdict}
            </p>
            <p className="mt-2 text-sm text-slate">{report.result.primaryMetricValue}</p>
            <p className="mt-3 text-xs text-slate">
              {formatVerdictReportDate(report.createdAt)}
            </p>
            <Link
              href={`/account/reports/${report.id}`}
              className="sc-btn-secondary mt-5 inline-flex"
            >
              View report
            </Link>
          </article>
        </li>
      ))}
    </ul>
  );
}

interface AccountLoginPromptProps {
  nextPath: string;
}

export function AccountLoginPrompt({ nextPath }: AccountLoginPromptProps) {
  const loginHref = getLoginHref(nextPath);

  return (
    <aside className="sc-card mx-auto max-w-2xl">
      <p className="text-xs font-semibold uppercase tracking-wider text-professional-blue">
        Sign in required
      </p>
      <h2 className="mt-3 text-xl font-bold text-deep-navy dark:text-off-white sm:text-2xl">
        Sign in to view saved reports
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-slate">
        Saved verdict reports are linked to your SectorCalc account.
      </p>
      <Link href={loginHref} className="sc-btn-primary mt-6 inline-flex w-full sm:w-auto">
        Sign in
      </Link>
    </aside>
  );
}
