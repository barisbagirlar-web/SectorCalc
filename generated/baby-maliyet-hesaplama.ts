// Auto-generated from baby-maliyet-hesaplama-schema.json
import * as z from 'zod';

export interface Baby_maliyet_hesaplamaInput {
  quantity: number;
  unitCost: number;
  dataConfidence?: number;
}

export const Baby_maliyet_hesaplamaInputSchema = z.object({
  quantity: z.number().min(0).default(100),
  unitCost: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Baby_maliyet_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.quantity * input.unitCost; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.quantity * input.unitCost; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateBaby_maliyet_hesaplama(input: Baby_maliyet_hesaplamaInput): Baby_maliyet_hesaplamaOutput {
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
    unit: "adet",
    premiumRequired: false,
    premiumFeatures: ["Detailed PDF report","Scenario comparison","Multi-year projections"],
  };
}


export interface Baby_maliyet_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Baby_maliyet_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "adet",
  breakdownKeys: ["result"],
} as const;

