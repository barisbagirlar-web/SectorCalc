import { Clock3 } from "lucide-react";
import {
  getFormulaGateReviewLabel,
  getFormulaGateReviewTitle,
} from "@/lib/features/formula-governance/formula-gate-copy";

type Props = {
  slug: string;
  locale: string;
  className?: string;
};

export function FormulaGateReviewStatus({ slug, locale, className }: Props) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-800 shadow-sm",
        className ?? "",
      ].join(" ")}
      title={getFormulaGateReviewTitle(locale)}
      data-formula-source-audit="review-in-progress"
      data-formula-source-audit-slug={slug}
    >
      <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
      {getFormulaGateReviewLabel(locale)}
    </span>
  );
}
