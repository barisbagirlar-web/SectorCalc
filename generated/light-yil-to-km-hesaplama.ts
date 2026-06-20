// Auto-generated from light-yil-to-km-hesaplama-schema.json
import * as z from 'zod';

export interface Light_yil_to_km_hesaplamaInput {
  wavelength: number;
  param2: number;
  dataConfidence?: number;
}

export const Light_yil_to_km_hesaplamaInputSchema = z.object({
  wavelength: z.number().min(0).default(100),
  param2: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Light_yil_to_km_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.wavelength * input.param2 + Math.floor(input.wavelength / input.param2) * 0.5; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.wavelength * input.param2 + Math.floor(input.wavelength / input.param2) * 0.5; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateLight_yil_to_km_hesaplama(input: Light_yil_to_km_hesaplamaInput): Light_yil_to_km_hesaplamaOutput {
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


export interface Light_yil_to_km_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Light_yil_to_km_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "nm",
  breakdownKeys: ["result"],
} as const;

