// Auto-generated from fermentation-hesaplama-schema.json
import * as z from 'zod';

export interface Fermentation_hesaplamaInput {
  originalGravity: number;
  finalGravity: number;
  dataConfidence?: number;
}

export const Fermentation_hesaplamaInputSchema = z.object({
  originalGravity: z.number().min(0).default(100),
  finalGravity: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Fermentation_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.originalGravity / input.finalGravity * 100 + Math.sqrt(input.originalGravity * input.finalGravity) / 10; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.originalGravity / input.finalGravity * 100 + Math.sqrt(input.originalGravity * input.finalGravity) / 10; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateFermentation_hesaplama(input: Fermentation_hesaplamaInput): Fermentation_hesaplamaOutput {
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
    unit: "SG",
    premiumRequired: false,
    premiumFeatures: ["Detailed PDF report","Scenario comparison","Multi-year projections"],
  };
}


export interface Fermentation_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Fermentation_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "SG",
  breakdownKeys: ["result"],
} as const;

