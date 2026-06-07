import type { Metadata } from "next";
import Link from "next/link";
import { PageLayout } from "@/components/layout/PageLayout";
import { ToolCatalogByCategory } from "@/components/tools/ToolCatalogByCategory";
import { DecisionToolLegalDisclaimer } from "@/components/tools/DecisionToolLegalDisclaimer";
import { Container } from "@/components/ui/Container";
import { IconListItem } from "@/components/icons/ScIcon";
import { STATUS_ICON } from "@/lib/icons/icon-registry";
import { Button } from "@/components/ui/Button";
import { PREMIUM_TOOLS } from "@/data/tools";
import { createPageMetadata } from "@/lib/metadata";
import { getFreeToolsHref, getPricingHref, getSampleReportHref } from "@/lib/tools/tool-links";
import { revenueTools, sectorCalcProPricing } from "@/lib/tools/revenue-tools";

export const metadata: Metadata = createPageMetadata({
 title: "Premium Decision Tools",
 description:
 "Explore SectorCalc Pro premium analyzers for safe price, bid risk and margin leak verdicts across sector-specific workflows.",
 path: "/premium-tools",
});

const FREE_VS_PREMIUM = {
 free: [
 "Quick visible risk checks",
 "3–5 structured inputs",
 "Browser-side processing",
 "Path to premium analyzer",
 ],
 premium: [
 "Full decision analyzer inputs",
 "Safe price and bid verdicts",
 "Suggested action output",
 "PDF export for saved reports",
 ],
} as const;

const VERDICT_EXAMPLES = [
 {
 verdict: "DO NOT ACCEPT UNDER",
 context: "Quote falls below minimum safe price floor.",
 },
 {
 verdict: "LEAKING PROFIT",
 context: "Hidden waste, labor or fees erode real margin.",
 },
 {
 verdict: "REPRICE REQUIRED",
 context: "Job is workable only after bid adjustment.",
 },
 {
 verdict: "SAFE TO QUOTE",
 context: "Margin and risk factors support accepting the work.",
 },
] as const;

export default function PremiumToolsPage() {
 const exampleVerdicts = revenueTools
 .flatMap((tool) => tool.verdictLabels.slice(0, 1))
 .slice(0, 6);

 return (
 <PageLayout>
 <section className="border-b border-border-subtle bg-bg-subtle py-10 sm:py-12">
 <Container>
 <p className="text-xs font-bold uppercase tracking-[0.2em] text-deep-navy">
 SectorCalc Pro
 </p>
 <h1 className="mt-3 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
 Premium decision analyzers
 </h1>
 <p className="mt-4 max-w-2xl text-base leading-relaxed text-text-secondary">
 Verdict engines for safe price, bid risk and margin leak decisions — built for real
 sector workflows, not generic calculators.
 </p>
 <p className="mt-4 text-sm">
 <Link href={getSampleReportHref()} className="font-semibold text-deep-navy hover:underline">
 View sample verdict report →
 </Link>
 </p>
 </Container>
 </section>

 <section className="border-b border-border-subtle bg-white py-10 sm:py-12">
 <Container>
 <h2 className="text-xl font-bold text-text-primary">Free vs Premium</h2>
 <div className="mt-6 grid gap-6 md:grid-cols-2">
 <article className="rounded-sm border border-border-subtle bg-bg-subtle/50 p-6">
 <span className="inline-flex rounded-full bg-emerald/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-deep-navy ring-1 ring-emerald/20">
 Free tools
 </span>
 <ul className="mt-4 space-y-2.5">
 {FREE_VS_PREMIUM.free.map((item) => (
 <IconListItem key={item} icon={STATUS_ICON.free} iconClassName="text-deep-navy">
 {item}
 </IconListItem>
 ))}
 </ul>
 <Link
 href={getFreeToolsHref()}
 className="mt-6 inline-flex min-h-[44px] items-center text-sm font-semibold text-deep-navy hover:underline"
 >
 Browse free tools →
 </Link>
 </article>
 <article className="rounded-sm border border-professional-blue/20 bg-white p-6 shadow-sm">
 <span className="inline-flex rounded-full bg-amber/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-amber ring-1 ring-amber/25">
 Premium analyzers
 </span>
 <ul className="mt-4 space-y-2.5">
 {FREE_VS_PREMIUM.premium.map((item) => (
 <IconListItem key={item} icon={STATUS_ICON.premium} iconClassName="text-amber">
 {item}
 </IconListItem>
 ))}
 </ul>
 <p className="mt-4 text-sm font-semibold text-text-primary">
 {sectorCalcProPricing.planName} — ${sectorCalcProPricing.priceMonthly}/month
 </p>
 </article>
 </div>
 </Container>
 </section>

 <section className="border-b border-border-subtle bg-bg-subtle py-10 sm:py-14">
 <Container size="wide">
 <h2 className="text-xl font-bold text-text-primary">Premium analyzer catalog</h2>
 <p className="mt-2 max-w-2xl text-sm text-text-secondary">
 Seventeen sector-specific analyzers included with SectorCalc Pro. Each pairs with a
 free quick check in the same industry.
 </p>
 <div className="mt-8">
 <ToolCatalogByCategory tools={PREMIUM_TOOLS} />
 </div>
 </Container>
 </section>

 <section className="border-b border-border-subtle bg-white py-10 sm:py-12">
 <Container>
 <h2 className="text-xl font-bold text-text-primary">Verdict examples</h2>
 <p className="mt-2 max-w-2xl text-sm text-text-secondary">
 Premium analyzers return clear decision outputs — not raw formulas or spreadsheet
 dumps.
 </p>
 <div className="mt-6 grid gap-4 sm:grid-cols-2">
 {VERDICT_EXAMPLES.map((item) => (
 <article
 key={item.verdict}
 className="rounded-sm border border-border-subtle bg-bg-subtle/50 p-5"
 >
 <p className="text-sm font-bold text-text-primary">{item.verdict}</p>
 <p className="mt-2 text-sm leading-relaxed text-text-secondary">{item.context}</p>
 </article>
 ))}
 </div>
 {exampleVerdicts.length > 0 ? (
 <p className="mt-6 text-xs text-text-secondary">
 Also includes sector-specific labels such as{" "}
 {exampleVerdicts.map((label, index) => (
 <span key={label}>
 {index > 0 ? (index === exampleVerdicts.length - 1 ? " and " : ", ") : ""}
 <strong className="font-semibold text-text-primary">{label}</strong>
 </span>
 ))}
 .
 </p>
 ) : null}
 </Container>
 </section>

 <section className="bg-bg-subtle py-10 sm:py-14">
 <Container>
 <div className="rounded-sm border border-border-subtle bg-white p-6 sm:p-8">
 <h2 className="text-xl font-bold text-text-primary">Unlock all premium analyzers</h2>
 <p className="mt-3 max-w-xl text-sm leading-relaxed text-text-secondary">
 {sectorCalcProPricing.description}
 </p>
 <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
 <Button href={getPricingHref()} variant="primary" size="lg">
 View pricing — ${sectorCalcProPricing.priceMonthly}/month
 </Button>
 <Link
 href={getSampleReportHref()}
 className="inline-flex min-h-[44px] items-center justify-center text-sm font-semibold text-deep-navy hover:underline"
 >
 Sample verdict report →
 </Link>
 <Link
 href="/industries"
 className="inline-flex min-h-[44px] items-center justify-center text-sm font-semibold text-text-secondary hover:text-deep-navy"
 >
 Browse by industry →
 </Link>
 </div>
 <div className="mt-6">
 <DecisionToolLegalDisclaimer variant="paid" />
 </div>
 </div>
 </Container>
 </section>
 </PageLayout>
 );
}
