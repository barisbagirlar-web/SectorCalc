export function getFormulaGateVerifiedLabel(locale: string): string {
  return "Formula Gate Approved";
}

export function getFormulaGateVerifiedTitle(locale: string): string {
  return "This calculation tool has passed the Formula Gate quality check.";
}

export function getFormulaGateReviewLabel(locale: string): string {
  return "Calculation under review";
}

export function getFormulaGateReviewTitle(locale: string): string {
  return "This calculator is under quality review. The Formula Gate badge appears only when the live surface is runtime-ready.";
}

/** @deprecated Use getFormulaGateReviewLabel — kept for catalog meta compatibility */
export function getFormulaGateReviewLabelLegacy(locale: string): string {
  return "Formula Gate review in progress";
}
