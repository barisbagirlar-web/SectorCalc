"use client";

import Link from "@/lib/ui-shared/navigation/next-link";
import { useTranslations } from "@/lib/i18n-stub";
import { formatVerdictReportDate } from "@/lib/features/reports/verdict-report";
import type { SavedVerdictReport } from "@/lib/features/reports/report-storage";
import { EmptyReports } from "@/components/empty-states/EmptyReports";
import { getLoginHref } from "@/lib/features/tools/tool-links";

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
 <p className="text-xs font-semibold uppercase tracking-wider text-deep-navy">
 {report.sector}
 </p>
 <h2 className="mt-2 text-lg font-bold text-text-primary">
 {report.toolTitle}
 </h2>
 <p className="mt-3 text-sm font-semibold text-text-primary">
 {report.result.verdict}
 </p>
 <p className="mt-2 text-sm text-text-secondary">
 {report.result.primaryMetricValue}
 </p>
 <p className="mt-3 text-xs text-text-secondary">
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
 <p className="text-xs font-semibold uppercase tracking-wider text-deep-navy">
 {t("eyebrow")}
 </p>
 <h2 className="mt-3 text-xl font-bold text-text-primary sm:text-2xl">
 {t("title")}
 </h2>
 <p className="mt-3 text-sm leading-relaxed text-text-secondary">
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
