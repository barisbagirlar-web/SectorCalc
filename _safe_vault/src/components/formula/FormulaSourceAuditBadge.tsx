import { getFormulaSourceAuditStatus } from "@/lib/formula-governance/formula-source-audit-registry";
import {
  canShowFormulaGateApproved,
  evaluateRuntimeTrust,
} from "@/lib/tools/runtime-trust-engine";
import { CheckCircle2 } from "lucide-react";
import {
  getFormulaGateVerifiedLabel,
  getFormulaGateVerifiedTitle,
} from "@/lib/formula-governance/formula-gate-copy";

type Props = {
  slug: string;
  locale: string;
  className?: string;
  surface?: "free" | "premium";
};

export function FormulaSourceAuditBadge({ slug, locale, className, surface }: Props) {
  const status = getFormulaSourceAuditStatus(slug);
  const resolvedSurface = surface ?? "free";
  const decision = evaluateRuntimeTrust({
    slug,
    locale,
    surface: resolvedSurface,
    premiumSurfaceUsesFreeCopy: false,
  });
  const eligible = Boolean(status) && canShowFormulaGateApproved(decision);

  if (!status || !eligible) {
    return null;
  }

  const label = getFormulaGateVerifiedLabel(locale);
  const title = getFormulaGateVerifiedTitle(locale);

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
