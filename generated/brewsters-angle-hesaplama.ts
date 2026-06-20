// Auto-generated from brewsters-angle-hesaplama-schema.json
import * as z from 'zod';

export interface Brewsters_angle_hesaplamaInput {
  originalGravity: number;
  finalGravity: number;
  dataConfidence?: number;
}

export const Brewsters_angle_hesaplamaInputSchema = z.object({
  originalGravity: z.number().min(0).default(100),
  finalGravity: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Brewsters_angle_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.originalGravity / input.finalGravity * 100 + Math.sqrt(input.originalGravity * input.finalGravity) / 10; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.originalGravity / input.finalGravity * 100 + Math.sqrt(input.originalGravity * input.finalGravity) / 10; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateBrewsters_angle_hesaplama(input: Brewsters_angle_hesaplamaInput): Brewsters_angle_hesaplamaOutput {
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


export interface Brewsters_angle_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Brewsters_angle_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "SG",
  breakdownKeys: ["result"],
} as const;

