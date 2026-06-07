"use client";

import Link from "next/link";
import { formatVerdictReportDate } from "@/lib/reports/verdict-report";
import type { SavedVerdictReport } from "@/lib/reports/report-storage";
import { getPremiumToolHref, getPremiumToolsHref, getReportsHref } from "@/lib/tools/tool-links";
import { revenueTools } from "@/lib/tools/revenue-tools";

const defaultPremiumHref = revenueTools[0]
 ? getPremiumToolHref(revenueTools[0])
 : getPremiumToolsHref();

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
 <section className="min-w-0 rounded-sm border border-border-subtle bg-white p-6 shadow-card">
 <div className="flex flex-wrap items-start justify-between gap-3">
 <div>
 <h2 className="text-lg font-bold text-text-primary">Recent verdict reports</h2>
 <p className="mt-1 text-sm text-text-secondary">Your latest saved decision outputs.</p>
 </div>
 {reports.length > 0 ? (
 <Link
 href={getReportsHref()}
 className="inline-flex min-h-[44px] items-center text-sm font-semibold text-deep-navy hover:underline"
 >
 View all
 </Link>
 ) : null}
 </div>

 {loading ? (
 <p className="mt-5 text-sm text-text-secondary">Loading saved reports…</p>
 ) : error ? (
 <p className="mt-5 text-sm text-amber" role="alert">
 {error}
 </p>
 ) : reports.length === 0 ? (
 <div className="mt-5 rounded-sm border border-dashed border-border-subtle bg-bg-subtle p-5">
 <p className="text-sm font-medium text-text-primary">No saved verdict reports yet.</p>
 <Link
 href={defaultPremiumHref}
 className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-lg bg-deep-navy px-5 text-sm font-semibold text-white transition-colors hover:bg-black"
 >
 Run a premium analyzer
 </Link>
 </div>
 ) : (
 <ul className="mt-5 divide-y divide-slate/10">
 {reports.map((report) => (
 <li key={report.id} className="py-4 first:pt-0 last:pb-0">
 <article>
 <p className="text-sm font-semibold text-text-primary">{report.toolTitle}</p>
 <p className="mt-1 text-sm text-text-primary">{report.result.verdict}</p>
 <p className="mt-1 text-sm text-text-secondary">{report.result.primaryMetricValue}</p>
 <p className="mt-2 text-xs text-text-secondary">
 {formatVerdictReportDate(report.createdAt)}
 </p>
 <Link
 href={`/account/reports/${report.id}`}
 className="mt-3 inline-flex min-h-[44px] items-center text-sm font-semibold text-deep-navy hover:underline"
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
