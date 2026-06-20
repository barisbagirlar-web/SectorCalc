// Auto-generated from lens-guc-hesaplama-schema.json
import * as z from 'zod';

export interface Lens_guc_hesaplamaInput {
  focalLength: number;
  objectDistance: number;
  dataConfidence?: number;
}

export const Lens_guc_hesaplamaInputSchema = z.object({
  focalLength: z.number().min(0).default(100),
  objectDistance: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Lens_guc_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 0.5 * input.focalLength * input.objectDistance * input.objectDistance / 1000 + input.focalLength * input.objectDistance / 100; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = 0.5 * input.focalLength * input.objectDistance * input.objectDistance / 1000 + input.focalLength * input.objectDistance / 100; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateLens_guc_hesaplama(input: Lens_guc_hesaplamaInput): Lens_guc_hesaplamaOutput {
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
    unit: "mm",
    premiumRequired: false,
    premiumFeatures: ["Detailed PDF report","Scenario comparison","Multi-year projections"],
  };
}


export interface Lens_guc_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Lens_guc_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "mm",
  breakdownKeys: ["result"],
} as const;

