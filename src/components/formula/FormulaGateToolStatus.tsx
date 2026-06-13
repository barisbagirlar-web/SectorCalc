import {
  canShowFormulaGateApproved,
  evaluateRuntimeTrust,
} from "@/lib/tools/runtime-trust-engine";
import { FormulaGateReviewStatus } from "@/components/formula/FormulaGateReviewStatus";
import { FormulaSourceAuditBadge } from "@/components/formula/FormulaSourceAuditBadge";

type Props = {
  slug: string;
  locale: string;
  className?: string;
  surface?: "free" | "premium";
};

export function FormulaGateToolStatus({ slug, locale, className, surface }: Props) {
  const resolvedSurface = surface ?? "free";
  const decision = evaluateRuntimeTrust({
    slug,
    locale,
    surface: resolvedSurface,
    premiumSurfaceUsesFreeCopy: false,
  });

  if (canShowFormulaGateApproved(decision)) {
    return (
      <FormulaSourceAuditBadge slug={slug} locale={locale} className={className} surface={surface} />
    );
  }

  return <FormulaGateReviewStatus slug={slug} locale={locale} className={className} />;
}
