import { CheckCircle2 } from "lucide-react";
import { getFormulaSourceAuditStatus } from "@/lib/formula-governance/formula-source-audit-registry";

type Props = {
  slug: string;
  locale: string;
  className?: string;
};

export function FormulaSourceAuditBadge({ slug, locale, className }: Props) {
  const status = getFormulaSourceAuditStatus(slug);

  if (!status) return null;

  const isTr = locale === "tr";

  const label = isTr ? "Formula Gate Onaylı" : "Formula Gate Verified";
  const title = isTr
    ? "Bu hesaplama aracı 7 Muda kalite standardı kapsamında schema, input, formül kaynağı, validation, test ve rapor zincirinden geçirilmiştir."
    : "This calculation tool has passed the 7 Muda quality standard for schema, input, formula source, validation, tests and reporting chain.";

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 shadow-sm",
        className ?? "",
      ].join(" ")}
      title={title}
      data-formula-source-audit="verified"
      data-formula-source-audit-slug={slug}
      data-formula-source-audit-standard={status.standardReference}
    >
      <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
      {label}
    </span>
  );
}
