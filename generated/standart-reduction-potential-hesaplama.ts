// Auto-generated from standart-reduction-potential-hesaplama-schema.json
import * as z from 'zod';

export interface Standart_reduction_potential_hesaplamaInput {
  innerPressure: number;
  vesselRadius: number;
  dataConfidence?: number;
}

export const Standart_reduction_potential_hesaplamaInputSchema = z.object({
  innerPressure: z.number().min(0).default(100),
  vesselRadius: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Standart_reduction_potential_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.innerPressure * Math.exp(-input.vesselRadius / 100) + input.innerPressure * input.vesselRadius / 1000; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.innerPressure * Math.exp(-input.vesselRadius / 100) + input.innerPressure * input.vesselRadius / 1000; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateStandart_reduction_potential_hesaplama(input: Standart_reduction_potential_hesaplamaInput): Standart_reduction_potential_hesaplamaOutput {
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


export interface Standart_reduction_potential_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Standart_reduction_potential_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "Pa",
  breakdownKeys: ["result"],
} as const;

