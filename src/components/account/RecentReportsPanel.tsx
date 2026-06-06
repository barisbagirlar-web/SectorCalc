"use client";

import Link from "next/link";
import { formatVerdictReportDate } from "@/lib/reports/verdict-report";
import type { SavedVerdictReport } from "@/lib/reports/report-storage";

const PREMIUM_TOOLS_HREF = "/tools/premium/cnc-quote-risk-analyzer";

interface RecentReportsPanelProps {
  reports: SavedVerdictReport[];
  loading: boolean;
  error: string | null;
}

export function RecentReportsPanel({
  reports,
  loading,
  error,
}: RecentReportsPanelProps) {
  return (
    <section className="min-w-0 rounded-xl border border-slate/15 bg-white p-6 shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-deep-navy">Recent verdict reports</h2>
          <p className="mt-1 text-sm text-slate">Your latest saved decision outputs.</p>
        </div>
        {reports.length > 0 ? (
          <Link
            href="/account/reports"
            className="inline-flex min-h-[44px] items-center text-sm font-semibold text-professional-blue hover:underline"
          >
            View all
          </Link>
        ) : null}
      </div>

      {loading ? (
        <p className="mt-5 text-sm text-slate">Loading saved reports…</p>
      ) : error ? (
        <p className="mt-5 text-sm text-soft-red" role="alert">
          {error}
        </p>
      ) : reports.length === 0 ? (
        <div className="mt-5 rounded-xl border border-dashed border-slate/20 bg-off-white p-5">
          <p className="text-sm font-medium text-deep-navy">No saved verdict reports yet.</p>
          <Link
            href={PREMIUM_TOOLS_HREF}
            className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-lg bg-professional-blue px-5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Run a premium analyzer
          </Link>
        </div>
      ) : (
        <ul className="mt-5 divide-y divide-slate/10">
          {reports.map((report) => (
            <li key={report.id} className="py-4 first:pt-0 last:pb-0">
              <article>
                <p className="text-sm font-semibold text-deep-navy">{report.toolTitle}</p>
                <p className="mt-1 text-sm text-deep-navy">{report.result.verdict}</p>
                <p className="mt-1 text-sm text-slate">{report.result.primaryMetricValue}</p>
                <p className="mt-2 text-xs text-slate">
                  {formatVerdictReportDate(report.createdAt)}
                </p>
                <Link
                  href={`/account/reports/${report.id}`}
                  className="mt-3 inline-flex min-h-[44px] items-center text-sm font-semibold text-professional-blue hover:underline"
                >
                  View report
                </Link>
              </article>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
