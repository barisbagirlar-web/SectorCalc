export function getFormulaGateVerifiedLabel(locale: string): string {
  return locale === "tr" ? "Formula Gate Onaylı" : "Formula Gate Approved";
}

export function getFormulaGateVerifiedTitle(locale: string): string {
  return locale === "tr"
    ? "Bu hesaplama aracı Formula Gate kalite kapısından geçmiştir."
    : "This calculation tool has passed the Formula Gate quality check.";
}

export function getFormulaGateReviewLabel(locale: string): string {
  return locale === "tr" ? "Hesaplama gözden geçiriliyor" : "Calculation under review";
}

export function getFormulaGateReviewTitle(locale: string): string {
  return locale === "tr"
    ? "Bu hesaplama aracı kalite kontrolünden geçiriliyor. Formula Gate onayı yalnızca canlı yüzey hazır olduğunda gösterilir."
    : "This calculator is under quality review. The Formula Gate badge appears only when the live surface is runtime-ready.";
}

/** @deprecated Use getFormulaGateReviewLabel — kept for catalog meta compatibility */
export function getFormulaGateReviewLabelLegacy(locale: string): string {
  return locale === "tr" ? "Formula Gate incelemesi sürüyor" : "Formula Gate review in progress";
}
