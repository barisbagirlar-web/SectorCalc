// Auto-generated from appliance-enerji-hesaplama-schema.json
import * as z from 'zod';

export interface Appliance_enerji_hesaplamaInput {
  powerRating: number;
  usageHours: number;
  dataConfidence?: number;
}

export const Appliance_enerji_hesaplamaInputSchema = z.object({
  powerRating: z.number().min(0).default(100),
  usageHours: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Appliance_enerji_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 0.5 * input.powerRating * input.usageHours * input.usageHours / 1000 + input.powerRating * input.usageHours / 100; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = 0.5 * input.powerRating * input.usageHours * input.usageHours / 1000 + input.powerRating * input.usageHours / 100; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateAppliance_enerji_hesaplama(input: Appliance_enerji_hesaplamaInput): Appliance_enerji_hesaplamaOutput {
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


export interface Appliance_enerji_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Appliance_enerji_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "W",
  breakdownKeys: ["result"],
} as const;

