"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { formatVerdictReportDate } from "@/lib/reports/verdict-report";
import type { SavedVerdictReport } from "@/lib/reports/report-storage";
import { EmptyReports } from "@/components/empty-states/EmptyReports";
import { getLoginHref } from "@/lib/tools/tool-links";

interface ReportsHistoryListProps {
  reports: SavedVerdictReport[];
  hasPurchaseCredits?: boolean;
}

export function ReportsHistoryList({ reports, hasPurchaseCredits = false }: ReportsHistoryListProps) {
  const t = useTranslations("emptyStates.reports");

  if (reports.length === 0) {
    return <EmptyReports hasPurchaseCredits={hasPurchaseCredits} />;
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
            <p className="mt-2 text-sm text-slate dark:text-slate-300">
              {report.result.primaryMetricValue}
            </p>
            <p className="mt-3 text-xs text-slate dark:text-slate-400">
              {formatVerdictReportDate(report.createdAt)}
            </p>
            <Link
              href={`/account/reports/${report.id}`}
              className="sc-btn-secondary mt-5 inline-flex min-h-[44px]"
            >
              {t("viewReport")}
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
  const t = useTranslations("emptyStates.login");
  const loginHref = getLoginHref(nextPath);

  return (
    <aside className="sc-card mx-auto max-w-2xl">
      <p className="text-xs font-semibold uppercase tracking-wider text-professional-blue">
        {t("eyebrow")}
      </p>
      <h2 className="mt-3 text-xl font-bold text-deep-navy dark:text-off-white sm:text-2xl">
        {t("title")}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-slate dark:text-slate-300">
        {t("body")}
      </p>
      <Link
        href={loginHref}
        className="sc-btn-primary mt-6 inline-flex min-h-[44px] w-full sm:w-auto"
      >
        {t("cta")}
      </Link>
    </aside>
  );
}
