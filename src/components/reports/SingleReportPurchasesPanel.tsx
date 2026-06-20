"use client";

import Link from "@/lib/navigation/next-link";
import { getRevenueToolByPaidSlug } from "@/lib/tools/revenue-tools";
import type { SingleReportPurchase } from "@/lib/billing/purchase-types";
import { EmptyPurchases } from "@/components/empty-states/EmptyPurchases";
import { formatVerdictReportDate } from "@/lib/reports/verdict-report";
import { SINGLE_VERDICT_PRICE } from "@/lib/pricing/plan-catalog";

interface SingleReportPurchasesPanelProps {
 purchases: SingleReportPurchase[];
}

export function SingleReportPurchasesPanel({
 purchases,
}: SingleReportPurchasesPanelProps) {
 if (purchases.length === 0) {
 return <EmptyPurchases />;
 }

 return (
 <section className="mb-8">
 <h2 className="text-lg font-bold text-text-primary">
 Single verdict credits
 </h2>
 <p className="mt-2 text-sm text-text-secondary">
 One-time purchases unlock the premium calculator for that sector tool.
 </p>
 <ul className="mt-5 grid min-w-0 gap-4 sm:grid-cols-2">
 {purchases.map((purchase) => {
 const tool = getRevenueToolByPaidSlug(purchase.toolSlug);
 const title = tool?.paidTitle ?? purchase.toolSlug;
 const analyzerHref = `/tools/premium/${purchase.toolSlug}`;

 return (
 <li key={purchase.sessionId}>
 <article className="sc-card flex h-full flex-col border-amber/20">
 <p className="text-xs font-semibold uppercase tracking-wider text-amber">
 {`Single Verdict — $${SINGLE_VERDICT_PRICE}`}
 </p>
 <h3 className="mt-2 text-base font-bold text-text-primary">
 {title}
 </h3>
 <p className="mt-2 text-sm text-text-secondary">
 Purchased {formatVerdictReportDate(purchase.createdAt)}
 </p>
 <Link href={analyzerHref} className="sc-btn-primary mt-5 inline-flex">
 Run premium calculator
 </Link>
 </article>
 </li>
 );
 })}
 </ul>
 </section>
 );
}

interface SingleReportPurchaseSuccessBannerProps {
 toolSlug?: string;
}

export function SingleReportPurchaseSuccessBanner({
 toolSlug,
}: SingleReportPurchaseSuccessBannerProps) {
 const tool = toolSlug ? getRevenueToolByPaidSlug(toolSlug) : null;
 const analyzerHref = tool ? `/tools/premium/${tool.paidSlug}` : "/pro-tools";

 return (
 <aside className="mb-8 rounded-sm border border-emerald/30 bg-bg-subtle p-5 sm:p-6">
 <p className="text-xs font-semibold uppercase tracking-wider text-deep-navy">
 Payment received
 </p>
 <h2 className="mt-2 text-lg font-bold text-text-primary">
 Your Single Verdict credit is active
 </h2>
 <p className="mt-2 text-sm leading-relaxed text-text-secondary">
 {tool
 ? `Open ${tool.paidTitle}, run the calculator and save or export your verdict report.`
 : "Open your premium calculator, run the tool and save or export your verdict report."}
 </p>
 <Link href={analyzerHref} className="sc-btn-primary mt-4 inline-flex">
 {tool ? `Open ${tool.paidTitle}` : "Browse premium calculators"}
 </Link>
 </aside>
 );
}
