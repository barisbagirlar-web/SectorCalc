// Auto-generated from chair-rail-hesaplama-schema.json
import * as z from 'zod';

export interface Chair_rail_hesaplamaInput {
  deskHeight: number;
  dataConfidence?: number;
}

export const Chair_rail_hesaplamaInputSchema = z.object({
  deskHeight: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Chair_rail_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.deskHeight * (1 + input.deskHeight/500) + Math.sqrt(input.deskHeight) * 5; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.deskHeight * (1 + input.deskHeight/500) + Math.sqrt(input.deskHeight) * 5; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateChair_rail_hesaplama(input: Chair_rail_hesaplamaInput): Chair_rail_hesaplamaOutput {
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
    unit: "cm",
    premiumRequired: false,
    premiumFeatures: ["PDF report","Scenario comparison"],
  };
}


export interface Chair_rail_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Chair_rail_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "cm",
  breakdownKeys: ["result"],
} as const;

