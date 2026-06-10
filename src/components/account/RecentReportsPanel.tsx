"use client";

import Link from "@/lib/navigation/next-link";
import { ScIcon } from "@/components/icons/ScIcon";
import { UI_ICON } from "@/lib/icons/icon-registry";
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
    <section className="sc-account-hub__panel sc-account-hub__panel--reports min-w-0">
      <div className="sc-account-hub__panel-head">
        <div>
          <h2 className="sc-account-hub__panel-title">Recent verdict reports</h2>
          <p className="sc-account-hub__panel-lead">Your latest saved decision outputs.</p>
        </div>
        {reports.length > 0 ? (
          <Link href={getReportsHref()} className="sc-account-hub__panel-link">
            View all
          </Link>
        ) : null}
      </div>

      {loading ? (
        <p className="sc-account-hub__empty-text">Loading saved reports…</p>
      ) : error ? (
        <p className="sc-account-hub__empty-text sc-account-hub__empty-text--warn" role="alert">
          {error}
        </p>
      ) : reports.length === 0 ? (
        <div className="sc-account-hub__empty">
          <p className="sc-account-hub__empty-title">No saved reports yet</p>
          <p className="sc-account-hub__empty-text">
            Run a premium analyzer and save the verdict to build your decision history here.
          </p>
          <Link href={defaultPremiumHref} className="sc-cta-primary mt-4 inline-flex">
            Run premium analyzer
          </Link>
        </div>
      ) : (
        <ul className="sc-account-hub__report-list">
          {reports.map((report) => (
            <li key={report.id}>
              <Link href={`/account/reports/${report.id}`} className="sc-account-hub__report-row group">
                <span className="min-w-0 flex-1">
                  <span className="sc-account-hub__link-eyebrow">{report.toolTitle}</span>
                  <span className="sc-account-hub__report-verdict">{report.result.verdict}</span>
                  <span className="sc-account-hub__report-meta">
                    {report.result.primaryMetricValue} · {formatVerdictReportDate(report.createdAt)}
                  </span>
                </span>
                <ScIcon
                  icon={UI_ICON.chevronRight}
                  size="compact"
                  className="shrink-0 text-body-charcoal transition group-hover:translate-x-0.5 group-hover:text-sc-copper"
                />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
