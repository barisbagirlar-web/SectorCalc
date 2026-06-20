// Auto-generated from oil-barrels-to-litre-hesaplama-schema.json
import * as z from 'zod';

export interface Oil_barrels_to_litre_hesaplamaInput {
  volumeValue: number;
  dataConfidence?: number;
}

export const Oil_barrels_to_litre_hesaplamaInputSchema = z.object({
  volumeValue: z.number().min(0).default(100),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Oil_barrels_to_litre_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.volumeValue * 1.0 + Math.log(input.volumeValue + 1) * 0.5; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.volumeValue * 1.0 + Math.log(input.volumeValue + 1) * 0.5; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateOil_barrels_to_litre_hesaplama(input: Oil_barrels_to_litre_hesaplamaInput): Oil_barrels_to_litre_hesaplamaOutput {
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
    unit: "m³",
    premiumRequired: false,
    premiumFeatures: ["PDF report","Scenario comparison"],
  };
}


export interface Oil_barrels_to_litre_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Oil_barrels_to_litre_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "m³",
  breakdownKeys: ["result"],
} as const;

