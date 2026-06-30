"use client";

import dynamic from "next/dynamic";
import Link from "@/lib/ui-shared/navigation/next-link";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { AccountLoginPrompt } from "@/components/reports/ReportsHistoryList";
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/ui/Container";
import { useUserSubscription } from "@/lib/features/billing/use-user-subscription";
import { formatVerdictReportDate } from "@/lib/features/reports/verdict-report";
import {
 getUserVerdictReport,
 savedReportToVerdictReportData,
 type SavedVerdictReport,
} from "@/lib/features/reports/report-storage";
import type { PremiumSeverity } from "@/lib/features/tools/premium-tool-results";

const DownloadVerdictPdfButton = dynamic(
 () =>
 import("@/components/reports/DownloadVerdictPdfButton").then(
 (mod) => mod.DownloadVerdictPdfButton
 ),
 {
 ssr: false,
 loading: () => (
 <span className="inline-flex min-h-[44px] items-center text-sm text-text-secondary">
 Preparing PDF…
 </span>
 ),
 }
);

const severityStyles: Record<
 PremiumSeverity,
 { border: string; bg: string; verdict: string }
> = {
 safe: {
 border: "border-deep-navy/25",
 bg: "bg-bg-subtle",
 verdict: "text-deep-navy",
 },
 watch: {
 border: "border-amber/35",
 bg: "bg-amber/[0.06]",
 verdict: "text-amber",
 },
 danger: {
 border: "border-amber/35",
 bg: "bg-amber/[0.06]",
 verdict: "text-amber",
 },
};

interface SavedReportDetailContentProps {
 reportId: string;
}

export function SavedReportDetailContent({ reportId }: SavedReportDetailContentProps) {
 const { user, loading: authLoading } = useUserSubscription();
 const [report, setReport] = useState<SavedVerdictReport | null>(null);
 const [loadingReport, setLoadingReport] = useState(false);
 const [accessDenied, setAccessDenied] = useState(false);

 useEffect(() => {
 if (!user) {
 setReport(null);
 setAccessDenied(false);
 setLoadingReport(false);
 return;
 }

 let cancelled = false;
 setLoadingReport(true);
 setAccessDenied(false);

 void getUserVerdictReport({ uid: user.uid, reportId }).then((item) => {
 if (cancelled) {
 return;
 }
 if (!item) {
 setReport(null);
 setAccessDenied(true);
 } else {
 setReport(item);
 setAccessDenied(false);
 }
 setLoadingReport(false);
 });

 return () => {
 cancelled = true;
 };
 }, [user, reportId]);

 if (authLoading || loadingReport) {
 return (
 <PageLayout>
 <Container size="wide" className="py-12">
 <div className="rounded-sm border border-border-subtle bg-white p-6 text-sm text-text-secondary">
 Loading report…
 </div>
 </Container>
 </PageLayout>
 );
 }

 if (!user) {
 return (
 <PageLayout>
 <Container size="wide" className="py-12">
 <AccountLoginPrompt nextPath={`/account/reports/${reportId}`} />
 </Container>
 </PageLayout>
 );
 }

 if (accessDenied || !report) {
 notFound();
 }

 const styles = severityStyles[report.result.severity];
 const pdfData = savedReportToVerdictReportData(report);

 return (
 <PageLayout>
 <section className="border-b border-border-subtle bg-white py-10 sm:py-12">
 <Container size="wide" className="min-w-0">
 <Link
 href="/account/reports"
 className="text-sm font-medium text-deep-navy hover:underline"
 >
 Back to saved reports
 </Link>
 <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-deep-navy">
 {report.sector}
 </p>
 <h1 className="mt-2 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
 {report.toolTitle}
 </h1>
 <p className="mt-3 text-sm text-text-secondary">
 Saved {formatVerdictReportDate(report.createdAt)}
 </p>
 </Container>
 </section>

 <section className="bg-bg-subtle py-10 sm:py-12">
 <Container size="wide" className="min-w-0">
 <div className="mx-auto max-w-3xl">
 <article
 className={`rounded-sm border p-6 sm:p-8 ${styles.border} ${styles.bg}`}
 >
 <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
 Decision verdict
 </p>
 <p className={`mt-3 text-xl font-bold leading-snug sm:text-2xl ${styles.verdict}`}>
 {report.result.verdict}
 </p>
 <h2 className="mt-5 text-lg font-semibold text-text-primary">
 {report.result.headline}
 </h2>
 <div className="mt-4 rounded-sm border border-border-subtle bg-white p-5">
 <p className="text-sm font-medium text-text-secondary">
 {report.result.primaryMetricLabel}
 </p>
 <p className="mt-1 text-3xl font-bold tracking-tight text-text-primary">
 {report.result.primaryMetricValue}
 </p>
 </div>
 <div className="mt-6">
 <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
 Key risk drivers
 </p>
 <ul className="mt-3 space-y-2">
 {report.result.riskDrivers.map((driver) => (
 <li key={driver} className="text-sm text-text-primary">
 {driver}
 </li>
 ))}
 </ul>
 </div>
 <div className="mt-6 rounded-sm border border-border-subtle bg-white/80 p-4">
 <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
 Suggested action
 </p>
 <p className="mt-2 text-sm leading-relaxed text-text-primary">
 {report.result.suggestedAction}
 </p>
 </div>
 </article>

 <div className="mt-8 rounded-sm border border-border-subtle bg-white p-6">
 <h2 className="text-lg font-bold text-text-primary">Input summary</h2>
 <dl className="mt-4 divide-y divide-slate/10">
 {report.inputs.map((input) => (
 <div key={input.label} className="py-3">
 <dt className="text-xs font-medium uppercase tracking-wide text-text-secondary">
 {input.label}
 </dt>
 <dd className="mt-1 text-sm text-text-primary">{input.value}</dd>
 </div>
 ))}
 </dl>
 </div>

 <p className="mt-6 text-xs leading-relaxed text-text-secondary">{report.legalDisclaimer}</p>

 <div className="mt-6">
 <DownloadVerdictPdfButton
 data={pdfData}
 slug={report.toolSlug}
 severity={report.result.severity}
 />
 </div>
 </div>
 </Container>
 </section>
 </PageLayout>
 );
}
