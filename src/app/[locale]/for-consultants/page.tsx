import type { Metadata } from "next";
import Link from "@/lib/navigation/next-link";
import { PageLayout } from "@/components/layout/PageLayout";
import PageHero from "@/components/shared/PageHero";
import { Container } from "@/components/ui/Container";
import { CTASection } from "@/components/sections/CTASection";
import { ConsultantAccessCta } from "@/components/leads/ConsultantAccessCta";
import { ToolsTileGrid } from "@/components/tools/ToolsTileGrid";
import { ALL_TOOLS } from "@/data/tools";
import { createPageMetadata } from "@/lib/metadata";

const benefits = [
 {
 title: "Client-facing calculations",
 description:
 "Run sector-specific free estimates and premium analyzers to support preliminary assessments, workshops and advisory engagements.",
 },
 {
 title: "Structured report requests",
 description:
 "Request premium decision report flows with executive summary, scenarios, risk level and recommendations — export packaging is preview-only in the MVP.",
 },
 {
 title: "Repeatable sector workflows",
 description:
 "Use the same tool engine across Construction, Cleaning, Restaurant, E-commerce and CNC & Manufacturing clients without rebuilding spreadsheets each time.",
 },
] as const;

const AUDIENCE = [
 "Business consultants",
 "Financial advisors",
 "Operations consultants",
 "Agencies",
 "Fractional CFOs",
 "Industry specialists",
] as const;

export const metadata: Metadata = createPageMetadata({
 title: "For Consultants",
 description:
 "SectorCalc for consultants and advisors — client-facing sector calculations, structured report requests and repeatable workflows. White-label not live yet.",
 path: "/for-consultants",
});

export default function ForConsultantsPage() {
 return (
 <PageLayout>
 <PageHero
 eyebrow="For Consultants"
 title="Sector calculations for advisory practices"
 description="Support client engagements with sector-specific estimates, preliminary assessments and structured premium report requests — across every industry your clients operate in."
 />
 <section className="py-12 md:py-16">
 <Container>
 <p className="text-sm font-semibold uppercase tracking-wider text-text-secondary">
 Built for
 </p>
 <ul className="mt-4 flex flex-wrap gap-2">
 {AUDIENCE.map((role) => (
 <li
 key={role}
 className="rounded-full border border-border-subtle bg-bg-subtle px-3 py-1.5 text-sm text-text-primary"
 >
 {role}
 </li>
 ))}
 </ul>
 <div className="mt-12 grid gap-8 md:grid-cols-3">
 {benefits.map((benefit) => (
 <article
 key={benefit.title}
 className="rounded-sm border border-border-subtle bg-white p-6 shadow-card"
 >
 <h2 className="text-lg font-bold text-text-primary">{benefit.title}</h2>
 <p className="mt-3 text-sm leading-relaxed text-text-secondary">{benefit.description}</p>
 </article>
 ))}
 </div>
 <div className="mt-12">
 <h2 className="text-xl font-bold text-text-primary">All sector calculators</h2>
 <p className="mt-2 max-w-2xl text-sm text-text-secondary">
 Free quick estimates and premium decision analyzers — same compact catalog used across
 the platform.
 </p>
 <div className="mt-6">
 <ToolsTileGrid tools={ALL_TOOLS} />
 </div>
 <p className="mt-4 text-sm text-text-secondary">
 <Link href="/pricing" className="font-semibold text-deep-navy hover:underline">
 View pricing and plans →
 </Link>
 </p>
 </div>
 <div className="mt-12 rounded-sm border border-professional-blue/30 bg-bg-primary p-8 text-center md:p-12">
 <h2 className="text-2xl font-bold text-premium-velvet">Consultant program — coming soon</h2>
 <p className="mx-auto mt-4 max-w-xl text-body-charcoal">
 White-label branding, client workspaces and embed flows are not live yet. We are
 collecting consultant interest to shape Pro access, report packaging and team
 features.
 </p>
 <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
 <ConsultantAccessCta />
 <Link
 href="/reports/sample-decision-report"
 className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-technical-gray px-6 py-2.5 text-base font-semibold text-premium-velvet hover:bg-industrial-matte"
 >
 See sample report
 </Link>
 </div>
 </div>
 </Container>
 </section>
 <CTASection
 title="Bring sector-specific decisions to client engagements"
 subtitle="Explore industry packs, run free estimates, and request premium report access when decisions affect client margin or risk."
 primaryLabel="Explore industries"
 primaryHref="/industries"
 secondaryLabel="View pricing"
 secondaryHref="/pricing"
 />
 </PageLayout>
 );
}
