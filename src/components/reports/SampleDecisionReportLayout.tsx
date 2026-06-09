import Link from "next/link";
import { ScIcon } from "@/components/icons/ScIcon";
import {
 STATUS_ICON,
 TOOL_CATEGORY_ICON,
} from "@/lib/icons/icon-registry";
import { SingleVerdictUpsellButton } from "@/components/pricing/PlanCheckoutAction";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import {
 SAMPLE_REPORT_DISCLAIMER,
 SAMPLE_REPORT_EXECUTIVE_VERDICT,
 SAMPLE_REPORT_INPUT_SUMMARY,
 SAMPLE_REPORT_MARGIN_LEAKS,
 SAMPLE_REPORT_MARGIN_RISK,
 SAMPLE_REPORT_MINIMUM_SAFE_PRICE,
 SAMPLE_REPORT_SCENARIOS,
 SAMPLE_REPORT_SUGGESTED_ACTION,
 SAMPLE_REPORT_TITLE,
 SAMPLE_REPORT_VERDICT,
 SAMPLE_REPORT_MAIN_LEAK,
} from "@/data/sample-report-content";
import { getFreeToolsHref, getPremiumToolsHref, getPricingHref } from "@/lib/tools/tool-links";
import { revenueLegalDisclaimer } from "@/lib/tools/revenue-tools";

const toneClasses = {
 danger: "border-amber/30 bg-amber/[0.06] text-amber",
 warning: "border-amber/30 bg-amber/5 text-amber",
 success: "border-ink-black/20 bg-bg-subtle text-ink-black",
};

export function SampleDecisionReportLayout() {
 return (
 <section className="bg-bg-subtle py-12 md:py-16 sc-section">
 <Container>
 <div className="overflow-hidden rounded-sm border border-border-subtle bg-white shadow-card">
 <header className="border-b border-border-subtle bg-bg-primary px-6 py-8 sm:px-10">
 <p className="text-xs font-semibold uppercase tracking-wider text-ink-black">
 Premium verdict report · Illustrative sample
 </p>
 <h2 className="mt-2 text-2xl font-bold text-premium-velvet sm:text-3xl">
 {SAMPLE_REPORT_TITLE}
 </h2>
 <p className="mt-3 text-sm text-text-secondary">
 Decision-ready output — not a calculator dump.
 </p>
 </header>

 <div className="space-y-10 p-6 sm:p-10">
 <article className="sc-card border-amber/30 bg-amber/[0.06]">
 <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-amber">
 <ScIcon icon={STATUS_ICON.doNotAccept} size="compact" className="text-amber" />
 Executive verdict
 </h3>
 <p className="mt-4 text-2xl font-bold text-amber sm:text-3xl">
 {SAMPLE_REPORT_VERDICT}
 </p>
 <p className="mt-4 text-sm leading-relaxed text-text-primary sm:text-base">
 {SAMPLE_REPORT_EXECUTIVE_VERDICT}
 </p>
 <dl className="mt-6 grid gap-4 sm:grid-cols-3">
 <div>
 <dt className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
 Margin risk
 </dt>
 <dd className="mt-1 text-lg font-bold text-amber">
 {SAMPLE_REPORT_MARGIN_RISK} RISK
 </dd>
 </div>
 <div>
 <dt className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
 Main leak
 </dt>
 <dd className="mt-1 text-sm font-semibold text-text-primary">
 {SAMPLE_REPORT_MAIN_LEAK}
 </dd>
 </div>
 <div>
 <dt className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
 Suggested action
 </dt>
 <dd className="mt-1 text-sm font-semibold text-text-primary">
 {SAMPLE_REPORT_SUGGESTED_ACTION}
 </dd>
 </div>
 </dl>
 </article>

 <article>
 <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-ink-black">
 <ScIcon icon={TOOL_CATEGORY_ICON.cost} size="compact" />
 Input summary
 </h3>
 <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
 {SAMPLE_REPORT_INPUT_SUMMARY.map((row) => (
 <div
 key={row.label}
 className="rounded-sm border border-border-subtle bg-bg-subtle px-4 py-3"
 >
 <dt className="text-xs font-medium uppercase tracking-wide text-text-secondary">
 {row.label}
 </dt>
 <dd className="mt-1 text-sm font-semibold text-text-primary">{row.value}</dd>
 </div>
 ))}
 </dl>
 </article>

 <article className="sc-card border-emerald/30 bg-emerald/[0.04]">
 <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-ink-black">
 <ScIcon icon={TOOL_CATEGORY_ICON.safePrice} size="compact" className="text-ink-black" />
 Minimum safe price
 </h3>
 <p className="mt-3 text-3xl font-bold text-text-primary">
 {SAMPLE_REPORT_MINIMUM_SAFE_PRICE.amount}
 </p>
 <p className="mt-1 text-sm font-medium text-text-secondary">
 {SAMPLE_REPORT_MINIMUM_SAFE_PRICE.perUnit}
 </p>
 <p className="mt-3 text-sm leading-relaxed text-text-secondary">
 {SAMPLE_REPORT_MINIMUM_SAFE_PRICE.note}
 </p>
 </article>

 <article>
 <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-black">
 Margin leak diagnosis
 </h3>
 <ul className="mt-4 space-y-3">
 {SAMPLE_REPORT_MARGIN_LEAKS.map((leak) => (
 <li
 key={leak.driver}
 className="sc-card flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between"
 >
 <div>
 <p className="font-semibold text-text-primary">{leak.driver}</p>
 <p className="mt-1 text-sm text-text-secondary">{leak.impact}</p>
 </div>
 <span
 className={`shrink-0 text-xs font-bold uppercase tracking-wider ${
 leak.severity === "high" ? "text-amber" : "text-amber"
 }`}
 >
 {leak.severity} exposure
 </span>
 </li>
 ))}
 </ul>
 </article>

 <article>
 <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-black">
 Scenario comparison
 </h3>
 <div className="mt-4 overflow-x-auto">
 <table className="w-full min-w-[520px] text-left text-sm">
 <thead>
 <tr className="border-b border-border-subtle text-xs font-semibold uppercase tracking-wider text-text-secondary">
 <th className="pb-3 pr-4">Scenario</th>
 <th className="pb-3 pr-4">Quote</th>
 <th className="pb-3 pr-4">Margin</th>
 <th className="pb-3">Verdict</th>
 </tr>
 </thead>
 <tbody>
 {SAMPLE_REPORT_SCENARIOS.map((row) => (
 <tr key={row.label} className="border-b border-border-subtle last:border-0">
 <td className="py-3 pr-4 font-medium text-text-primary">{row.label}</td>
 <td className="py-3 pr-4 text-text-primary">{row.quote}</td>
 <td className="py-3 pr-4 text-text-secondary">{row.margin}</td>
 <td className="py-3">
 <span
 className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${toneClasses[row.tone]}`}
 >
 {row.verdict}
 </span>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </article>

 <article className="sc-card border-accent-teal/25 bg-accent-teal/[0.04]">
 <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-black">
 Suggested action
 </h3>
 <p className="mt-3 text-base font-semibold text-text-primary">
 {SAMPLE_REPORT_SUGGESTED_ACTION}
 </p>
 <p className="mt-3 text-sm leading-relaxed text-text-secondary">
 Confirm material price stability, tooling availability and first-piece approval
 time before sending a revised quote. If scope cannot be reduced, hold the line at
 the minimum safe price floor.
 </p>
 </article>

 <article className="rounded-sm border border-dashed border-slate/25 bg-bg-subtle p-5">
 <h3 className="text-sm font-semibold uppercase tracking-wider text-text-secondary">
 Disclaimer
 </h3>
 <p className="mt-3 text-sm leading-relaxed text-text-secondary">
 {SAMPLE_REPORT_DISCLAIMER}
 </p>
 <p className="mt-3 text-xs leading-relaxed text-text-secondary">{revenueLegalDisclaimer}</p>
 </article>
 </div>
 </div>

 <div className="mt-10 flex flex-col items-center gap-4 text-center">
 <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
 <SingleVerdictUpsellButton
 toolSlug="cnc-quote-risk-analyzer"
 toolTitle={SAMPLE_REPORT_TITLE}
 pagePath="/reports/sample-decision-report"
 className="sc-btn-primary inline-flex w-full justify-center sm:w-auto"
 />
 <Button href={getPricingHref()} variant="outline" size="cta">
 View all plans
 </Button>
 </div>
 <p className="text-sm text-text-secondary">
 <Link href={getFreeToolsHref()} className="font-semibold text-ink-black hover:underline">
 Run a free margin check
 </Link>
 {" · "}
 <Link href={getPremiumToolsHref()} className="font-semibold text-ink-black hover:underline">
 Browse premium analyzers
 </Link>
 </p>
 </div>
 </Container>
 </section>
 );
}
