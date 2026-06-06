import {
  REVENUE_LEGAL_DISCLAIMER,
  REVENUE_LEGAL_DISCLAIMER_PAID,
} from "@/lib/tools/revenue-tools";

interface DecisionToolLegalDisclaimerProps {
  variant?: "free" | "paid";
}

export function DecisionToolLegalDisclaimer({
  variant = "free",
}: DecisionToolLegalDisclaimerProps) {
  return (
    <p className="rounded-lg border border-slate/15 bg-off-white px-4 py-3 text-xs leading-relaxed text-slate">
      {variant === "paid" ? REVENUE_LEGAL_DISCLAIMER_PAID : REVENUE_LEGAL_DISCLAIMER}
    </p>
  );
}
