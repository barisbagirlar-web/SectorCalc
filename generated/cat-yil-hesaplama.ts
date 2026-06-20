// Auto-generated from cat-yil-hesaplama-schema.json
import * as z from 'zod';

export interface Cat_yil_hesaplamaInput {
  petAge: number;
  petWeight: number;
  dataConfidence?: number;
}

export const Cat_yil_hesaplamaInputSchema = z.object({
  petAge: z.number().min(0).default(100),
  petWeight: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Cat_yil_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.petAge * input.petWeight + Math.floor(input.petAge / input.petWeight) * 0.5; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.petAge * input.petWeight + Math.floor(input.petAge / input.petWeight) * 0.5; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateCat_yil_hesaplama(input: Cat_yil_hesaplamaInput): Cat_yil_hesaplamaOutput {
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
    unit: "years",
    premiumRequired: false,
    premiumFeatures: ["Detailed PDF report","Scenario comparison","Multi-year projections"],
  };
}


export interface Cat_yil_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Cat_yil_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "years",
  breakdownKeys: ["result"],
} as const;

