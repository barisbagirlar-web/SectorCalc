import { hasFormulaSourceAudit } from "@/lib/formula-governance/formula-source-audit-registry";
import { FormulaGateReviewStatus } from "@/components/formula/FormulaGateReviewStatus";
import { FormulaSourceAuditBadge } from "@/components/formula/FormulaSourceAuditBadge";

type Props = {
  slug: string;
  locale: string;
  className?: string;
};

export function FormulaGateToolStatus({ slug, locale, className }: Props) {
  if (hasFormulaSourceAudit(slug)) {
    return <FormulaSourceAuditBadge slug={slug} locale={locale} className={className} />;
  }

  return <FormulaGateReviewStatus slug={slug} locale={locale} className={className} />;
}
