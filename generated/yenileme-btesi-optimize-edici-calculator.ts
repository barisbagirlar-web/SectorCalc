// Auto-generated premium calculator: yenileme-btesi-optimize-edici
import * as z from 'zod';

export interface YenilemeBtesiOptimizeEdiciInput {
  alanM2: number;
  yenilemeSeviyesi: string;
  projeSuresiAy: number;
  m2BazMaliyet: number;
  enflasyon: number;
  riskFaktoru: number;
  tasarımIzinOranları: number;
  fFEButcesi: number;
  eskiYeniMulkDegeri: number;
}

export const YenilemeBtesiOptimizeEdiciInputSchema = z.object({
  alanM2: z.number().min(0).default(0),
  yenilemeSeviyesi: z.number().min(0).default(0),
  projeSuresiAy: z.number().min(0).default(0),
  m2BazMaliyet: z.number().min(0).default(0),
  enflasyon: z.number().min(0).default(0),
  riskFaktoru: z.number().min(0).default(0),
  tasarımIzinOranları: z.number().min(0).default(0),
  fFEButcesi: z.number().min(0).default(0),
  eskiYeniMulkDegeri: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.area * input.costPerSqMByComplexity; results["baseCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["baseCost"] = Number.NaN; }
  try { const v = input.baseCost * input.inflationRate * input.projectDuration; results["escalation"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["escalation"] = Number.NaN; }
  try { const v = input.baseCost * input.escalation * input.riskFactor; results["contingency"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["contingency"] = Number.NaN; }
  try { const v = input.baseCost * input.escalation * input.designFeePct * input.permitFeePct; results["softCosts"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["softCosts"] = Number.NaN; }
  try { const v = input.baseCost * input.escalation * input.contingency * input.softCosts * input.fFE; results["totalBudget"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalBudget"] = Number.NaN; }
  try { const v = input.newPropertyValue * input.oldPropertyValue * input.totalBudget; results["rOIRenovation"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["rOIRenovation"] = Number.NaN; }
  return results;
}

export function calculateYenilemeBtesiOptimizeEdici(input) {
  return evaluateAllFormulas(input);
}
