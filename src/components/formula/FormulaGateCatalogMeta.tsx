import {
  getFormulaGateReviewLabel,
  getFormulaGateVerifiedLabel,
} from "@/lib/features/formula-governance/formula-gate-copy";
import {
  canShowFormulaGateApproved,
  evaluateRuntimeTrust,
} from "@/lib/features/tools/runtime-trust-engine";

type Props = {
  slug: string;
  locale: string;
  openLabel: string;
  isClickable: boolean;
};

export function FormulaGateCatalogMeta({ slug, locale, openLabel, isClickable }: Props) {
  const decision = evaluateRuntimeTrust({
    slug,
    locale,
    surface: "premium",
    premiumSurfaceUsesFreeCopy: false,
  });
  const eligible = isClickable && canShowFormulaGateApproved(decision);

  if (eligible) {
    return (
      <>
        <p className="sc-premium-tool-card__meta">{openLabel}</p>
        <p
          className="mt-1 text-[10px] font-semibold text-emerald-700"
          data-formula-source-audit="verified"
          data-formula-source-audit-slug={slug}
        >
          {getFormulaGateVerifiedLabel(locale)}
        </p>
      </>
    );
  }

  if (!isClickable) {
    return (
      <p
        className="sc-premium-tool-card__meta"
        data-formula-source-audit="review-in-progress"
        data-formula-source-audit-slug={slug}
      >
        {getFormulaGateReviewLabel(locale)}
      </p>
    );
  }

  return (
    <>
      <p className="sc-premium-tool-card__meta">{openLabel}</p>
      <p
        className="mt-1 text-[10px] font-semibold text-amber-800"
        data-formula-source-audit="review-in-progress"
        data-formula-source-audit-slug={slug}
      >
        {getFormulaGateReviewLabel(locale)}
      </p>
    </>
  );
}
