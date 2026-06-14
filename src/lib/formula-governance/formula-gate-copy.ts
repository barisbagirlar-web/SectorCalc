export const FORMULA_GATE_STATUS_LABELS: Record<string, string> = {};
export const FORMULA_GATE_REVIEW_COPY = { pending: "Pending regeneration." } as const;

export function resolveFormulaGateStatusLabel(_status: string): string {
  return "Pending";
}

export function resolveFormulaGateReviewCopy(_status: string): string {
  return FORMULA_GATE_REVIEW_COPY.pending;
}

export function getFormulaGateVerifiedLabel(_locale: string): string {
  return "Verified";
}

export function getFormulaGateVerifiedTitle(_locale: string): string {
  return "Formula verification pending regeneration.";
}

export function getFormulaGateReviewLabel(_locale: string): string {
  return "Review pending";
}

export function getFormulaGateReviewTitle(_locale: string): string {
  return "Formula review pending regeneration.";
}
