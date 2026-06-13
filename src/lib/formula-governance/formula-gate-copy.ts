export function getFormulaGateVerifiedLabel(locale: string): string {
  return locale === "tr" ? "Formula Gate Onaylı" : "Formula Gate Verified";
}

export function getFormulaGateVerifiedTitle(locale: string): string {
  return locale === "tr"
    ? "Bu hesaplama aracı Formula Gate kalite kapısından geçmiştir."
    : "This calculation tool has passed the Formula Gate quality check.";
}

export function getFormulaGateReviewLabel(locale: string): string {
  return locale === "tr" ? "Formula Gate incelemesi sürüyor" : "Formula Gate review in progress";
}

export function getFormulaGateReviewTitle(locale: string): string {
  return locale === "tr"
    ? "Bu hesaplama aracı Formula Gate incelemesindedir. Sonuçlar tamamlanana kadar mühür gösterilmez."
    : "This calculation tool is under Formula Gate review. The verified badge appears only after PASS.";
}
