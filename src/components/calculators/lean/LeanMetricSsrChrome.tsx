import type { LeanMetricHubDefinition } from "@/lib/features/tools/lean-metric-hubs";

/**
 * SSR chrome for Lean metric hubs (KARAR-4).
 * Must remain a Server Component — Source / Reference / Declared span + H1 in initial HTML.
 */
export function LeanMetricSsrChrome({ hub }: { hub: LeanMetricHubDefinition }) {
  return (
    <>
      <section id="hero" className="mb-10">
        <span className="inline-block bg-[var(--sc-surface-strong)] border border-[var(--sc-border)] text-[var(--sc-text)] px-3 py-1 text-xs font-semibold uppercase tracking-wider mb-6">
          {hub.eyebrow}
        </span>
        <h1 className="text-4xl lg:text-5xl font-heading heading-serif font-semibold text-[var(--sc-text)] leading-tight mb-6 max-w-[920px]">
          {hub.h1}
        </h1>
        <p className="text-lg text-[var(--sc-muted)] mb-8 max-w-[760px] leading-relaxed">{hub.lead}</p>
        <div className="flex flex-wrap gap-4 mb-4">
          <a
            href="#calculator"
            className="bg-[var(--sc-text)] !text-white font-semibold uppercase tracking-wider px-6 py-3 min-h-[48px] hover:bg-[var(--sc-muted)] transition-colors inline-flex items-center justify-center focus-visible"
          >
            Calculate {hub.definedTerm}
          </a>
          <a
            href="#scenarios"
            className="bg-transparent border border-[var(--sc-border)] text-[var(--sc-text)] font-semibold uppercase tracking-wider px-6 py-3 min-h-[48px] hover:bg-[var(--sc-surface)] transition-colors inline-flex items-center justify-center focus-visible"
          >
            View Scenarios
          </a>
          <a
            href="/lean"
            className="bg-transparent border border-[var(--sc-border)] text-[var(--sc-text)] font-semibold uppercase tracking-wider px-6 py-3 min-h-[48px] hover:bg-[var(--sc-surface)] transition-colors inline-flex items-center justify-center focus-visible"
          >
            Lean Methodology Hub
          </a>
        </div>
      </section>

      <section
        id="methodology-evidence"
        data-testid="ssr-evidence-strip"
        className="mb-10 border border-[var(--sc-border)] bg-[var(--sc-surface-strong)] p-5"
      >
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--sc-text)] mb-3">
          Calculation Methodology — Evidence Strip
        </h2>
        <dl className="space-y-2 text-sm text-[var(--sc-muted)]">
          <div>
            <dt className="inline font-semibold text-[var(--sc-text)]">Source verification: </dt>
            <dd className="inline">{hub.evidence.sourceVerification}</dd>
          </div>
          <div>
            <dt className="inline font-semibold text-[var(--sc-text)]">Reference: </dt>
            <dd className="inline">{hub.evidence.reference}</dd>
          </div>
          <div>
            <dt className="inline font-semibold text-[var(--sc-text)]">Declared span: </dt>
            <dd className="inline">{hub.evidence.declaredSpan}</dd>
          </div>
        </dl>
      </section>
    </>
  );
}
