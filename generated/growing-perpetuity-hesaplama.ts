// Auto-generated from growing-perpetuity-hesaplama-schema.json
import * as z from 'zod';

export interface Growing_perpetuity_hesaplamaInput {
  boardVolume: number;
  dataConfidence?: number;
}

export const Growing_perpetuity_hesaplamaInputSchema = z.object({
  boardVolume: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Growing_perpetuity_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.boardVolume * (1 + input.boardVolume/500) + Math.sqrt(input.boardVolume) * 5; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.boardVolume * (1 + input.boardVolume/500) + Math.sqrt(input.boardVolume) * 5; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateGrowing_perpetuity_hesaplama(input: Growing_perpetuity_hesaplamaInput): Growing_perpetuity_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    result: toNumericFormulaValue(values["result"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review assumptions."];
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
    unit: "L",
    premiumRequired: false,
    premiumFeatures: ["PDF report","Scenario comparison"],
  };
}


export interface Growing_perpetuity_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Growing_perpetuity_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "L",
  breakdownKeys: ["result"],
} as const;

