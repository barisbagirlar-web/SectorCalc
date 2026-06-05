import { REVENUE_LEGAL_DISCLAIMER } from "@/lib/tools/revenue-tools";

export function DecisionToolLegalDisclaimer() {
  return (
    <p className="rounded-lg border border-slate/15 bg-off-white px-4 py-3 text-xs leading-relaxed text-slate">
      {REVENUE_LEGAL_DISCLAIMER}
    </p>
  );
}
