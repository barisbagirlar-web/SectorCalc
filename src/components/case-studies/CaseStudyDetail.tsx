import Link from "@/lib/navigation/next-link";
import { DecisionToolLegalDisclaimer } from "@/components/tools/DecisionToolLegalDisclaimer";
import {
  getCaseStudyToolHref,
  type CaseStudyEntry,
} from "@/lib/case-studies/case-study-types";

type CaseStudyDetailProps = {
  readonly entry: CaseStudyEntry;
};

export function CaseStudyDetail({ entry }: CaseStudyDetailProps) {
  const toolHref = getCaseStudyToolHref(entry);

  return (
    <article className="min-w-0 space-y-6">
      <header className="sc-industrial-panel sc-ledger-panel p-4 sm:p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-copper">{entry.sectorLabel}</p>
        <h1 className="mt-2 text-xl font-semibold text-navy sm:text-2xl">{entry.title}</h1>
        <p className="mt-2 rounded-md border border-copper/20 bg-copper/5 px-3 py-2 text-xs text-body-charcoal">
          Representative case study — not a verified customer outcome.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-body-charcoal">{entry.problem}</p>
      </header>

      <section className="sc-industrial-panel p-4 sm:p-6">
        <h2 className="text-base font-semibold text-navy">Input set</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-body-charcoal">
          {entry.inputSummary.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </section>

      <section className="sc-industrial-panel p-4 sm:p-6">
        <h2 className="text-base font-semibold text-navy">Hidden loss</h2>
        <p className="mt-2 text-sm leading-relaxed text-body-charcoal">{entry.hiddenLoss}</p>
        <p className="mt-2 text-sm font-medium text-navy">{entry.lossTypeLabel}</p>
      </section>

      <section className="sc-industrial-panel p-4 sm:p-6">
        <h2 className="text-base font-semibold text-navy">Calculation result</h2>
        <p className="mt-2 text-sm leading-relaxed text-body-charcoal">{entry.calculationResult}</p>
        <p className="mt-3 text-sm leading-relaxed text-body-charcoal">{entry.calculationLogic}</p>
      </section>

      <section className="sc-industrial-panel p-4 sm:p-6">
        <h2 className="text-base font-semibold text-navy">Suggested action</h2>
        <p className="mt-2 text-sm leading-relaxed text-body-charcoal">{entry.suggestedAction}</p>
        <p className="mt-3 text-sm text-body-charcoal">
          <span className="font-medium">Estimated impact:</span> {entry.expectedImpact ?? "N/A"}
        </p>
      </section>

      <section className="sc-industrial-panel p-4 sm:p-6">
        <h2 className="text-base font-semibold text-navy">Methodology note</h2>
        <p className="mt-2 text-sm leading-relaxed text-body-charcoal">{entry.methodologyNote ?? "Standard engineering estimates."}</p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-body-charcoal">
          {(entry.assumptions ?? []).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="sc-industrial-panel p-4 sm:p-6">
        <h2 className="text-base font-semibold text-navy">Related calculator</h2>
        <p className="mt-2 text-sm text-body-charcoal">{entry.toolTitle}</p>
        <Link
          href={toolHref}
          className="sc-cta-primary mt-4 inline-flex min-h-[44px] items-center px-4 text-sm"
          data-case-study-tool-cta="true"
        >
          Open {entry.toolTitle}
        </Link>
      </section>

      <p className="text-xs leading-relaxed text-body-charcoal">{entry.disclaimer}</p>
      <DecisionToolLegalDisclaimer />
    </article>
  );
}
