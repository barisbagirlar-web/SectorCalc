import Link from "next/link";
import {
  INVESTOR_DEMO_FLOW_STEPS,
  INVESTOR_DUAL_CORE,
  INVESTOR_LIVE_PILOTS,
  INVESTOR_MOAT_BULLETS,
  INVESTOR_NINETY_DAY_PLAN,
  INVESTOR_PROBLEM_STATEMENT,
} from "@/data/investor-demo-content";
import type { InvestorPageMetrics } from "@/lib/commercial/investor-metrics-bridge";
import { PublicDemoCrossLinks } from "@/components/commercial/PublicDemoCrossLinks";
import { Container } from "@/components/ui/Container";
import { buildDebtRegister } from "@/lib/formula-governance/roadmap-debt-register/debt-register-builder";

type InvestorDemoPageContentProps = {
  readonly metrics: InvestorPageMetrics;
};

export function InvestorDemoPageContent({ metrics }: InvestorDemoPageContentProps) {
  const debtEntries = buildDebtRegister().slice(0, 6);

  return (
    <div className="sc-pro-page public-demo-page">
      <section className="bg-ink-black text-white">
        <Container className="sc-pro-container public-demo-hero">
          <p className="sc-pro-eyebrow text-white/70">Investor demo pack</p>
          <h1 className="mt-3 max-w-3xl text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl lg:text-[2.75rem] lg:leading-tight">
            SectorCalc — calculation operating system for sector margin decisions
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
            {INVESTOR_PROBLEM_STATEMENT.subhead}
          </p>
          <div className="public-demo-cta-row mt-8">
            <Link
              href="/operating-system"
              className="inline-flex min-h-[44px] items-center rounded-lg bg-white px-5 text-sm font-semibold text-ink-black"
            >
              View operating system
            </Link>
            <Link
              href="/pricing"
              className="inline-flex min-h-[44px] items-center rounded-lg border border-white/30 px-5 text-sm font-semibold text-white"
            >
              Commercial model
            </Link>
          </div>
        </Container>
      </section>

      <section className="sc-pro-section sc-pro-section--border">
        <Container className="sc-pro-container">
          <p className="sc-pro-eyebrow">Problem</p>
          <h2 className="sc-pro-title sc-pro-title--compact">Not another calculator directory</h2>
          <p className="sc-pro-lead mt-4 max-w-3xl">{INVESTOR_PROBLEM_STATEMENT.headline}</p>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-text-secondary">
            Free tools provide fast checks and SEO entry points. Premium analyzers add verdict,
            safe price, and export-ready reports. The platform layer governs how each tool is built,
            validated, and rolled out — not just how it renders on a page.
          </p>
        </Container>
      </section>

      <section className="sc-pro-section sc-pro-section--alt">
        <Container className="sc-pro-container">
          <p className="sc-pro-eyebrow">Dual-Core Intelligence</p>
          <h2 className="sc-pro-title sc-pro-title--compact">Two engines, one loop</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <article className="sc-pro-panel p-6">
              <h3 className="text-lg font-semibold text-ink-black">Mind 2 — Requirements</h3>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">{INVESTOR_DUAL_CORE.mind2}</p>
            </article>
            <article className="sc-pro-panel p-6">
              <h3 className="text-lg font-semibold text-ink-black">Mind 1 — Validation</h3>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">{INVESTOR_DUAL_CORE.mind1}</p>
            </article>
          </div>
        </Container>
      </section>

      <section className="sc-pro-section sc-pro-section--border">
        <Container className="sc-pro-container">
          <p className="sc-pro-eyebrow">Live proof</p>
          <h2 className="sc-pro-title sc-pro-title--compact">Production Smart Form pilots</h2>
          <p className="sc-pro-lead mt-3">
            {metrics.livePilotCount} routes live behind{" "}
            <code className="text-xs">NEXT_PUBLIC_SMART_FORM_PILOT</code> — classic form fallback when
            flag is off or slug is unsupported.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-3">
            {INVESTOR_LIVE_PILOTS.map((pilot) => (
              <li key={pilot.governanceSlug} className="sc-pro-panel p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">Live pilot</p>
                <p className="mt-2 font-semibold text-ink-black">{pilot.label}</p>
                <Link href={pilot.href} className="mt-3 inline-block text-sm font-semibold text-ink-black hover:underline">
                  Open route →
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-text-secondary">
            Rollout potential: {metrics.rolloutPotential} completed input-design patches ·{" "}
            {metrics.calculationBridgeEligible} eligible for calculation bridge staging.
          </p>
        </Container>
      </section>

      <section className="sc-pro-section sc-pro-section--alt">
        <Container className="sc-pro-container">
          <p className="sc-pro-eyebrow">Governance metrics</p>
          <h2 className="sc-pro-title sc-pro-title--compact">Formula governance exists</h2>
          <dl className="public-demo-metric-grid mt-8 grid gap-4">
            {[
              { label: "Formula contracts", value: metrics.formulaContracts },
              { label: "Trust trace ready", value: metrics.trustTraceReady },
              { label: "Tool Factory", value: metrics.toolFactoryStatus },
              { label: "Remaining debt items", value: metrics.remainingDebtCount },
            ].map((item) => (
              <div key={item.label} className="sc-pro-panel p-4">
                <dt className="text-xs uppercase tracking-wide text-text-secondary">{item.label}</dt>
                <dd className="mt-2 text-2xl font-semibold text-ink-black">{item.value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <section className="sc-pro-section sc-pro-section--border">
        <Container className="sc-pro-container">
          <p className="sc-pro-eyebrow">Trust Trace & reports</p>
          <h2 className="sc-pro-title sc-pro-title--compact">Report layer vision</h2>
          <p className="sc-pro-lead mt-3 max-w-3xl">
            Trust Trace documents inputs, assumptions, validation coverage, and limitations before
            any customer-facing export. Report renderer and output dry-runs are contracted — PDF,
            Excel, and Word export remain gated behind premium subscription.
          </p>
          <p className="mt-4 text-sm text-text-secondary">
            {metrics.trustTraceReady} tools trust-trace ready · export contracts defined · no fake
            revenue or user claims.
          </p>
        </Container>
      </section>

      <section className="sc-pro-section sc-pro-section--alt">
        <Container className="sc-pro-container">
          <p className="sc-pro-eyebrow">Tool Factory</p>
          <h2 className="sc-pro-title sc-pro-title--compact">Scale without losing control</h2>
          <p className="sc-pro-lead mt-3 max-w-3xl">
            Tool Factory accelerates sector tool production through governed pipelines — patch plans,
            controlled dry-run patches, and deploy-ready gates. Status: {metrics.toolFactoryStatus}.
            Human approval is required before any production deploy command is allowed.
          </p>
        </Container>
      </section>

      <section className="sc-pro-section sc-pro-section--border">
        <Container className="sc-pro-container">
          <p className="sc-pro-eyebrow">Demo flow</p>
          <h2 className="sc-pro-title sc-pro-title--compact">Suggested live walkthrough</h2>
          <ol className="mt-6 space-y-3">
            {INVESTOR_DEMO_FLOW_STEPS.map((step, index) => (
              <li key={step} className="flex gap-3 text-sm leading-relaxed text-text-secondary">
                <span className="font-semibold text-ink-black">{index + 1}.</span>
                {step}
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="sc-pro-section sc-pro-section--alt">
        <Container className="sc-pro-container">
          <p className="sc-pro-eyebrow">Moat</p>
          <h2 className="sc-pro-title sc-pro-title--compact">Defensible difference</h2>
          <ul className="mt-6 space-y-3">
            {INVESTOR_MOAT_BULLETS.map((bullet) => (
              <li key={bullet} className="flex gap-2 text-sm leading-relaxed text-text-secondary">
                <span className="text-ink-black" aria-hidden>
                  —
                </span>
                {bullet}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="sc-pro-section sc-pro-section--border">
        <Container className="sc-pro-container">
          <p className="sc-pro-eyebrow">Remaining work</p>
          <h2 className="sc-pro-title sc-pro-title--compact">Honest debt register (top items)</h2>
          <ul className="mt-6 divide-y divide-border-subtle rounded-xl border border-border-subtle bg-white">
            {debtEntries.map((entry) => (
              <li key={entry.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
                <span className="font-medium text-ink-black">{entry.category.replace(/_/g, " ")}</span>
                <span className="text-text-secondary">{entry.severity}</span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="bg-ink-black text-white">
        <Container className="sc-pro-container py-10 md:py-14">
          <p className="sc-pro-eyebrow text-white/70">Next 90 days</p>
          <h2 className="text-xl font-semibold tracking-tight md:text-2xl lg:text-3xl">Productization path</h2>
          <ul className="mt-6 space-y-2">
            {INVESTOR_NINETY_DAY_PLAN.map((step) => (
              <li key={step} className="text-sm text-white/85">
                — {step}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="sc-pro-section sc-pro-section--border">
        <Container className="sc-pro-container pb-10">
          <PublicDemoCrossLinks current="investor-demo" />
        </Container>
      </section>
    </div>
  );
}
