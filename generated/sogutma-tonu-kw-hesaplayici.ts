// Auto-generated from sogutma-tonu-kw-hesaplayici-schema.json
import * as z from 'zod';

export interface Sogutma_tonu_kw_hesaplayiciInput {
  powerValue: number;
  timeDuration: number;
  dataConfidence?: number;
}

export const Sogutma_tonu_kw_hesaplayiciInputSchema = z.object({
  powerValue: z.number().min(0).default(100),
  timeDuration: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Sogutma_tonu_kw_hesaplayiciInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.powerValue * input.timeDuration + Math.floor(input.powerValue / input.timeDuration) * 0.5; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.powerValue * input.timeDuration + Math.floor(input.powerValue / input.timeDuration) * 0.5; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateSogutma_tonu_kw_hesaplayici(input: Sogutma_tonu_kw_hesaplayiciInput): Sogutma_tonu_kw_hesaplayiciOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    result: toNumericFormulaValue(values["result"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Consult with a professional.","Review assumptions regularly."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    unit: "W",
    premiumRequired: false,
    premiumFeatures: ["Detailed PDF report","Scenario comparison","Multi-year projections"],
  };
}


export interface Sogutma_tonu_kw_hesaplayiciOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Sogutma_tonu_kw_hesaplayiciOutputMeta = {
  primaryKey: "result",
  unit: "W",
  breakdownKeys: ["result"],
} as const;

