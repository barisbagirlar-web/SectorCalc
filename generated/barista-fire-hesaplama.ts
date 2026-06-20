// Auto-generated from barista-fire-hesaplama-schema.json
import * as z from 'zod';

export interface Barista_fire_hesaplamaInput {
  pressureValue: number;
  param2: number;
  dataConfidence?: number;
}

export const Barista_fire_hesaplamaInputSchema = z.object({
  pressureValue: z.number().min(0).default(100),
  param2: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Barista_fire_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.pressureValue / input.param2 * 100 + Math.sqrt(input.pressureValue * input.param2) / 10; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.pressureValue / input.param2 * 100 + Math.sqrt(input.pressureValue * input.param2) / 10; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateBarista_fire_hesaplama(input: Barista_fire_hesaplamaInput): Barista_fire_hesaplamaOutput {
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
    unit: "Pa",
    premiumRequired: false,
    premiumFeatures: ["Detailed PDF report","Scenario comparison","Multi-year projections"],
  };
}


export interface Barista_fire_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Barista_fire_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "Pa",
  breakdownKeys: ["result"],
} as const;

