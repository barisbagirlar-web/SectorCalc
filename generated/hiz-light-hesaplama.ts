// Auto-generated from hiz-light-hesaplama-schema.json
import * as z from 'zod';

export interface Hiz_light_hesaplamaInput {
  wavelength: number;
  param2: number;
  dataConfidence?: number;
}

export const Hiz_light_hesaplamaInputSchema = z.object({
  wavelength: z.number().min(0).default(100),
  param2: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Hiz_light_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 0.5 * input.wavelength * input.param2 * input.param2 / 1000 + input.wavelength * input.param2 / 100; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = 0.5 * input.wavelength * input.param2 * input.param2 / 1000 + input.wavelength * input.param2 / 100; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateHiz_light_hesaplama(input: Hiz_light_hesaplamaInput): Hiz_light_hesaplamaOutput {
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
    unit: "nm",
    premiumRequired: false,
    premiumFeatures: ["Detailed PDF report","Scenario comparison","Multi-year projections"],
  };
}


export interface Hiz_light_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Hiz_light_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "nm",
  breakdownKeys: ["result"],
} as const;

