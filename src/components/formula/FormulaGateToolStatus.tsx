import { hasFormulaSourceAudit } from "@/lib/formula-governance/formula-source-audit-registry";
import { isFormulaGateEligible } from "@/lib/tools/runtime-readiness";
import { FormulaGateReviewStatus } from "@/components/formula/FormulaGateReviewStatus";
import { FormulaSourceAuditBadge } from "@/components/formula/FormulaSourceAuditBadge";

type Props = {
  slug: string;
  locale: string;
  className?: string;
  surface?: "free" | "premium";
};

export function FormulaGateToolStatus({ slug, locale, className, surface }: Props) {
  const eligible =
    hasFormulaSourceAudit(slug) &&
    isFormulaGateEligible(slug, locale, surface ?? "free");

  if (eligible) {
    return <FormulaSourceAuditBadge slug={slug} locale={locale} className={className} />;
  }

  return <FormulaGateReviewStatus slug={slug} locale={locale} className={className} />;
}
