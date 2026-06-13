"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  getCaseStudyToolHref,
  type CaseStudyEntry,
} from "@/lib/case-studies/case-study-types";

type CaseStudyProofPanelProps = {
  readonly entry: CaseStudyEntry;
};

/** Localized, focused proof summary for a representative case study. */
export function CaseStudyProofPanel({ entry }: CaseStudyProofPanelProps) {
  const t = useTranslations("caseStudies");
  const toolHref = getCaseStudyToolHref(entry);

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
          <h3 className="text-sm font-semibold text-navy">{t("inputSet")}</h3>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-body-charcoal">
            {entry.inputSummary.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-navy">{t("hiddenLoss")}</h3>
          <p className="mt-1 text-sm leading-relaxed text-body-charcoal">{entry.hiddenLoss}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-navy">{t("calculationResult")}</h3>
          <p className="mt-1 text-sm leading-relaxed text-body-charcoal">{entry.calculationResult}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-navy">{t("suggestedAction")}</h3>
          <p className="mt-1 text-sm text-body-charcoal">{entry.suggestedAction}</p>
          <p className="mt-1 text-sm text-body-charcoal">
            <span className="font-medium">{t("estimatedImpact")}:</span> {entry.expectedImpact}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-navy">{t("methodologyNote")}</h3>
          <p className="mt-1 text-sm leading-relaxed text-body-charcoal">{entry.methodologyNote}</p>
        </div>
      </div>

      <Link
        href={toolHref}
        className="sc-cta-primary mt-4 inline-flex min-h-[44px] items-center px-4 text-sm"
        data-case-study-tool-cta="true"
      >
        {t("viewRelatedTool")}
      </Link>
    </section>
  );
}
