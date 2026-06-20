// Auto-generated from sqft-sqm-hesaplayici-schema.json
import * as z from 'zod';

export interface Sqft_sqm_hesaplayiciInput {
  areaValue: number;
  dataConfidence?: number;
}

export const Sqft_sqm_hesaplayiciInputSchema = z.object({
  areaValue: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Sqft_sqm_hesaplayiciInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.areaValue * (1 + input.areaValue/500) + Math.sqrt(input.areaValue) * 5; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.areaValue * (1 + input.areaValue/500) + Math.sqrt(input.areaValue) * 5; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateSqft_sqm_hesaplayici(input: Sqft_sqm_hesaplayiciInput): Sqft_sqm_hesaplayiciOutput {
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
    unit: "m²",
    premiumRequired: false,
    premiumFeatures: ["PDF report","Scenario comparison"],
  };
}


export interface Sqft_sqm_hesaplayiciOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Sqft_sqm_hesaplayiciOutputMeta = {
  primaryKey: "result",
  unit: "m²",
  breakdownKeys: ["result"],
} as const;

