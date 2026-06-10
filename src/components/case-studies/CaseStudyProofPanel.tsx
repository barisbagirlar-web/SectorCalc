"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import type { CaseStudyEntry } from "@/lib/case-studies/case-study-types";

type CaseStudyProofPanelProps = {
  readonly entry: CaseStudyEntry;
};

/** Localized, focused proof summary for a representative case study. */
export function CaseStudyProofPanel({ entry }: CaseStudyProofPanelProps) {
  const t = useTranslations("caseStudies");

  return (
    <section
      data-case-study-proof-panel="true"
      aria-labelledby="case-study-proof-heading"
      className="sc-industrial-panel sc-ledger-panel p-4 sm:p-6"
    >
      <p className="text-xs font-medium uppercase tracking-wide text-copper">{entry.sectorLabel}</p>
      <h2 id="case-study-proof-heading" className="mt-1 text-lg font-semibold text-navy sm:text-xl">
        {entry.title}
      </h2>
      <p className="mt-2 rounded-md border border-copper/20 bg-copper/5 px-3 py-2 text-xs text-body-charcoal">
        {t("representativeNote")}
      </p>

      <div className="mt-4 space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-navy">{t("problem")}</h3>
          <p className="mt-1 text-sm leading-relaxed text-body-charcoal">{entry.problem}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-navy">{t("exampleInput")}</h3>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-body-charcoal">
            {entry.inputSummary.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-navy">{t("result")}</h3>
          <p className="mt-1 text-sm leading-relaxed text-body-charcoal">{entry.calculationLogic}</p>
          <p className="mt-1 text-sm text-body-charcoal">{entry.expectedImpact}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-navy">{t("decisionImpact")}</h3>
          <p className="mt-1 text-sm font-medium text-navy">{entry.lossTypeLabel}</p>
          <p className="mt-1 text-sm text-body-charcoal">{entry.suggestedAction}</p>
        </div>
      </div>

      <Link
        href={`/tools/premium/${entry.toolSlug}`}
        className="sc-craft-card__cta mt-4 inline-block text-sm"
      >
        {t("viewRelatedTool")}
      </Link>
    </section>
  );
}
