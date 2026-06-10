import Link from "@/lib/navigation/next-link";
import { DecisionToolLegalDisclaimer } from "@/components/tools/DecisionToolLegalDisclaimer";
import type { CaseStudyEntry } from "@/lib/case-studies/case-study-types";

type CaseStudyDetailProps = {
  readonly entry: CaseStudyEntry;
};

export function CaseStudyDetail({ entry }: CaseStudyDetailProps) {
  return (
    <article className="min-w-0 space-y-6">
      <header className="sc-industrial-panel sc-ledger-panel p-4 sm:p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-copper">{entry.sectorLabel}</p>
        <h1 className="mt-2 text-xl font-semibold text-navy sm:text-2xl">{entry.title}</h1>
        <p className="mt-2 rounded-md border border-copper/20 bg-copper/5 px-3 py-2 text-xs text-body-charcoal">
          Representative scenario — not a verified customer outcome.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-body-charcoal">{entry.problem}</p>
      </header>

      <section className="sc-industrial-panel p-4 sm:p-6">
        <h2 className="text-base font-semibold text-navy">Tool used</h2>
        <p className="mt-2 text-sm text-body-charcoal">{entry.toolTitle}</p>
        <Link href={`/tools/premium/${entry.toolSlug}`} className="sc-craft-card__cta mt-3 inline-block text-sm">
          Open tool
        </Link>
      </section>

      <section className="sc-industrial-panel p-4 sm:p-6">
        <h2 className="text-base font-semibold text-navy">Input summary</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-body-charcoal">
          {entry.inputSummary.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </section>

      <section className="sc-industrial-panel p-4 sm:p-6">
        <h2 className="text-base font-semibold text-navy">Calculation logic</h2>
        <p className="mt-2 text-sm leading-relaxed text-body-charcoal">{entry.calculationLogic}</p>
      </section>

      <section className="sc-industrial-panel p-4 sm:p-6">
        <h2 className="text-base font-semibold text-navy">Loss detected</h2>
        <p className="mt-2 text-sm font-medium text-navy">{entry.lossTypeLabel}</p>
        <p className="mt-2 text-sm text-body-charcoal">{entry.suggestedAction}</p>
        <p className="mt-3 text-sm text-body-charcoal">
          <span className="font-medium">Expected impact:</span> {entry.expectedImpact}
        </p>
      </section>

      <section className="sc-industrial-panel p-4 sm:p-6">
        <h2 className="text-base font-semibold text-navy">Assumptions</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-body-charcoal">
          {entry.assumptions.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <p className="text-xs leading-relaxed text-body-charcoal">{entry.disclaimer}</p>
      <DecisionToolLegalDisclaimer />
    </article>
  );
}
