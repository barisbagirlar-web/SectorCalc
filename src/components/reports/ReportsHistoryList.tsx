"use client";

import Link from "next/link";
import { formatVerdictReportDate } from "@/lib/reports/verdict-report";
import type { SavedVerdictReport } from "@/lib/reports/report-storage";

interface ReportsHistoryListProps {
  reports: SavedVerdictReport[];
}

export function ReportsHistoryList({ reports }: ReportsHistoryListProps) {
  if (reports.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate/20 bg-white p-8 text-center">
        <p className="text-base font-medium text-deep-navy">
          No saved verdict reports yet.
        </p>
        <p className="mt-2 text-sm text-slate">
          Run a premium analyzer and save the verdict to build your decision history.
        </p>
        <Link
          href="/tools/premium/cnc-quote-risk-analyzer"
          className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-lg bg-professional-blue px-5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Open premium analyzers
        </Link>
      </div>
    );
  }

  return (
    <ul className="grid min-w-0 gap-4 sm:grid-cols-2">
      {reports.map((report) => (
        <li key={report.id}>
          <article className="flex h-full flex-col rounded-xl border border-slate/15 bg-white p-5 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-wider text-professional-blue">
              {report.sector}
            </p>
            <h2 className="mt-2 text-lg font-bold text-deep-navy">{report.toolTitle}</h2>
            <p className="mt-3 text-sm font-semibold text-deep-navy">{report.result.verdict}</p>
            <p className="mt-2 text-sm text-slate">{report.result.primaryMetricValue}</p>
            <p className="mt-3 text-xs text-slate">
              {formatVerdictReportDate(report.createdAt)}
            </p>
            <Link
              href={`/account/reports/${report.id}`}
              className="mt-5 inline-flex min-h-[44px] items-center justify-center rounded-lg border border-slate/20 px-4 text-sm font-semibold text-deep-navy transition-colors hover:border-professional-blue hover:text-professional-blue"
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
  const loginHref = `/login?next=${encodeURIComponent(nextPath)}`;

  return (
    <aside className="mx-auto max-w-2xl rounded-2xl border border-slate/15 bg-white p-6 shadow-card sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-wider text-professional-blue">
        Sign in required
      </p>
      <h2 className="mt-3 text-xl font-bold text-deep-navy sm:text-2xl">
        Sign in to view saved reports
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-slate">
        Saved verdict reports are linked to your SectorCalc account.
      </p>
      <Link
        href={loginHref}
        className="mt-6 inline-flex min-h-[48px] w-full items-center justify-center rounded-lg bg-professional-blue px-5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 sm:w-auto"
      >
        Sign in
      </Link>
    </aside>
  );
}
