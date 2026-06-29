/* eslint-disable */
// @ts-nocheck

export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import Link from "@/lib/navigation/next-link";
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/ui/Container";
import { DecisionToolLegalDisclaimer } from "@/components/tools/DecisionToolLegalDisclaimer";
import { FreeToolPrivacyNote } from "@/components/tools/FreeToolPrivacyNote";
import { createPageMetadata } from "@/lib/metadata";
import {
 getFreeToolsHref,
 getPremiumToolsHref,
 getPricingHref,
 getSampleReportHref,
} from "@/lib/tools/tool-links";
import { revenueLegalDisclaimer } from "@/lib/tools/revenue-tools";
import { PRICING_REFUND_POLICY } from "@/lib/pricing/plan-catalog";

export const metadata: Metadata = createPageMetadata({
 title: "How It Works — Methodology & Limitations",
 description:
 "How SectorCalc free margin checks and premium verdict reports work: inputs, risk signals, safe price logic, limitations, privacy and disclaimers.",
 path: "/how-it-works",
});

const METHODOLOGY_SECTIONS = [
 {
 id: "free-check",
 title: "What the free check shows",
 body: "Free sector checks use 3–5 structured inputs per industry. Outputs include a visible risk level (LOW / MEDIUM / HIGH), a plain-language headline and summary of cost exposure. Free checks run in your browser without an account. They do not show minimum safe price, accept/reject verdict strings or PDF export.",
 bullets: [
 "Visible risk signal only",
 "Directional cost exposure summary",
 "No minimum safe price floor",
 "No final verdict or saved report",
 ],
 },
 {
 id: "premium-verdict",
 title: "What the premium verdict adds",
 body: "Premium analyzers use expanded input sets (typically 5–9 fields) to produce a decision verdict: minimum safe price where applicable, margin leak drivers, scenario comparison and a suggested action (accept, reprice, renegotiate or do not accept). Subscribers can save reports and export PDF copies.",
 bullets: [
 "Minimum safe price or bid floor",
 "Margin leak breakdown",
 "Accept / reprice / reject verdict",
 "PDF-ready report and saved history (Pro)",
 ],
 },
 {
 id: "inputs",
 title: "Inputs used",
 body: "Each sector pack defines validated input fields — machine time, labor, material, margin targets, delay days and similar operating variables. Labels and helper text explain what belongs in each field. Premium analyzers may require additional fields not shown on the free tier.",
 bullets: [
 "Sector-specific field sets per tool",
 "Visible labels and helper text",
 "No raw formula sheets exposed to users",
 "Inputs are illustrative simulations — verify before quoting",
 ],
 },
 {
 id: "risk-signals",
 title: "Risk signals",
 body: "Risk levels combine input ratios, sector thresholds and margin targets configured per industry pack. HIGH risk means the quote or change may erode margin under stated assumptions — not a guarantee of loss, but a signal to reprice or reduce scope before committing.",
 bullets: [
 "LOW / MEDIUM / HIGH visible on free tier",
 "Premium adds verdict labels and leak drivers",
 "Risk is text + level — not color alone",
 "Signals are decision-support, not certified audit",
 ],
 },
 {
 id: "safe-price",
 title: "Safe price logic",
 body: "Where applicable, premium calculators compute a minimum safe price or bid floor from direct cost, target margin and sector-specific buffers (setup, scrap, tooling, delay). The exact model varies by sector — CNC machine shops, construction change orders and cleaning contracts use different drivers.",
 bullets: [
 "Target margin applied to loaded direct cost",
 "Sector buffers for setup, scrap or delay",
 "Scenario rows at multiple margin targets",
 "Safe price withheld on free tier intentionally",
 ],
 },
 {
 id: "limitations",
 title: "Report limitations",
 body: "All outputs are technical simulations and decision-support estimates. They are not financial, legal, engineering or tax advice. SectorCalc does not replace professional estimating, cost accounting or contractual review.",
 bullets: [
 "Not certified financial or engineering advice",
 "Verify all numbers before commercial commitments",
 "Models simplify real-world variability",
 "Subscription does not guarantee business outcomes",
 ],
 },
 {
 id: "privacy",
 title: "Data privacy",
 body: "Free checks run without ERP setup and without requiring an enterprise rollout. Business data is not sold. Saved reports and account data are linked to your SectorCalc login when you choose to save or subscribe.",
 bullets: [
 "Free checks run without ERP setup",
 "Business data is not sold",
 "Stripe handles subscription billing securely",
 "See Privacy Policy for retention details",
 ],
 },
 {
 id: "disclaimer",
 title: "Disclaimer",
 body: revenueLegalDisclaimer,
 bullets: [] as string[],
 },
] as const;

export default function HowItWorksPage() {
 return (
 <PageLayout>
 <section className="border-b border-border-subtle bg-bg-subtle py-10 sm:py-12">
 <Container>
 <p className="sc-eyebrow">How it works</p>
 <h1 className="mt-3 sc-h2">Methodology, outputs and limitations</h1>
 <p className="mt-4 max-w-2xl sc-body-muted">
 SectorCalc is a sector-specific measurement and decision platform. Free checks build trust;
 premium verdicts deliver the decision layer operators need before quoting.
 </p>
 <p className="mt-4 max-w-2xl text-sm font-medium text-text-primary">
 Free checks run without ERP setup. Business data is not sold.
 </p>
 </Container>
 </section>

 <section className="border-b border-border-subtle bg-white py-10 sm:py-14">
 <Container size="narrow">
 <div className="space-y-12">
 {METHODOLOGY_SECTIONS.map((section) => (
 <article key={section.id} id={section.id} className="scroll-mt-24">
 <h2 className="text-xl font-bold text-text-primary">{section.title}</h2>
 <p className="mt-3 text-sm leading-relaxed text-text-secondary sm:text-base">
 {section.body}
 </p>
 {section.bullets.length > 0 ? (
 <ul className="mt-4 space-y-2">
 {section.bullets.map((item) => (
 <li key={item} className="flex gap-2 text-sm text-text-secondary">
 <span className="text-deep-navy" aria-hidden>
 —
 </span>
 {item}
 </li>
 ))}
 </ul>
 ) : null}
 </article>
 ))}
 </div>
 </Container>
 </section>

 <section className="border-b border-border-subtle bg-bg-subtle py-10 sm:py-12">
 <Container>
 <h2 className="text-xl font-bold text-text-primary">Free vs premium at a glance</h2>
 <div className="mt-6 grid gap-6 md:grid-cols-2">
 <article className="sc-card">
 <p className="sc-eyebrow text-deep-navy">Free check</p>
 <ul className="mt-4 space-y-2 text-sm text-text-secondary">
 <li>Visible risk level and summary</li>
 <li>Browser-side processing</li>
 <li>No PDF export</li>
 <li>No minimum safe price</li>
 </ul>
 </article>
 <article className="sc-card border-amber/30">
 <p className="sc-eyebrow text-amber">Premium verdict</p>
 <ul className="mt-4 space-y-2 text-sm text-text-secondary">
 <li>Full calculator inputs</li>
 <li>Verdict label and suggested action</li>
 <li>PDF export for saved reports</li>
 <li>Single Verdict ($9) or Pro ($19/month)</li>
 </ul>
 </article>
 </div>
 <div className="mt-8 space-y-4">
 <FreeToolPrivacyNote />
 <DecisionToolLegalDisclaimer variant="paid" />
 </div>
 </Container>
 </section>

 <section className="bg-white py-10 sm:py-12">
 <Container>
 <p className="text-xs leading-relaxed text-text-secondary">{PRICING_REFUND_POLICY}</p>
 <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
 <Link
 href={getFreeToolsHref()}
 className="inline-flex min-h-[44px] items-center text-sm font-semibold text-deep-navy hover:underline"
 >
 Run a free check →
 </Link>
 <Link
 href={getSampleReportHref()}
 className="inline-flex min-h-[44px] items-center text-sm font-semibold text-text-secondary hover:text-deep-navy"
 >
 View sample verdict report →
 </Link>
 <Link
 href={getPremiumToolsHref()}
 className="inline-flex min-h-[44px] items-center text-sm font-semibold text-text-secondary hover:text-deep-navy"
 >
 Browse premium calculators →
 </Link>
 <Link
 href={getPricingHref()}
 className="inline-flex min-h-[44px] items-center text-sm font-semibold text-text-secondary hover:text-deep-navy"
 >
 View pricing →
 </Link>
 </div>
 </Container>
 </section>
 </PageLayout>
 );
}
